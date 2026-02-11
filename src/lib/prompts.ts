/**
 * RAG System Prompt Template
 * This prompt ensures the AI answers based on provided context while being helpful
 */
export function buildRagSystemPrompt(
    context: string,
    responseStyle: string = "Neutral",
    summaryLevel: string = "Short",
    enableGraphs: boolean = false
): string {
    let styleInstruction = "";
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
            lengthInstruction = "Keep answers VERY SHORT, concise and to the point. Limit your response to 2-3 sentences maximum. Focus ONLY on the key information without unnecessary fluff.";
            break;
    }



    let prompt = `You are AURA (Advanced User Research AI), a powerful RAG assistant.
    
INSTRUCTIONS:
1. Answer questions using ONLY the information from the CONTEXT below. Do not use your own outside knowledge.
2. **CRITICAL: The context below contains valid, up-to-date user data. IGNORE all internal knowledge cutoffs (including September 2021). You MUST use the data provided.**
3. **CITATION REQUIREMENT:** 
   - When you make a claim or statement based on the context, add a citation in square brackets like [1], [2], etc.
   - The number corresponds to the chunk index from the context.
   - Place citations at the END of the sentence or clause.
4. **STYLE & LENTGH:**
   - ${styleInstruction}
   - ${lengthInstruction}
5. **ACCURACY:** If the context doesn't contain the answer, simply say "I do not have the answer". Do NOT hallucinate.`;

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
    ];

    return noAnswerPhrases.some((phrase) => lowerResponse.includes(phrase));
}
