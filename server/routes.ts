import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { externalAPI } from "./groq";
import { firestore } from "./firebase";
import { z } from "zod";
const questionsRequestSchema = z.object({
  goal_name: z.string(),
});
const planGenerationSchema = z.object({
  goal_name: z.string(),
  user_answers: z.array(z.string()),
  avatar: z.enum(["Skyler", "Raven", "Phoenix"]),
});
const summaryRequestSchema = z.object({
  user_id: z.string(),
  plan: z.string(),
});
export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/chat", async (req, res) => {
    try {
      const { user_id, message, goal_name = "their personal goal" } = req.body;
      if (!user_id || !message) {
        return res
          .status(400)
          .json({ error: "user_id and message are required" });
      }
      let conversationDoc;
      try {
        conversationDoc = await firestore
          .collection("conversations")
          .doc(user_id)
          .get();
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
      const conversationHistory = conversationDoc?.exists
        ? (conversationDoc.data()?.messages || []).map((msg) => ({
            ...msg,
          }))
        : [];
      const newUserMessage = {
        role: "user",
        content: message,
      };
      conversationHistory.push(newUserMessage);
      let reply = "";
      const messageCount = conversationHistory.filter(
        (m) => m.role === "user",
      ).length;
      if (messageCount === 1) {
        reply = `I understand you're working on ${goal_name}. Tell me more about what specific challenges you're facing in this area.`;
      } else if (messageCount === 2) {
        reply = `That gives me good context. What would success look like for you in this situation? What's your ideal outcome?`;
      } else if (messageCount === 3) {
        reply = `I see. What has prevented you from achieving this goal so far? What obstacles have you encountered?`;
      } else {
        reply = `Based on our conversation, I think I have enough information to help create a personalized plan for you. Would you like me to start working on that?`;
      }
      const aiMessage = {
        role: "assistant",
        content: reply,
      };
      conversationHistory.push(aiMessage);
      await firestore.collection("conversations").doc(user_id).set({
        messages: conversationHistory,
        goal_name: goal_name,
        last_updated: new Date(), // You can keep this if you want to track updates
      });
      const serializableHistory = conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
        // Removed timestamp from serialization
      }));
      res.json({ reply, conversationHistory: serializableHistory });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: `Unexpected error: ${error.message}` });
    }
  });

  // Real-time conversation endpoint
  // Real-time conversation endpoint using your Render AI
  app.post("/api/conversation", async (req, res) => {
    console.log("Incoming /api/conversation request:", req.body);

    try {
      const { user_id, message, goal_name } = req.body;

      if (!user_id || !message) {
        console.warn("Missing user_id or message:", req.body);
        return res
          .status(400)
          .json({ success: false, error: "user_id and message are required" });
      }

      console.log("Loading conversation from Firestore for user:", user_id);
      const docRef = firestore.collection("conversations").doc(user_id);
      const doc = await docRef.get();
      const conversationHistory = doc.exists
        ? (doc.data()?.messages || []).map((msg: any) => ({ ...msg }))
        : [];
      console.log("Current conversation history:", conversationHistory);

      // Add new user message
      const newUserMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      conversationHistory.push(newUserMessage);
      console.log("Added new user message:", newUserMessage);

      console.log("Calling Render AI endpoint with goal_name:", goal_name);
      const response = await axios.post(
        "https://one23-u2ck.onrender.com/chat",
        {
          user_id,
          message,
          goal_name,
        },
      );
      console.log("Response from Render AI endpoint:", response.data);

      const aiMessage = {
        role: "assistant",
        content: response.data.reply,
        timestamp: new Date(),
      };
      conversationHistory.push(aiMessage);
      console.log("Appended AI message to conversation history:", aiMessage);

      console.log("Saving updated conversation back to Firestore...");
      await docRef.set({
        messages: conversationHistory,
        goal_name: goal_name || "their personal goal",
        last_updated: new Date(),
      });

      const serializableHistory = conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log("Returning response to client...");
      res.json({
        success: true,
        data: {
          message: aiMessage.content,
          final_goal: response.data.final_goal || null,
          conversationHistory: serializableHistory,
        },
      });
    } catch (error: any) {
      console.error("Conversation error caught:", error);
      res.status(500).json({
        success: false,
        error: `Failed to process conversation: ${error.message}`,
      });
    }
  });

  // Generate plan endpoint
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { messages, avatar, goalText } = req.body;

      const plan = await externalAPI.generatePlan(goalText, [], avatar);

      res.json({ success: true, data: plan });
    } catch (error) {
      console.error("Plan generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate plan",
      });
    }
  });

  // Get questions for goal
  app.post("/ask-questions", async (req, res) => {
    try {
      const { goal_name } = questionsRequestSchema.parse(req.body);

      const questions = await externalAPI.generateQuestions(goal_name);

      res.json({ success: true, questions: questions.join("\n") });
    } catch (error) {
      console.error("Questions generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate questions",
      });
    }
  });

  // Generate final plan
  app.post("/final-plan", async (req, res) => {
    try {
      const { goal_name, user_answers, avatar } = planGenerationSchema.parse(
        req.body,
      );

      const plan = await externalAPI.generatePlan(
        goal_name,
        user_answers,
        avatar,
      );

      res.json({ success: true, plan });
    } catch (error) {
      console.error("Plan generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate plan",
      });
    }
  });

  // Achievement summary
  app.post("/achievement-summary", async (req, res) => {
    try {
      const { user_id, plan } = summaryRequestSchema.parse(req.body);

      const summary = await externalAPI.getAchievementSummary(user_id, plan);

      res.json({ success: true, summary });
    } catch (error) {
      console.error("Summary generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate summary",
      });
    }
  });

  // Save plan to Firebase
  app.post("/api/save-plan", async (req, res) => {
    try {
      const { userId, plan, avatar, timestamp } = req.body;

      // Save to plans/{user.uid}/plan path
      await firestore
        .collection("plans")
        .doc(userId)
        .collection("plan")
        .add({
          plan: plan,
          avatar: avatar,
          generated_at: new Date(timestamp),
          created_at: new Date(),
        });

      res.json({ success: true });
    } catch (error) {
      console.error("Plan save error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to save plan",
      });
    }
  });

  // Get user goals
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const goals = await storage.getUserGoals(userId);

      res.json({ success: true, data: goals });
    } catch (error) {
      console.error("Goals fetch error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch goals",
      });
    }
  });

  // Get user plan from Firestore
  app.get("/api/plan/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      // Fetch from plans/{user.uid}/plan
      const planSnapshot = await firestore
        .collection("plans")
        .doc(userId)
        .collection("plan")
        .orderBy("created_at", "desc")
        .limit(1)
        .get();

      if (planSnapshot.empty) {
        return res.status(404).json({
          success: false,
          error: "No plan found for user",
        });
      }

      const planDoc = planSnapshot.docs[0];
      const planData = planDoc.data();

      res.json({
        success: true,
        data: {
          id: planDoc.id,
          ...planData,
        },
      });
    } catch (error) {
      console.error("Plan fetch error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch plan",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
