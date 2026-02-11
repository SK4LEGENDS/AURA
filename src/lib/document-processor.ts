import { spawn } from "child_process";
import path from "path";
import mammoth from "mammoth";
import * as cheerio from "cheerio";
import axios from "axios";
import * as XLSX from "xlsx";
import * as officeParser from "officeparser";
import * as fs from "fs/promises";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";

const MAX_CHUNK_SIZE = 800; // Characters per chunk
const CHUNK_OVERLAP = 100; // Overlap between chunks

/**
 * Process a file and extract text content
 */
export async function processDocument(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
        if (
            fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileName.endsWith(".docx") ||
            fileType === "application/msword" ||
            fileName.endsWith(".doc")
        ) {
            return await processWordDocument(file);
        } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            return await processPdfDocument(file);
        } else if (
            fileType === "text/plain" ||
            fileName.endsWith(".txt") ||
            fileName.endsWith(".md") ||
            fileName.endsWith(".mdx") ||
            fileName.endsWith(".json") ||
            fileName.endsWith(".log") ||
            fileType.startsWith("text/")
        ) {
            return await processTextFile(file);
        } else if (
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls") ||
            fileName.endsWith(".csv") ||
            fileType === "application/vnd.ms-excel" ||
            fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            fileType === "text/csv"
        ) {
            return await processExcelDocument(file);
        } else if (
            fileName.endsWith(".ppt") ||
            fileName.endsWith(".pptx")
        ) {
            return await processPptDocument(file);
        } else {
            throw new Error(`Unsupported file type: ${fileType}. Please upload a PDF, Word (docx/doc), Excel, or Text file.`);
        }
    } catch (error) {
        console.error("Error processing document:", error);
        throw error;
    }
}

/**
 * Extract text from Word document (.docx)
 */
/**
 * Extract text from Word document (.docx)
 */
async function processWordDocument(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if it's a .docx file (Modern Word) - PRIORITIZE extension over MIME
    const isDocx = file.name.toLowerCase().endsWith(".docx");

    // Check if it's a .doc file (Legacy Word) - Only if NOT .docx
    const isDoc = !isDocx && (file.name.toLowerCase().endsWith(".doc") || file.type === "application/msword");

    if (isDoc) {
        // Use officeparser for .doc files (legacy)
        console.log("Processing legacy .doc file with officeparser...");
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `${uuidv4()}_${file.name}`);

        try {
            await fs.writeFile(tempFilePath, buffer);

            // Use callback pattern wrapped in promise for better compatibility
            const text = await new Promise<string>((resolve, reject) => {
                officeParser.parseOffice(tempFilePath, (data: string, err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            return cleanText(text);
        } catch (error) {
            console.error("Error processing .doc file:", error);
            throw new Error("Failed to process Word (.doc) file.");
        } finally {
            try {
                await fs.unlink(tempFilePath);
            } catch (e) {
                console.warn("Failed to delete temp file:", tempFilePath);
            }
        }
    } else {
        // Use mammoth for .docx files (modern)
        // STRATEGY CHANGE: Use convertToHtml instead of extractRawText
        // extractRawText grabs *all* text nodes (including hidden XML).
        // convertToHtml focuses on semantic/visible content.
        try {
            const result = await mammoth.convertToHtml({ buffer });
            const html = result.value;
            // Simple HTML-to-Text: Remove tags and decode entities
            // This acts as a filter for non-visible XML metadata
            const text = html
                .replace(/<[^>]*>/g, ' ') // Replace tags with space
                .replace(/\s+/g, ' ')     // Collapse whitespace
                .trim();

            return cleanText(text);
        } catch (error) {
            console.error("Mammoth failed, trying fallback:", error);
            // Fallback to officeparser for .docx if mammoth fails (rare)
            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, `${uuidv4()}_${file.name}`);
            try {
                await fs.writeFile(tempFilePath, buffer);
                const text = await officeParser.parseOfficeAsync(tempFilePath);
                return cleanText(text);
            } catch (fallbackError) {
                throw new Error("Failed to process Word document.");
            } finally {
                try { await fs.unlink(tempFilePath); } catch (e) { }
            }
        }
    }
}

/**
 * Extract text from Excel/CSV document
 */
async function processExcelDocument(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    let text = "";

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        // Convert to CSV to maintain some structure
        const csv = XLSX.utils.sheet_to_csv(sheet);
        if (csv.trim().length > 0) {
            text += `Sheet: ${sheetName}\n${csv}\n\n`;
        }
    });

    return text.trim();
}

/**
 * Extract text from PowerPoint document (.ppt, .pptx)
 */
async function processPptDocument(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // officeparser usually works better with file paths, so we'll write to a temp file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${uuidv4()}_${file.name}`);

    try {
        await fs.writeFile(tempFilePath, buffer);

        // Use officeparser to extract text
        const text = await officeParser.parseOfficeAsync(tempFilePath);
        return text.trim();
    } catch (error) {
        console.error("Error parsing PowerPoint file:", error);
        throw new Error("Failed to parse PowerPoint file");
    } finally {
        // Clean up temp file
        try {
            await fs.unlink(tempFilePath);
        } catch (e) {
            console.warn("Failed to delete temp file:", tempFilePath);
        }
    }
}

