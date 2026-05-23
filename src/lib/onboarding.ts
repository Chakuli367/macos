// src/lib/onboarding.ts
import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  hasSeenConversation: boolean;
  hasCreatedGoal: boolean;
  onboardingCompletedAt?: string;
}

// Get user's onboarding status from Firestore
export const getOnboardingStatus = async (userId: string): Promise<OnboardingStatus> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        hasCompletedOnboarding: data.hasCompletedOnboarding || false,
        hasSeenConversation: data.hasSeenConversation || false,
        hasCreatedGoal: data.hasCreatedGoal || false,
        onboardingCompletedAt: data.onboardingCompletedAt,
      };
    }
    
    // If user document doesn't exist, create it with default values
    const defaultStatus: OnboardingStatus = {
      hasCompletedOnboarding: false,
      hasSeenConversation: false,
      hasCreatedGoal: false,
    };
    
    await setDoc(doc(db, 'users', userId), {
      ...defaultStatus,
      createdAt: new Date().toISOString(),
      email: auth.currentUser?.email,
    });
    
    return defaultStatus;
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    // Return default status if there's an error
    return {
      hasCompletedOnboarding: false,
      hasSeenConversation: false,
      hasCreatedGoal: false,
    };
  }
};

// Mark conversation as seen
export const markConversationSeen = async (userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      hasSeenConversation: true,
      conversationSeenAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error marking conversation as seen:', error);
    throw error;
  }
};

// Mark goal as created
export const markGoalCreated = async (userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      hasCreatedGoal: true,
      goalCreatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error marking goal as created:', error);
    throw error;
  }
};

// Complete entire onboarding
export const completeOnboarding = async (userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      hasCompletedOnboarding: true,
      hasSeenConversation: true,
      hasCreatedGoal: true,
      onboardingCompletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
};