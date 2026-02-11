
import * as XLSX from 'xlsx';
import { Ollama } from 'ollama';

async function main() {
    console.log("Starting debug script...");

    // 1. Test Excel Parsing
    console.log("Testing Excel parsing...");
    try {
        // Create a dummy workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ["Header 1", "Header 2"],
            ["Data 1", "Data 2"],
            ["Test Value", 123]
        ]);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Write to buffer
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Read back (simulating processExcelDocument)
        const workbook = XLSX.read(buf, { type: 'buffer' });
        let text = "";

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            if (csv.trim().length > 0) {
                text += `Sheet: ${sheetName}\n${csv}\n\n`;
            }
        });

        console.log("Parsed text:");
        console.log("--------------------------------");
        console.log(text);
        console.log("--------------------------------");

        if (!text) {
            console.error("FAILED: No text extracted from Excel");
            return;
        }

    } catch (e) {
        console.error("FAILED: Excel parsing threw error", e);
        return;
    }

    // 2. Test Ollama Connection and Embedding
    console.log("\nTesting Ollama connection...");
    const ollama = new Ollama({ host: "http://localhost:11434" });
    const model = "nomic-embed-text"; // Default from embeddings.ts

    try {
        const list = await ollama.list();
        const hasModel = list.models.some(m => m.name.includes(model));
        console.log(`Available models: ${list.models.map(m => m.name).join(", ")}`);

        if (!hasModel) {
            console.warn(`WARNING: Model '${model}' not found in list. This might be the cause of failure.`);
            console.log("Attempting to pull model...");
            await ollama.pull({ model });
            console.log("Model pulled successfully.");
        } else {
            console.log(`Model '${model}' found.`);
        }

        console.log("Generating embedding for test text...");
        const response = await ollama.embed({
            model: model,
            input: "Test embedding generation",
        });

        if (response.embeddings && response.embeddings.length > 0) {
            console.log("SUCCESS: Embedding generated successfully.");
        } else {
            console.error("FAILED: No embeddings returned.");
        }

    } catch (e) {
        console.error("FAILED: Ollama error", e);
    }
}

main().catch(console.error);
