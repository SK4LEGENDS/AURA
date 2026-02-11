
import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';

async function testMammoth(filePath: string) {
    console.log(`Testing file: ${filePath}`);
    const buffer = fs.readFileSync(filePath);

    console.log("--- Method 1: extractRawText (Old Way) ---");
    const rawResult = await mammoth.extractRawText({ buffer });
    console.log("Contains 'Global Education'?", rawResult.value.includes("Global Education"));
    console.log("Contains 'Jogger'?", rawResult.value.includes("Jogger"));

    console.log("\n--- Method 2: convertToHtml (New Way) ---");
    const htmlResult = await mammoth.convertToHtml({ buffer });
    const html = htmlResult.value;
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    console.log("Contains 'Global Education'?", text.includes("Global Education"));
    console.log("Contains 'Jogger'?", text.includes("Jogger"));

    if (text.includes("Global Education")) {
        console.log("\n[!] WARNING: convertToHtml DID NOT FILTER the ghost text.");
        // If this happens, we need an even stricter filter or the XML is weird.
        // Let's dump a snippet of the HTML around that text to see what tag it's in.
        const idx = html.indexOf("Global Education");
        if (idx !== -1) {
            console.log("HTML Context:", html.substring(idx - 50, idx + 100));
        }
    } else {
        console.log("\n[+] SUCCESS: convertToHtml filtered it out!");
    }
}

// Check for file arg
const fileArg = process.argv[2];
if (fileArg) {
    testMammoth(fileArg).catch(console.error);
} else {
    console.log("Please provide a file path. Usage: npx ts-node src/scripts/debug-mammoth-html.ts <path-to-docx>");
}
