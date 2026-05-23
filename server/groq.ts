import fetch from 'node-fetch';

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GoalPlanningResponse {
  message: string;
  generatePlan?: boolean;
  questions?: string[];
  plan?: any;
}

class FirebaseAIService {
  async generateQuestions(goalName: string): Promise<string[]> {
    try {
      // Store the goal request in Firestore
      const questionRef = await firestore.collection('ai_requests').add({
        type: 'questions',
        goal_name: goalName,
        timestamp: new Date(),
        status: 'processing'
      });

      // For now, return hardcoded questions - you'd replace this with actual AI service
      const questions = [
        "What specific networking situations make you feel most uncomfortable?",
        "Describe your ideal networking outcome - what would success look like?",
        "What's your biggest challenge when starting conversations with new people?",
        "How confident do you feel in professional social settings (1-10)?",
        "What networking experiences have you had that didn't go well?"
      ];

      // Update status in Firestore
      await questionRef.update({ 
        status: 'completed',
        questions: questions 
      });

      return questions;
    } catch (error) {
      console.error('Firebase AI error:', error);
      throw error;
    }
  }

  async generatePlan(goalName: string, answers: string[], avatar: string): Promise<any> {
    try {
      // Store plan request in Firestore
      const planRef = await firestore.collection('ai_requests').add({
        type: 'plan',
        goal_name: goalName,
        user_answers: answers,
        avatar: avatar,
        timestamp: new Date(),
        status: 'processing'
      });

      // Generate plan based on conversation (replace with actual AI logic)
      const plan = {
        id: planRef.id,
        title: `Master ${goalName}`,
        description: `A personalized plan based on your conversation with ${avatar}`,
        totalDuration: 30,
        feasibilityScore: 85,
        steps: [
          {
            id: '1',
            title: 'Foundation Building',
            description: 'Build confidence through practice exercises',
            estimatedDays: 7,
            difficulty: 'easy',
            completed: false
          },
          {
            id: '2', 
            title: 'Real-world Application',
            description: 'Apply skills in low-pressure environments',
            estimatedDays: 14,
            difficulty: 'medium',
            completed: false
          },
          {
            id: '3',
            title: 'Advanced Techniques',
            description: 'Master advanced social skills',
            estimatedDays: 9,
            difficulty: 'hard',
            completed: false
          }
        ]
      };

      // Save to Firestore
      await planRef.update({
        status: 'completed',
        plan: plan
      });

      return plan;
    } catch (error) {
      console.error('Plan generation error:', error);
      throw error;
    }
  }

  async getAchievementSummary(userId: string, plan: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiBase}/achievement-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          plan: plan
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      return data.summary;
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }
}

import { firestore } from './firebase';

export const externalAPI = new FirebaseAIService();