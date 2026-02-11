
import * as fs from 'fs';
import * as path from 'path';

// Manual .env loading to avoid dependency issues
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        console.log("Raw .env preview:", envConfig.substring(0, 200).replace(/\n/g, "\\n"));

        envConfig.split('\n').forEach((line, index) => {
            const cleanLine = line.trim();
            if (!cleanLine || cleanLine.startsWith('#')) return;

            const equalsIndex = cleanLine.indexOf('=');
            if (equalsIndex > 0) {
                const key = cleanLine.substring(0, equalsIndex).trim();
                let value = cleanLine.substring(equalsIndex + 1).trim();

                // Handle quotes
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                process.env[key] = value;
            }
        });
        console.log("Loaded .env file manually.");
        console.log("Firebase Env Vars found:", Object.keys(process.env).filter(k => k.startsWith('FIREBASE')));
        console.log("Private Key Length:", process.env.FIREBASE_PRIVATE_KEY?.length);
    }
} catch (e) {
    console.warn("Failed to load .env manually:", e);
}

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Mock getDb function inline
function getDb() {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        });
    }
    return getFirestore();
}

// Usage: npx ts-node src/scripts/inspect-chunks.ts <chatId>

const chatId = process.argv[2];

// Execute
(async () => {
    if (!chatId) {
        console.log("No Chat ID provided. Listing recent chats...");
        await listChats();
    } else {
        await inspectChunks(chatId);
    }
})().catch(err => console.error("Top-level error:", err));

async function listChats() {
    try {
        const db = getDb();
        const chatsSnapshot = await db.collection("chats")
            .orderBy("updatedAt", "desc")
            .limit(5)
            .get();

        if (chatsSnapshot.empty) {
            console.log("No chats found in database.");
            return;
        }

        console.log("\n--- RECENT CHATS ---");
        chatsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`ID: ${doc.id}`);
            console.log(`Title: ${data.title}`);
            console.log(`Updated: ${data.updatedAt}`);
            console.log("-------------------");
        });
        console.log("\nTo inspect a chat, run:");
        console.log("npx ts-node src/scripts/inspect-chunks.ts <CHAT_ID>");
    } catch (error) {
        console.error("Error listing chats:", error);
    }
}

async function inspectChunks(id: string) {
    console.log(`--- INSPECTING CHUNKS FOR CHAT: ${id} ---`);
    try {
        const db = getDb();
        const chatRef = db.collection("chats").doc(id);
        const chatDoc = await chatRef.get();


        if (!chatDoc.exists) {
            console.error("⚠️  Parent Chat Document NOT FOUND! (This might be a Zombie container)");
            console.log("Proceeding to check for orphaned chunks...");
        } else {
            const chatData = chatDoc.data();
            console.log("Chat Metadata:", {
                title: chatData?.title,
                sourceName: chatData?.sourceName,
                sourceType: chatData?.sourceType,
                documentContentLength: chatData?.documentContent?.length || 0
            });
        }

        // Fetch chunks
        const chunksSnapshot = await chatRef.collection("chunks").orderBy("chunkIndex").get();
        console.log(`\nFound ${chunksSnapshot.size} chunks.`);


        if (chunksSnapshot.empty) {
            console.log("No chunks found in subcollection.");
        } else {
            // ZOMBIE CHECK: Search for specific keywords from the AI's hallucination
            const zombieKeywords = ["jogger", "cyclist", "garmin", "strava", "modern global education"];
            let zombiesFound = 0;

            console.log("\n--- ZOMBIE DATA SCAN ---");
            chunksSnapshot.forEach(doc => {
                const text = doc.data().text.toLowerCase();
                const foundKeyword = zombieKeywords.find(k => text.includes(k));
                if (foundKeyword) {
                    zombiesFound++;
                    console.log(`[ALERT] Found ZOMBIE DATA (match: "${foundKeyword}") in Chunk ${doc.data().chunkIndex}`);
                    console.log(`Preview: "${doc.data().text.substring(0, 100).replace(/\n/g, " ")}..."`);
                }
            });

            if (zombiesFound === 0) {
                console.log("✓ No zombie keywords found in chunks.");
            } else {
                console.log(`\n[CRITICAL] Found ${zombiesFound} contaminated chunks! The database has mixed data.`);
            }

            console.log("\n--- FIRST 3 CHUNKS PREVIEW ---");
            let count = 0;
            chunksSnapshot.forEach(doc => {
                if (count < 3) {
                    console.log(`[Chunk ${doc.data().chunkIndex}] ${doc.data().text.substring(0, 80).replace(/\n/g, " ")}...`);
                    count++;
                }
            });
        }

    } catch (error) {
        console.error("Error inspecting chunks:", error);
    }
}

// inspectChunks called inside the if/else block above
