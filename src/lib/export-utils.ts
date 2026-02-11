/**
 * Export Utilities
 * 
 * Functions for exporting chat conversations in various formats
 */

import { ChatMessage } from "@/types/chat";

/**
 * Export messages as Markdown
 */
export function exportAsMarkdown(messages: ChatMessage[], title: string = "Chat Export"): string {
    const date = new Date().toLocaleDateString();
    let markdown = `# ${title}\n\n`;
    markdown += `*Exported on ${date}*\n\n---\n\n`;

    messages.forEach((msg, index) => {
        const role = msg.role === "user" ? "**You**" : "**AURA**";
        markdown += `### ${role}\n\n`;
        markdown += `${msg.content}\n\n`;

        if (index < messages.length - 1) {
            markdown += `---\n\n`;
        }
    });

    return markdown;
}

/**
 * Export messages as JSON
 */
export function exportAsJSON(messages: ChatMessage[], metadata?: Record<string, unknown>): string {
    const exportData = {
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        metadata,
        messages: messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt,
            confidence: msg.confidence,
        })),
    };

    return JSON.stringify(exportData, null, 2);
}

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export chat as Markdown file
 */
export function downloadChatAsMarkdown(messages: ChatMessage[], title: string = "chat") {
    const content = exportAsMarkdown(messages, title);
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.md`;
    downloadFile(content, filename, "text/markdown");
}

/**
 * Download chat as JSON file
 */
export function downloadChatAsJSON(messages: ChatMessage[], metadata?: Record<string, unknown>) {
    const content = exportAsJSON(messages, metadata);
    const filename = `chat-export-${Date.now()}.json`;
    downloadFile(content, filename, "application/json");
}

/**
 * Copy text to clipboard and return success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
