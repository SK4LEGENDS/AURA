/**
 * Robust JSON Parser for LLM Responses
 * Handles comments, trailing commas, missing commas, and formatting issues.
 */

export function cleanAndParseJson(text: string): any | null {
    if (!text) return null;

    // --- AGGRESSIVE PRE-CLEANING ---
    // Remove citation markers globally first [1], [1, 2], etc.
    let cleaned = text.replace(/\[\d+(?:,\s*\d+|-\d+)*\]/g, "");

    // --- DELIMITED BLOCK EXTRACTION ---
    // If the special marker is present, prioritize it
    // Handle both closed and open-ended markers (common if AI gets cut off)
    const markerMatch = cleaned.match(/<<<GRAPH_JSON>>>\s*([\s\S]*?)(?:<<<GRAPH_JSON>>>|$)/);
    if (markerMatch) {
        cleaned = markerMatch[1].trim();
    } else {
        // Fallback to markdown code blocks
        const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonBlockMatch) {
            cleaned = jsonBlockMatch[1];
        }
    }

    // --- TYPO HANDLING ($graph -> graph) ---
    // Handle cases where AI prefix keys with $
    cleaned = cleaned.replace(/"\$graph"/g, '"graph"');
    cleaned = cleaned.replace(/"\$data"/g, '"data"');

    // --- ENHANCED CLEANUP ---

    // 1. Remove single line comments (// and #)
    cleaned = cleaned.replace(/(\/\/|#).*$/gm, "");

    // 2. Remove multi-line comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");

    // 3. Remove citation markers like [1], [1, 2], [12-15]
    // These often appear inside LLM generated JSON strings or after values
    // Do this BEFORE other replacements to avoid interference
    cleaned = cleaned.replace(/\[\d+(?:,\s*\d+|-\d+)*\]/g, "");
    // Also handle trailing citations like [1] that might not be in brackets but isolated
    // but we have to be careful not to strip array indices. 
    // Usually citations in these responses are bracketed.

    // 4. Replace single quotes with double quotes (only if not preceded by backslash)
    cleaned = cleaned.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

    // 5. Replace equals signs with colons between keys and values
    cleaned = cleaned.replace(/("?\w+"?)\s*=\s*/g, '$1: ');

    // 6. Replace smart quotes
    cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');

    // 7. Fix unquoted keys (e.g. { key: "value" } -> { "key": "value" })
    cleaned = cleaned.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

    // 8. Fix stray quotes at the end of numbers or values
    cleaned = cleaned.replace(/:\s*(\d+)'/g, ': $1');
    cleaned = cleaned.replace(/:\s*"([^"]+)"'/g, ': "$1"');

    // 9. Remove trailing commas before closing braces/brackets
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

    // 10. Fix multiple colons or commas
    cleaned = cleaned.replace(/:+/g, ':');
    cleaned = cleaned.replace(/,+/g, ',');

    // 11. Fix missing commas between objects in arrays
    cleaned = cleaned.replace(/}(\s*){/g, '},$1{');

    // 12. Remove placeholders like "..." inside arrays or objects
    cleaned = cleaned.replace(/,\s*"\.\.\."/g, '');
    cleaned = cleaned.replace(/"\.\.\.",?/g, '');
    cleaned = cleaned.replace(/,\s*\.\.\./g, '');
    cleaned = cleaned.replace(/\.\.\.,?/g, '');
    cleaned = cleaned.replace(/\{(\s*)\.\.\.(\s*)\}/g, ''); // Handle {...} placeholders
    cleaned = cleaned.replace(/\[(\s*)\.\.\.(\s*)\]/g, ''); // Handle [...] placeholders

    // 13. Final trim of whitespace
    cleaned = cleaned.trim();

    try {
        const parsed = JSON.parse(cleaned);
        // Handle sibling "data" issue: { "graph": { "type": "bar" }, "data": [...] }
        if (parsed.graph && parsed.data && !parsed.graph.data) {
            parsed.graph.data = parsed.data;
        }
        return parsed;
    } catch (e) {
        console.error("JSON Parse Error info:", (e as Error).message);

        // --- BEST EFFORT SURGERY ---
        // If regular parsing fails, we try to surgically extract components
        try {
            const result: any = { graph: { data: [] } };

            // 1. Extract metadata (type, title, xAxisKey)
            const typeMatch = text.match(/"?\$?type"?:?\s*"(\w+)"/i);
            const titleMatch = text.match(/"?\$?title"?:?\s*"([^"]+)"/i);

            if (typeMatch) result.graph.type = typeMatch[1].toLowerCase();
            if (titleMatch) result.graph.title = titleMatch[1];

            // 2. Extract Data Objects - Aggressively find ANY { ... } and parse keys
            const cleanText = text.replace(/(\/\/|#).*$/gm, "");

            const objectMatches = cleanText.matchAll(/\{([^{}]+)\}/g);
            for (const match of objectMatches) {
                try {
                    // Find keys and values even if improperly quoted or mangled
                    // Support: "Key": 123, "Key": "Val", "Key": [1,2], AND "Key": 123noise
                    const kvPairs = match[1].matchAll(/"(\w+)":\s*(?:(\d+(?:\.\d+)?)|"([^"]+)"|\[([^\]]+)\]|([-\d.]+[\w=]*))/g);
                    const obj: any = {};
                    for (const kv of kvPairs) {
                        const key = kv[1];
                        if (kv[2]) obj[key] = Number(kv[2]);
                        else if (kv[3]) {
                            const val = kv[3].replace(/[$,€%km]/gi, '').replace(/,/g, '');
                            if (!isNaN(Number(val))) obj[key] = Number(val);
                            else obj[key] = kv[3];
                        }
                        else if (kv[4]) {
                            const arrayParts = kv[4].split(",").map(s => s.trim().replace(/^["']|["']$/g, ''));
                            const numValue = arrayParts.find(p => !isNaN(Number(p.replace(/[km]/gi, ''))));
                            const strValue = arrayParts.find(p => isNaN(Number(p.replace(/[km]/gi, ''))));
                            if (numValue) {
                                const finalNum = Number(numValue.replace(/[$,€%km]/gi, '').replace(/,/g, ''));
                                obj[key] = finalNum;
                            }
                            if (strValue && !obj.category) obj.category = strValue;
                        }
                        else if (kv[5]) {
                            // MANGLED NUMBER: 120000soft_data or 123.4=...
                            const numMatch = kv[5].match(/^-?\d+(\.\d+)?/);
                            if (numMatch) obj[key] = Number(numMatch[0]);
                        }
                    }
                    if (Object.keys(obj).length > 0) {
                        const isDuplicate = result.graph.data.some((d: any) => JSON.stringify(d) === JSON.stringify(obj));
                        if (!isDuplicate) result.graph.data.push(obj);
                    }
                } catch { }
            }

            // 3. Last fallback: extract ANY "Label": Number or "Label": "$120k"
            if (result.graph.data.length === 0) {
                const kvPairs = cleanText.matchAll(/"([^"]+)":\s*(?:(\d+(?:\.\d+)?)|"([^"]+)"|\[([^\]]+)\]|([-\d.]+[\w=]*))/g);
                for (const kv of kvPairs) {
                    const key = kv[1];
                    if (key === "type" || key === "title" || key === "graph" || key === "data") continue;

                    let val: number | null = null;
                    if (kv[2]) val = Number(kv[2]);
                    else if (kv[3]) {
                        const num = kv[3].replace(/[$,€%km]/gi, '').replace(/,/g, '');
                        if (!isNaN(Number(num)) && num !== "") val = Number(num);
                    }
                    else if (kv[5]) {
                        const numMatch = kv[5].match(/^-?\d+(\.\d+)?/);
                        if (numMatch) val = Number(numMatch[0]);
                    }

                    if (val !== null) {
                        result.graph.data.push({ category: key, [key]: val });
                    }
                }
            }

            if (result.graph.data.length > 0) return result;
        } catch (surgeryError) {
            console.error("JSON Surgery failed:", surgeryError);
        }
        return null;
    }
}
