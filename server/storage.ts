import { type User, type InsertUser, type Goal, type InsertGoal } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  getUserGoals(userId: string): Promise<Goal[]>;
  getGoal(goalId: string): Promise<Goal | undefined>;
  updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private goals: Map<string, Goal>;

  constructor() {
    this.users = new Map();
    this.goals = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      createdAt: new Date() 
    };
    this.goals.set(id, goal);
    return goal;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.userId === userId
    );
  }

  async getGoal(goalId: string): Promise<Goal | undefined> {
    return this.goals.get(goalId);
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const existingGoal = this.goals.get(goalId);
    if (!existingGoal) return undefined;

    const updatedGoal: Goal = { ...existingGoal, ...updates };
    this.goals.set(goalId, updatedGoal);
    return updatedGoal;
  }
}

export const storage = new MemStorage();
