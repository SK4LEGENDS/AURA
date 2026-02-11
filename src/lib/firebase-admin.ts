import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

/**
 * Initialize Firebase Admin SDK
 * Uses singleton pattern to prevent multiple initializations
 */
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Initialize Firebase Admin with service account credentials
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

    db = getFirestore(app);
    console.log("Firebase Admin initialized successfully");
  } else {
    app = getApps()[0];
    db = getFirestore(app);
  }

  return { app, db };
}

/**
 * Get Firestore database instance
 */
export function getDb(): Firestore {
  if (!db) {
    const initialized = initializeFirebaseAdmin();
    return initialized.db;
  }
  return db;
}
