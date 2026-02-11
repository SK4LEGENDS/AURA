
import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import * as officeParser from 'officeparser';

const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide a file path.");
    console.error("Usage: npx ts-node src/scripts/debug-file.ts <path-to-your-file>");
    process.exit(1);
}

async function debugFile(targetPath: string) {
    console.log(`\n--- DEBUGGING FILE: ${path.basename(targetPath)} ---`);

    if (!fs.existsSync(targetPath)) {
        console.error("File not found!");
        return;
    }

    const buffer = fs.readFileSync(targetPath);
    const fileName = path.basename(targetPath).toLowerCase();

    console.log(`File Type: ${path.extname(targetPath)}`);
    console.log(`File Size: ${buffer.length} bytes`);

    try {
        let text = "";

        if (fileName.endsWith('.docx')) {
            console.log("Using Parser: MAMMOTH (Modern)");
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
            console.log("\n--- MAMMOTH WARNINGS ---");
            console.log(result.messages.map(m => m.message).join('\n') || "None");
        } else if (fileName.endsWith('.doc')) {
            console.log("Using Parser: OFFICEPARSER (Legacy)");
            text = await new Promise((resolve, reject) => {
                officeParser.parseOffice(targetPath, (data: string, err: any) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        } else {
            console.log("Using Parser: TEXT (Default)");
            text = buffer.toString('utf-8');
        }

        console.log("\n--- EXTRACTED TEXT PREVIEW (First 500 chars) ---");
        console.log(text.substring(0, 500).replace(/\n/g, '\\n'));
        console.log("\n--- EXTRACTED TEXT PREVIEW (Last 500 chars) ---");
        console.log(text.substring(text.length - 500).replace(/\n/g, '\\n'));
        console.log("\n------------------------------------------------");

    } catch (error) {
        console.error("PARSING FAILED:", error);
    }
}

debugFile(filePath).catch(console.error);
