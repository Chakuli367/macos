/**
 * createSampleUsers.js
 * Seed Firestore with full sample user using specified UID
 */

import admin from "firebase-admin";

// ===== FIREBASE CONFIG =====
const serviceAccount = {
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CLIENT_X509_CERT_URL"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ===== FULL EXTENDED USER DATA =====
async function seedUser() {
  const userId = "ZmBuCyZZepZLmD9p4rKqWywCDqx2";
  const userRef = db.collection("users").doc(userId);

  const data = {
    displayName: "Sample User",
    email: "sample@example.com",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),

    traits: {
      conversation: { current: 45, future: 85, color: "#a855f7", icon: "MessageCircle" },
      listening: { current: 60, future: 90, color: "#c084fc", icon: "Heart" },
      confidence: { current: 35, future: 80, color: "#d946ef", icon: "Zap" },
      networking: { current: 40, future: 75, color: "#9333ea", icon: "Users" },
      empathy: { current: 70, future: 95, color: "#e879f9", icon: "Sparkles" },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },

    skills: [
      { name: "Conversation Initiation", level: 45, xp: 2250, maxXp: 5000, color: "#a855f7", trend: [30,32,35,38,40,45] },
      { name: "Listening & Empathy", level: 70, xp: 3500, maxXp: 5000, color: "#c084fc", trend: [55,58,62,65,68,70] },
      { name: "Confidence & Assertiveness", level: 35, xp: 1750, maxXp: 5000, color: "#d946ef", trend: [20,23,26,29,32,35] },
      { name: "Networking", level: 40, xp: 2000, maxXp: 5000, color: "#9333ea", trend: [25,28,32,35,38,40] }
    ],

    actions: [
      { id: 1, action: "Complimented a friend", skill: "Empathy", date: "2025-09-28", xp: 50, difficulty: "Easy" },
      { id: 2, action: "Started conversation with stranger", skill: "Conversation", date: "2025-09-27", xp: 100, difficulty: "Hard" },
      { id: 3, action: "Joined a networking event", skill: "Networking", date: "2025-09-26", xp: 150, difficulty: "Medium" }
    ],

    challenges: [
      { id: "c1", title: "Start 3 conversations with strangers", xp: 300, streak: 2, badge: "🗣️", completed: false },
      { id: "c2", title: "Give 5 genuine compliments", xp: 150, streak: 1, badge: "💬", completed: false },
      { id: "c3", title: "Attend a networking event", xp: 250, streak: 0, badge: "🤝", completed: false },
      { id: "c4", title: "Share an insight in a group discussion", xp: 200, streak: 1, badge: "📝", completed: false }
    ],

    timeline: [
      { id: 1, stage: "Starting Out", description: "You began by complimenting friends", icon: "💬", color: "#a855f7" },
      { id: 2, stage: "Building Confidence", description: "Joined a group activity and met new people", icon: "🎉", color: "#c084fc" },
      { id: 3, stage: "Networking", description: "Participated in a small meetup and connected with peers", icon: "🤝", color: "#d946ef" },
      { id: 4, stage: "Reflection", description: "Noted progress and planned next week challenges", icon: "📝", color: "#e879f9" }
    ],

    reflection: {
      mood: null,
      lastSubmittedAt: null,
      entries: []
    },

    stats: {
      totalXp: 2250 + 3500 + 1750 + 2000,
      streak: 12,
      totalActions: 3,
      percentile: 15,
      vsAverage: 28,
      vsLastMonth: 45
    },

    meta: {
      seededBy: "createSampleUsers.js",
      seededAt: admin.firestore.FieldValue.serverTimestamp()
    }
  };

  try {
    await userRef.set(data, { merge: true });
    console.log(`✅ User seeded successfully with UID: ${userId}`);
  } catch (err) {
    console.error("❌ Error seeding user:", err);
  }
}

// Run
seedUser();

