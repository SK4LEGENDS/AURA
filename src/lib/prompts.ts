/**
 * RAG System Prompt Template
 * This prompt ensures the AI answers based on provided context while being helpful
 */
const languageMap: Record<string, string> = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "ar": "Arabic",
    "ru": "Russian",
    "de": "German",
    "ja": "Japanese",
    "fr": "French",
    "es": "Spanish",
    "nl": "Dutch",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "te": "Telugu",
    "as": "Assamese",
    "brx": "Bodo",
    "doi": "Dogri",
    "ks": "Kashmiri",
    "kok": "Konkani",
    "mai": "Maithili",
    "mni": "Meitei (Manipuri)",
    "ne": "Nepali",
    "or": "Odia",
    "pa": "Punjabi",
    "sa": "Sanskrit",
    "sat": "Santali",
    "sd": "Sindhi",
    "ur": "Urdu",
    "it": "Italian",
    "ko": "Korean",
    "pt": "Portuguese",
    "th": "Thai",
    "tr": "Turkish",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    "id": "Indonesian",
    "vi": "Vietnamese",
    "fil": "Filipino",
    "he": "Hebrew",
    "fa": "Persian",
    "pl": "Polish",
    "uk": "Ukrainian",
    "sv": "Swedish",
    "no": "Norwegian",
    "da": "Danish",
    "fi": "Finnish",
    "el": "Greek",
    "hu": "Hungarian",
    "cs": "Czech",
    "ro": "Romanian",
    "bg": "Bulgarian",
    "sr": "Serbian",
    "hr": "Croatian",
    "sk": "Slovak",
    "ms": "Malay"
};

export function buildRagSystemPrompt(
    context: string,
    responseStyle: string = "Neutral",
    summaryLevel: string = "Short",
    enableGraphs: boolean = false,
    outputLanguage: string = "en"
): string {
    const fullLanguageName = languageMap[outputLanguage] || outputLanguage;

    let styleInstruction = "";
    // ... (rest of the style switch)
    switch (responseStyle) {
        case "Formal":
            styleInstruction = "Use a professional, objective, and formal tone. Avoid slang or casual expressions.";
            break;
        case "Friendly":
            styleInstruction = "Use a warm, engaging, and conversational tone. You can be enthusiastic and approachable.";
            break;
        case "Neutral":
        default:
            styleInstruction = "Use a balanced, clear, and objective tone. Be helpful without being overly casual or stiff.";
            break;
    }

    let lengthInstruction = "";
    switch (summaryLevel) {
        case "Detailed":
            lengthInstruction = "Provide comprehensive and in-depth answers. Include relevant details, examples, and explanations from the context where applicable.";
            break;
        case "Short":
        default:
            lengthInstruction = "Keep answers VERY SHORT, concise and to the point. Limit your response to 2-3 sentences max.";
            break;
    }

    let prompt = `You are AURA, an efficient RAG assistant.

STRICT INSTRUCTIONS:
1. LANGUAGE: ***CRITICAL*** - You MUST respond ONLY in ${fullLanguageName}. 
   - Even if the question and context are in English, you MUST translate your answer into ${fullLanguageName}. PRIORITIZE ${fullLanguageName} OVER THE INPUT LANGUAGE.
   - ***TRANSLATE EVERYTHING***: This includes document titles, policy names, headings, and list items. 
   - NEVER mix English words into your response. The only exceptions are specific acronyms (LLM, AI) if no local equivalent exists.
   - For Tamil: Use proper Tamil terms (e.g., "கொள்கை" instead of "Policy", "நடத்தை விதிகள்" instead of "Code of Conduct").
   - Semantic Accuracy for Tamil: 
     - "Health, Safety, Security & Environment" translated as "சுகாதாரம், பாதுகாப்பு, செக்யூரிட்டி மற்றும் சுற்றுச்சூழல்".
     - "No harm to people" translated as "மக்களுக்கு எந்தத் தீங்கும் விளைவிக்கக்கூடாது".
     - "Protect environment" translated as "சுற்றுச்சூழலைப் பாதுகாத்தல்".
   - Do not use mixed-language hallucinations or "Tanglish".
2. Answer using ONLY the CONTEXT below.
3. CITATIONS: Add [1], [2] etc. at end of sentences. MANDATORY: The citations MUST be in numerical format [1], [2] regardless of the output language.
4. STYLE: ${styleInstruction}
5. LENGTH: ${lengthInstruction}
6. NO ANSWER: If the context does not contain the answer, say "I do not have the answer" (or its equivalent in ${fullLanguageName}) exclusively in ${fullLanguageName}.
7. FORMAT: End your response with <|end|>.`;

    if (enableGraphs) {
        prompt += `

6. **GRAPH GENERATION (MANDATORY):**
   - You generate the **DATA** for charts.
   - **DO NOT REFUSE** chart requests.
   - **FORMATTING RULE:** You must wrap your JSON block between \`<<<GRAPH_JSON>>>\` markers.
   - **STRUCTURE:**
     <<<GRAPH_JSON>>>
     {
       "graph": {
         "type": "bar" | "line" | "pie" | "area" | "radar" | "funnel",
         "title": "Descriptive Title",
         "data": [
           { "category": "Jan", "Laptops": 1200, "Phones": 900 },
           { "category": "Feb", "Laptops": 1500, "Phones": 1100 }
         ]
       }
     }
     <<<GRAPH_JSON>>>
   - **NO COMMENTS OR CITATIONS** inside the markers. Keep them in your text response.`;
    }

    prompt += `

CONTEXT:
${context}

Now, provide your response based strictly on the context provided above.`;

    if (enableGraphs) {
        prompt += ` If a graph or chart was requested, provide the text insight first, then the delimited JSON block for the graph.`;
    }

    return prompt;
}

/**
 * Build user prompt for RAG
 */
export function buildUserPrompt(question: string): string {
    return question;
}

/**
 * Check if the response indicates lack of knowledge
 */
export function isNoAnswerResponse(response: string): boolean {
    const lowerResponse = response.toLowerCase().trim();

    const noAnswerPhrases = [
        "i do not have the answer",
        "i don't have the answer",
        "i cannot answer",
        "i can't answer",
        "not in the context",
        "no information",
        "context does not contain",
        // Dutch
        "ik heb het antwoord niet",
        "geen informatie",
        "staat niet in de context",
        // German
        "ich habe keine antwort",
        "keine informationen",
        "nicht im kontext",
        // Hindi (added as a placeholder, might need more)
        "मेरे पास इसका उत्तर नहीं है",
        // Arabic
        "ليس لدي الإجابة",
        "غير موجود في السياق"
    ];

    return noAnswerPhrases.some((phrase) => lowerResponse.includes(phrase));
}
