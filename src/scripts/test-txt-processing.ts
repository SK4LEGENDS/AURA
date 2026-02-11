
import { processDocument } from "../lib/document-processor";

async function testTxtProcessing() {
    console.log("Starting text file processing test...");

    // Mock File object
    const content = "This is a test text file content.";
    const file = new File([content], "test.txt", { type: "text/plain" });

    try {
        const result = await processDocument(file);
        console.log("Result:", result);
        if (result === content) {
            console.log("SUCCESS: Text file processed correctly.");
        } else {
            console.error("FAILURE: Content mismatch.");
        }
    } catch (error) {
        console.error("FAILURE: Error processing text file:", error);
    }

    // Test with empty type but .txt extension
    const fileNoType = new File([content], "test.txt", { type: "" });
    try {
        const result = await processDocument(fileNoType);
        if (result === content) {
            console.log("SUCCESS: Text file with no type processed correctly.");
        } else {
            console.error("FAILURE: Content mismatch (no type).");
        }
    } catch (error) {
        console.error("FAILURE: Error processing text file (no type):", error);
    }
    // Test with LOG file (text extension not explicitly in list)
    const logContent = "Log file content";
    const logFile = new File([logContent], "test.log", { type: "" });
    try {
        const result = await processDocument(logFile);
        console.log("SUCCESS: Log file processed.");
    } catch (error) {
        console.error("FAILURE: Log file failed:", error); // Expected to fail currently
    }

    // Test with JSON file
    const jsonContent = '{"key": "value"}';
    const jsonFile = new File([jsonContent], "test.json", { type: "application/json" });
    try {
        const result = await processDocument(jsonFile);
        console.log("SUCCESS: JSON file processed.");
        // Test with PPT file (Mocking execution as we can't easily generate valid PPT binaries)
        // using a dummy buffer just to see if it reaches the function and fails on parsing (showing it detected type)
        // or we can import the function directly to test logic if exported.
        // For now we rely on the fact that officeparser is integrated.
        console.log("To verify PPT fully, please try uploading a real .pptx file in the UI.");
    } catch (error) {
        console.error("FAILURE: JSON file failed:", error);
    }
}

testTxtProcessing();
