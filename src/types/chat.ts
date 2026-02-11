export type MessageRole = "user" | "assistant";

export interface ConfidenceInfo {
  retrievalConfidence: number;
  consistencyConfidence: number;
  coverageConfidence: number;
  overallConfidence: number;
  level: "high" | "medium" | "low";
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  references?: MessageReference[];
  confidence?: ConfidenceInfo;
}

export interface MessageReference {
  id: string;
  snippet: string;
  source?: string;
  similarity?: number;
}

export type KnowledgeSource = "file" | "url" | null;

export interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  chunkIndex: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceType: KnowledgeSource;
  sourceName?: string;
  sourceUrl?: string;
  indexed: boolean;
  messages: ChatMessage[];
  // Document content fields
  documentContent?: string;
  sourceFileSize?: number;
  processedAt?: string;
}