/**
 * Clean extracted text to remove non-printable characters and excessive whitespace
 */
function cleanText(text: string): string {
    return text
        .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, " ") // Remove control characters
        .replace(/\s+/g, " ") // Collapse whitespace
        .trim();
}

/**
 * Extract text from PDF document
 */
async function processPdfDocument(file: File): Promise<string> {
    try {
        // Direct import to bypass problematic index.js in pdf-parse package
        // @ts-ignore
        const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // v1 API: pdfParse(buffer) returns a promise resolving to data object
        const data = await pdfParse(buffer);
        let text = data.text ? data.text.trim() : "";

        // Debug logging to verify extraction quality
        console.log("--- PDF EXTRACTION START ---");
        console.log("File:", file.name);
        console.log("Raw Length:", text.length);
        console.log("Preview (First 500):", text.substring(0, 500));
        console.log("--- PDF EXTRACTION END ---");

        return cleanText(text);
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to extract text from PDF.");
    }
}

/**
 * Extract text from plain text file
 */
async function processTextFile(file: File): Promise<string> {
    const text = await file.text();
    return cleanText(text);
}

/**
 * Extract text content from a URL using Trafilatura (Python) with Cheerio fallback
 */
export async function processUrl(url: string): Promise<string> {
    try {
        // Try using Trafilatura via Python script first
        const pythonScriptPath = path.join(process.cwd(), "src", "scripts", "extract_url.py");

        const pythonProcess = spawn("python", [pythonScriptPath, url]);

        let dataString = "";
        let errorString = "";

        const pythonPromise = new Promise<string>((resolve, reject) => {
            pythonProcess.stdout.on("data", (data) => {
                dataString += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                errorString += data.toString();
            });

            pythonProcess.on("close", (code) => {
                if (code !== 0) {
                    reject(new Error(`Python script exited with code ${code}: ${errorString}`));
                    return;
                }
                try {
                    const result = JSON.parse(dataString);
                    if (result.error) {
                        reject(new Error(result.error));
                    } else {
                        resolve(result.text);
                    }
                } catch (e) {
                    reject(new Error("Failed to parse Python output"));
                }
            });
        });

        // Set a timeout for the Python script
        const timeoutPromise = new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error("Trafilatura timeout")), 15000);
        });

        return await Promise.race([pythonPromise, timeoutPromise]);

    } catch (error) {
        console.warn("Trafilatura extraction failed, falling back to Cheerio:", error);

        // Fallback to Cheerio implementation
        try {
            // Fetch the URL content
            const response = await axios.get(url, {
                timeout: 10000, // 10 second timeout
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            const html = response.data;

            // Parse HTML and extract text
            const $ = cheerio.load(html);

            // Remove script and style elements
            $("script, style, nav, header, footer, aside").remove();

            // Extract text from main content areas
            let text = "";

            // Try to find main content
            const mainContent = $("main, article, .content, #content, .post, .article");
            if (mainContent.length > 0) {
                text = mainContent.text();
            } else {
                // Fallback to body
                text = $("body").text();
            }

            // Clean up whitespace
            text = text
                .replace(/\s+/g, " ") // Replace multiple spaces with single space
                .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
                .trim();

            if (!text || text.length < 100) {
                throw new Error("Could not extract sufficient content from URL");
            }

            return text;
        } catch (fallbackError) {
            console.error("Error processing URL:", fallbackError);
            throw new Error("Failed to fetch or process URL content");
        }
    }
}

/**
 * Split text into chunks with overlap
 * Uses a recursive character splitting strategy to respect document structure
 */
export function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 200): string[] {
    if (!text) return [];

    const chunks: string[] = [];

    // Split by double newlines (paragraphs) first
    const paragraphs = text.split(/\n\n+/);

    let currentChunk = "";

    for (const paragraph of paragraphs) {
        const trimmedPara = paragraph.trim();
        if (!trimmedPara) continue;

        // If adding this paragraph fits in the chunk
        if (currentChunk.length + trimmedPara.length + 2 <= maxChunkSize) {
            currentChunk += (currentChunk ? "\n\n" : "") + trimmedPara;
        } else {
            // Current chunk is full, push it
            if (currentChunk) {
                chunks.push(currentChunk);
            }

            // If the paragraph itself is larger than maxChunkSize, we need to split it
            if (trimmedPara.length > maxChunkSize) {
                // Split by sentences
                const sentences = trimmedPara.match(/[^.!?]+[.!?]+(\s+|$)/g) || [trimmedPara];
                let sentenceChunk = "";

                for (const sentence of sentences) {
                    if (sentenceChunk.length + sentence.length <= maxChunkSize) {
                        sentenceChunk += sentence;
                    } else {
                        if (sentenceChunk) chunks.push(sentenceChunk.trim());
                        sentenceChunk = sentence;
                    }
                }
                if (sentenceChunk) {
                    // Start the new chunk with the last part of the split paragraph
                    currentChunk = sentenceChunk.trim();
                }
            } else {
                // Start new chunk with overlap from previous content
                // Take the last 'overlap' characters from the previous chunk to maintain context
                const overlapText = currentChunk.slice(-overlap);
                currentChunk = overlapText + "\n\n" + trimmedPara;
            }
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks.filter(chunk => chunk.length > 0);
}
