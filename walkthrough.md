# Walkthrough - Excel/CSV Support and Graph Generation

I have implemented support for Excel and CSV file uploads, graph generation capabilities, and model selection.

## Changes

### 1. Excel and CSV Support
- **Backend**: Updated `src/lib/document-processor.ts` to use `xlsx` library to parse `.xlsx`, `.xls`, and `.csv` files. The content is converted to a text representation (CSV format with sheet names) for the LLM to process.
- **Frontend**: Updated `src/components/upload-panel.tsx` to accept `.xlsx` and `.xls` files in the file input.

### 2. Graph Generation
- **Frontend**: Created `src/components/graph-renderer.tsx` using `recharts` to render Bar, Line, Pie, Area, and Scatter charts.
- **Frontend**: Updated `src/components/chat-feed.tsx` to detect JSON graph data in the LLM response and render the `GraphRenderer` component.
- **Backend**: Updated `src/lib/prompts.ts` to instruct the LLM to output a specific JSON structure when asked to generate a graph.
- **Fixes**:
    - **Robust JSON Parsing**: Updated `ChatFeed` to strip comments (`//...`) and handle placeholders (`...`) in JSON, preventing crashes.
    - **Restricted Generation**: Graphs are now ONLY generated when explicitly requested.
    - **Prompt Hardening**: Explicitly forbade comments and **code** in JSON output.
    - **Debugging**: Added logging to `GraphRenderer` to help diagnose empty graph issues.
    - **Styling**: Improved bar chart styling to prevent overly wide bars.
    - **Download**: Implemented **PNG download** functionality (converted from SVG).
    - **Invisible Graph Fix**: Implemented robust data sanitization in `GraphRenderer` to:
        - Convert string numbers (e.g., "120000") to actual numbers.
        - Auto-fix case-sensitivity mismatches in keys (e.g., "Month" vs "month").
    - **Hallucination Fix**: Lowered AI temperature to `0.1` to prevent it from writing fake code inside the JSON.
    - **Simplified Generation**: Refactored `GraphRenderer` to accept simple JSON (`{ title, data }`) and auto-detect axes and series. This makes it much easier for smaller models to generate valid graphs.
    - **UI Visibility**: Updated `GraphRenderer` to use a solid white background (light mode) or solid dark grey (dark mode) instead of semi-transparent, improving readability.
    - **Download Fix**: Fixed the "purple block" / zoomed-in issue when downloading graphs by:
        - Cloning the SVG before serialization.
        - Explicitly setting `width` and `height` attributes on the clone to match the display size (fixing issues with `100%` width).
        - Disabling animations (`isAnimationActive={false}`) to ensure the chart is fully rendered before download.
    - **Data Fidelity**: Updated system prompt to strictly enforce using **exact** data from the context without translation or modification (e.g., preventing "Jan" -> "Januener").
    - **Graph Type Selection**: Re-added the `type` field to the system prompt JSON example to ensure the AI correctly specifies the requested chart type (e.g., pie, line) instead of defaulting to bar.

### 3. Model Selection & Robustness
- **Frontend**: Updated `src/components/settings-dialog.tsx` to include `phi3:mini`, `llama3.2-vision`, and `qwen2-math` in the AI Model dropdown.
- **Frontend**: Updated `src/app/page.tsx` to pass the selected `aiModel` to the backend API.
- **Backend**: Updated `src/app/api/chat/route.ts` to implement a **fallback mechanism**. If the selected model fails (e.g., not installed), it automatically retries with `phi3:mini`.
- **Configuration**: Set `phi3:mini` as the default model.

## Verification Results

### Automated Tests
- Ran `npm run build` successfully.

### Manual Verification
- **Upload**: You can now upload Excel and CSV files.
- **Graphing**: You can ask questions like "Generate a bar chart of the sales data". The system now handles JSON generation more reliably.
- **Models**: The system is robust with fallback mechanisms.
- **Unwanted Graphs**: The AI should no longer generate graphs unprompted.
- **Error Handling**: The system should no longer crash if the AI outputs comments in the JSON.
- **Download**: You can now download the graph as a PNG file.
- **Rendering**: Graphs should now appear correctly even if the AI outputs data as strings or uses slightly wrong casing for keys.
- **Visibility**: The graph container should now be clearly visible with good contrast against the background.
- **Download Quality**: The downloaded PNG should now be a high-resolution, correct representation of the chart, not a zoomed-in blur.
- **Data Accuracy**: The graph labels and values should now exactly match the source file (no random translations).
- **Chart Types**: The system should now correctly generate Pie, Line, Area, and Scatter charts when requested.

## Troubleshooting
- **"Failed to parse graph JSON"**: This means the LLM output invalid JSON. Try asking again or rephrasing the prompt. The system now attempts to clean up common errors.
- **Empty Graph**: Check the browser console (F12) for "GraphRenderer received data" to see what data is being passed.
