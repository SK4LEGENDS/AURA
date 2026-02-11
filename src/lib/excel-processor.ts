
import * as XLSX from "xlsx";

interface ExcelChunkOptions {
    rowsPerChunk?: number;
}

/**
 * Process an Excel file and return optimized text chunks.
 * - Preserves headers for context in every chunk.
 * - Groups rows together to avoid splitting data.
 */
export async function processAndChunkExcel(file: File, options: ExcelChunkOptions = {}): Promise<string[]> {
    console.log(`[ExcelProcessor] Processing file: ${file.name}, size: ${file.size}`);
    const { rowsPerChunk = 50 } = options;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        const chunks: string[] = [];

        // Process each sheet
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to array of arrays (rows)
            // header: 1 means we get an array of arrays.
            // raw: false ensures we get formatted strings (e.g. dates as text) instead of serial numbers
            const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
                header: 1,
                raw: false,
                defval: "" // default value for empty cells
            });
            console.log(`[ExcelProcessor] Sheet "${sheetName}" has ${rows.length} rows.`);

            if (rows.length === 0) continue;

            // Extract header row
            const headerRow = rows[0] || [];
            const headers = headerRow.map((h: any) => String(h || "").trim()).filter((h: string) => h.length > 0);

            // If only one row (headers potentially), and we treat it as header, we get 0 data rows.
            // If the file really just has one row of data and NO headers, this logic is tricky.
            // Requirement specified: "Preserves column headers". We assume first row is header.

            const dataRows = rows.slice(1);
            if (dataRows.length === 0) {
                console.warn(`[ExcelProcessor] Sheet "${sheetName}" has no data rows (only header or empty).`);
                continue;
            }

            const headerContext = `Context: Sheet="${sheetName}", Columns=[${headers.join(", ")}]`;

            // Chunking loop
            for (let i = 0; i < dataRows.length; i += rowsPerChunk) {
                const chunkRows = dataRows.slice(i, i + rowsPerChunk);
                let chunkText = headerContext + "\n";
                let hasContent = false;

                for (const row of chunkRows) {
                    const rowParts: string[] = [];
                    let rowHasData = false;

                    if (headers.length > 0) {
                        headers.forEach((header, index) => {
                            const val = row[index];
                            if (val !== undefined && val !== null && String(val).trim() !== "") {
                                rowParts.push(`${header}=${val}`);
                                rowHasData = true;
                            }
                        });
                    } else {
                        // No headers found in first row
                        row.forEach(val => {
                            if (val !== undefined && val !== null && String(val).trim() !== "") {
                                rowParts.push(String(val));
                                rowHasData = true;
                            }
                        });
                    }

                    if (rowHasData) {
                        chunkText += (headers.length > 0 ? rowParts.join(", ") : rowParts.join(" | ")) + "\n";
                        hasContent = true;
                    }
                }

                if (hasContent) {
                    chunks.push(chunkText.trim());
                }
            }
        }

        console.log(`[ExcelProcessor] Total chunks generated: ${chunks.length}`);
        return chunks;
    } catch (error) {
        console.error("[ExcelProcessor] Error parsing Excel file:", error);
        // Throwing error here to be caught by route handler
        throw new Error("Failed to parse Excel file structure.");
    }
}
