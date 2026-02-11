import fs from "fs";
import mammoth from "mammoth";
import officeParser from "officeparser";

// Usage: npx ts-node src/scripts/debug-word-parse.ts <messy_file_path>

const filePath = process.argv[2];

if (!filePath) {
    console.log("Usage: npx ts-node src/scripts/debug-word-parse.ts <path_to_docx>");
    process.exit(1);
}

async function runDebug() {
    console.log("--- DEBUGGING FILE ---");
    console.log("File:", filePath);

    try {
        const fileBuffer = fs.readFileSync(filePath);
        console.log("File size:", fileBuffer.length, "bytes");

        console.log("\n[1] Testing MAMMOTH extraction...");
        try {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            const text = result.value.trim();
            console.log("Mammoth Success!");
            console.log("Length:", text.length);
            console.log("First 200 chars:", text.substring(0, 200));
            console.log("-----------------------------------------");
        } catch (err: any) {
            console.error("Mammoth Failed:", err.message);
        }

        console.log("\n[2] Testing OFFICEPARSER extraction...");
        try {
            const text = await officeParser.parseOfficeAsync(filePath);
            console.log("OfficeParser Success!");
            console.log("Length:", text.length);
            console.log("First 200 chars:", text.substring(0, 200));
        } catch (err: any) {
            console.error("OfficeParser Failed:", err.message);
        }

    } catch (e: any) {
        console.error("Error reading file:", e.message);
    }
}

runDebug();
