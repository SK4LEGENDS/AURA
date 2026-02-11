# RAG Backend Setup Guide

## Overview

This RAG (Retrieval-Augmented Generation) backend allows you to:
- Upload Word documents (.docx), PDFs, or provide URLs
- Extract and process content automatically
- Store everything in Firebase Firestore
- Ask questions that are answered **only** based on the uploaded content
- Get "I do not have the answer" for questions outside the document scope

## Prerequisites

### 1. Install Ollama

Download and install Ollama from: https://ollama.com/download

### 2. Pull Required Models

After installing Ollama, open a terminal and run:

```bash
# Pull the chat model (choose one)
ollama pull llama3.2

# Pull the embedding model (required for RAG)
ollama pull nomic-embed-text
```

### 3. Verify Ollama is Running

Ollama should start automatically. Verify it's running:

```bash
ollama list
```

You should see the models you just pulled.

## Firebase Setup

### 1. Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select a location

### 2. Generate Service Account Credentials

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely

### 3. Create `.env.local` File

Create a file named `.env.local` in the project root with the following content:

```env
# Firebase Admin SDK
# Copy these values from the service account JSON file you downloaded
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

**Important:** 
- Replace the Firebase values with your actual credentials from the JSON file
- The private key must be enclosed in quotes and keep the `\n` characters
- Never commit `.env.local` to version control

## Firestore Schema

The backend automatically creates the following structure:

```
chats/{chatId}
  - id: string
  - title: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - sourceType: "file" | "url" | null
  - sourceName?: string (filename)
  - sourceUrl?: string (URL)
  - documentContent?: string (full extracted text)
  - sourceFileSize?: number
  - indexed: boolean
  - processedAt?: timestamp
  
  chunks/{chunkId}
    - id: string
    - text: string
    - embedding: number[] (vector embedding)
    - chunkIndex: number
  
  messages/{messageId}
    - id: string
    - role: "user" | "assistant"
    - content: string
    - createdAt: timestamp
    - references?: array (for assistant messages)
```

## API Endpoints

### 1. Upload Document/URL

**Endpoint:** `POST /api/upload`

**Request:**
```typescript
// For file upload
const formData = new FormData();
formData.append('chatId', 'your-chat-id');
formData.append('type', 'file');
formData.append('file', fileObject);

// For URL
const formData = new FormData();
formData.append('chatId', 'your-chat-id');
formData.append('type', 'url');
formData.append('url', 'https://example.com/article');

fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "success": true,
  "chatId": "chat-123",
  "documentContent": "Preview of extracted text...",
  "chunkCount": 15,
  "message": "Successfully processed document"
}
```

### 2. Chat with RAG

**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "chatId": "your-chat-id",
  "message": "What is the main topic of the document?"
}
```

**Response:**
```json
{
  "answer": "Based on the document, the main topic is...",
  "references": [
    {
      "id": "chunk_0",
      "snippet": "Relevant text from the document...",
      "similarity": 0.85
    }
  ]
}
```

## Testing the Backend

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Document Upload

You can test the upload endpoint using curl or Postman:

```bash
# Test with a file
curl -X POST http://localhost:3000/api/upload \
  -F "chatId=test-chat-1" \
  -F "type=file" \
  -F "file=@/path/to/your/document.docx"

# Test with a URL
curl -X POST http://localhost:3000/api/upload \
  -F "chatId=test-chat-2" \
  -F "type=url" \
  -F "url=https://en.wikipedia.org/wiki/Artificial_intelligence"
```

### 3. Test Chat Endpoint

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "test-chat-1",
    "message": "What is this document about?"
  }'
```

### 4. Test Out-of-Context Question

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "test-chat-1",
    "message": "What is the weather like today?"
  }'
```

Expected response: `"I do not have the answer"`

## Supported File Formats

- **Word Documents:** `.docx`
- **PDFs:** `.pdf`
- **Text Files:** `.txt`, `.md`, `.mdx`
- **URLs:** Any web page (content extraction may vary)

## Limitations

- Maximum file size: 10MB
- One document or URL per chat session
- URL scraping may not work for all websites (JavaScript-heavy sites, paywalls, etc.)
- Embedding generation may take 1-2 seconds per chunk

## Troubleshooting

### Ollama Connection Error

**Error:** `Failed to connect to Ollama`

**Solution:**
1. Verify Ollama is running: `ollama list`
2. Check the Ollama URL in `.env.local` is correct
3. Try restarting Ollama: `ollama serve`

### Firebase Authentication Error

**Error:** `Firebase authentication failed`

**Solution:**
1. Verify your `.env.local` credentials are correct
2. Ensure the private key includes `\n` characters
3. Check that the service account has Firestore permissions

### PDF Parsing Error

**Error:** `Failed to process PDF`

**Solution:**
1. Ensure the PDF is not password-protected
2. Try a different PDF file
3. Check if the PDF contains extractable text (not scanned images)

### No Relevant Chunks Found

**Issue:** Always getting "I do not have the answer"

**Solution:**
1. Check if the document was uploaded successfully
2. Verify chunks were created in Firestore
3. Try asking questions more directly related to the document content
4. Lower the similarity threshold in the code (currently 0.3)

## Next Steps

- Integrate the frontend to call these APIs
- Add user authentication
- Implement chat session management
- Add support for multiple documents per user
- Optimize embedding generation for large documents

## Support

For issues or questions, check:
- Ollama documentation: https://ollama.com/docs
- Firebase documentation: https://firebase.google.com/docs
- Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
