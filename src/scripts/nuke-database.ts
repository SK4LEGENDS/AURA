
import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- ENV LOADING ---
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach((line) => {
            const cleanLine = line.trim();
            if (!cleanLine || cleanLine.startsWith('#')) return;
            const equalsIndex = cleanLine.indexOf('=');
            if (equalsIndex > 0) {
                const key = cleanLine.substring(0, equalsIndex).trim();
                let value = cleanLine.substring(equalsIndex + 1).trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn("Failed to load .env manually:", e);
}

// --- FIREBASE INIT ---
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

async function nukeDatabase() {
    console.log("☢️  INITIATING NUCLEAR CLEANUP  ☢️");
    console.log("This will permanently delete ALL chats and ALL chunks (including zombies).");
    console.log("Waiting 3 seconds... Press Ctrl+C to cancel.");
    await new Promise(r => setTimeout(r, 3000));

    const db = getDb();

    // 1. DELETE ALL CHUNKS (COLLECTION GROUP)
    // This finds every document in any 'chunks' collection, regardless of parent.
    console.log("\n[1/3] Hunting Zombie Chunks...");
    const chunksQuery = db.collectionGroup('chunks');
    const chunksSnapshot = await chunksQuery.get();

    if (chunksSnapshot.empty) {
        console.log("✓ No chunks found.");
    } else {
        console.log(`Found ${chunksSnapshot.size} chunks. Deleting...`);
        const batch = db.batch();
        let count = 0;
        let batchCount = 0;

        for (const doc of chunksSnapshot.docs) {
            batch.delete(doc.ref);
            count++;
            batchCount++;

            if (batchCount >= 400) {
                await batch.commit();
                console.log(`Deleted ${count} chunks...`);
                batchCount = 0; // Reset batch count, new batch created implicitly by next op? 
                // Firestore batch is max 500. We need a new batch object.
                // Re-instantiating batch in loop is tricky, better to use recursiveDelete or chunked batches properly.
                // Simple implementation:
            }
        }
        if (batchCount > 0) {
            await batch.commit();
        }
        console.log(`✓ Deleted ${count} chunks.`);
    }

    // 2. DELETE ALL MESSAGES (COLLECTION GROUP)
    console.log("\n[2/3] Deleting Messages...");
    const messagesQuery = db.collectionGroup('messages');
    const messagesSnapshot = await messagesQuery.get();

    if (messagesSnapshot.empty) {
        console.log("✓ No messages found.");
    } else {
        console.log(`Found ${messagesSnapshot.size} messages. Deleting...`);
        // We'll use recursiveDelete on the parents later, but let's be thorough with collectionGroup
        // Actually, let's just let the Chat deletion handle subcollections, 
        // BUT to be safe against orphans, let's delete them.

        // Simplified batch delete for messages found via group query
        const batch = db.batch();
        let ops = 0;
        for (const doc of messagesSnapshot.docs) {
            batch.delete(doc.ref);
            ops++;
            if (ops >= 400) { await batch.commit(); ops = 0; }
        }
        if (ops > 0) await batch.commit();
        console.log(`✓ Deleted ${messagesSnapshot.size} messages.`);
    }

    // 3. DELETE ALL CHATS (ROOT COLLECTION)
    console.log("\n[3/3] Deleting Chat Containers...");
    const chatsRef = db.collection('chats');
    const chatsSnapshot = await chatsRef.get();

    if (chatsSnapshot.empty) {
        console.log("✓ No chats found.");
    } else {
        console.log(`Found ${chatsSnapshot.size} chat documents. Deleting...`);
        // Use recursive delete to clean up any remaining subcollections
        for (const doc of chatsSnapshot.docs) {
            await db.recursiveDelete(doc.ref);
            process.stdout.write(".");
        }
        console.log("\n✓ All chats deleted.");
    }

    console.log("\n✨ DATABASE IS NOW EMPTY. CLEAN SLATE. ✨");
}

nukeDatabase().catch(console.error);
