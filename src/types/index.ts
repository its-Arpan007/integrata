export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  college?: string;
  company?: string;
  location: string;
  github?: string;
  portfolio?: string;
  skills: Skill[];
  builderDna: BuilderDnaTag[];
  funPrompts: FunPrompt[];
  aiSummary: string;
  availability: Availability;
  interests: ProjectType[];
  createdAt: string;
  online?: boolean;
  liveVibe?: {
    status: string;
    activeHours: string;
    codingEnergy: string;
    workflow: string;
  };
  personalityStats?: {
    competitive: number;
    chaotic: number;
    shipsFast: number;
    sleepSchedule: number;
  };
  builderTags?: string[];
  builderMood?: string;
  hyperfixation?: string;
  mostLikelyTo?: string;
  matchInsights?: string[];
  builderArchetype?: string;
  codingSoundtrack?: string;
  builderEnergy?: {
    chaosLevel: number;
    shipsFast: number;
    sleepCycle: number;
    hackathonEnergy: number;
    caffeineDependency: number;
  };
  lookingFor?: string[];
}

export type Skill = string;

export type KnownSkill =
  | "React"
  | "Next.js"
  | "TypeScript"
  | "Python"
  | "AI/ML"
  | "Backend"
  | "Node.js"
  | "DevOps"
  | "UI/UX"
  | "Figma"
  | "Blockchain"
  | "Rust"
  | "Go"
  | "Flutter"
  | "Swift"
  | "Databases"
  | "Cloud"
  | "Security"
  | "Data Science"
  | "Web3"
  | "Mobile"
  | "System Design"
  | "GraphQL"
  | "Docker";

export interface BuilderDnaTag {
  label: string;
  emoji: string;
}

export interface FunPrompt {
  question: string;
  answer: string;
}

export type Availability = "Full-time" | "Part-time" | "Weekends" | "Hackathons Only" | "Open";

export type ProjectType =
  | "Hackathon"
  | "Startup"
  | "Side Project"
  | "Open Source"
  | "Freelance"
  | "Research"
  | "Learning";

export interface Ping {
  id: string;
  fromUser: User;
  toUser: User;
  message: string;
  aiSuggested: boolean;
  status: "pending" | "accepted" | "ignored";
  createdAt: string;
}

export interface CompatibilityResult {
  overallScore: number;
  dimensions: CompatibilityDimension[];
  strengths: string[];
  challenges: string[];
  suggestedRoles: RoleSuggestion[];
  projectIdeas: string[];
  aiInsight: string;
}

export interface CompatibilityDimension {
  name: string;
  score: number;
  icon: string;
  description: string;
}

export interface RoleSuggestion {
  user: string;
  role: string;
  reason: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projectIdeas: string[];
  tasks: Task[];
  messages: Message[];
  createdAt: string;
}

export interface TeamMember {
  user: User;
  role: string;
  joinedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  assignee?: User;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

export interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  type: "text" | "system" | "ai-suggestion";
}
