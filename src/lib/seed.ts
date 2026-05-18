/**
 * Seeds the local .data/ JSON store with mock data on first run.
 * Safe to call multiple times — checks isSeeded() before writing.
 */
import { readCollection, writeCollection, isSeeded } from "./store";
import { getAvatarUrl } from "./utils";

// ── Types (inline to avoid client-side import issues) ────────────────────────

export interface StoredUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string; // demo password
  avatar: string;
  bio: string;
  college?: string;
  company?: string;
  location: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  builderDna: { label: string; emoji: string }[];
  funPrompts: { question: string; answer: string }[];
  aiSummary: string;
  availability: string;
  interests: string[];
  online: boolean;
  createdAt: string;
  liveVibe?: { status: string; activeHours: string; codingEnergy: string; workflow: string };
  personalityStats?: { competitive: number; chaotic: number; shipsFast: number; sleepSchedule: number };
  builderTags?: string[];
  builderMood?: string;
  hyperfixation?: string;
  mostLikelyTo?: string;
  builderArchetype?: string;
  codingSoundtrack?: string;
  builderEnergy?: { chaosLevel: number; shipsFast: number; sleepCycle: number; hackathonEnergy: number; caffeineDependency: number };
  lookingFor?: string[];
  matchInsights?: string[];
}

export interface StoredPing {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  aiSuggested: boolean;
  status: "pending" | "accepted" | "ignored";
  createdAt: string;
}

export interface StoredTeam {
  id: string;
  name: string;
  description: string;
  project: string;
  status: "active" | "planning";
  energy: string;
  lastActive: string;
  createdBy: string;
  createdAt: string;
}

export interface StoredTeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export interface StoredTask {
  id: string;
  teamId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  createdBy: string;
  mood?: string;
  createdAt: string;
}

export interface StoredMessage {
  id: string;
  teamId: string;
  userId: string;
  content: string;
  type: "text" | "system" | "ai-suggestion";
  createdAt: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_USERS: StoredUser[] = [
  {
    id: "1",
    username: "alexcodes",
    name: "Alex Rivera",
    email: "alex@buildr.dev",
    password: "builder123",
    avatar: getAvatarUrl("alex-rivera"),
    bio: "Full-stack dev obsessed with building delightful products. Currently exploring AI agents and creative coding. Always shipping, never sleeping.",
    company: "Ex-Vercel",
    location: "San Francisco, CA",
    github: "alexcodes",
    skills: ["React", "Next.js", "TypeScript", "AI/ML", "System Design"],
    builderDna: [{ label: "Fast Shipper", emoji: "⚡" }, { label: "Night Owl", emoji: "🌙" }, { label: "Startup Addict", emoji: "🚀" }],
    funPrompts: [
      { question: "My toxic debugging trait is…", answer: "Adding console.log('HERE') exactly 47 times before trying the debugger" },
      { question: "I work best when…", answer: "It's 2 AM, lo-fi is playing, and the deadline is tomorrow" },
    ],
    aiSummary: "Creative rapid prototyper who thrives in high-energy, fast-paced environments.",
    availability: "Open",
    interests: ["Hackathon", "Startup", "Side Project"],
    online: true,
    createdAt: "2024-01-15T00:00:00Z",
    liveVibe: { status: "running on caffeine and bad decisions", activeHours: "2 AM – 5 AM", codingEnergy: "Phonk + Hyperfocus", workflow: "Ships first, fixes later" },
    personalityStats: { competitive: 85, chaotic: 90, shipsFast: 95, sleepSchedule: 10 },
    builderTags: ["🚀 Fast Builder", "🌙 Night Owl", "💀 Last Minute Merchant", "☕ Caffeine Powered"],
    builderMood: "💀 sleep deprived",
    hyperfixation: "AI agents and instant noodles",
    mostLikelyTo: "rewrite the entire app over a weekend",
    builderArchetype: "⚡ MVP Speedrunner",
    codingSoundtrack: "Synthwave",
    builderEnergy: { chaosLevel: 85, shipsFast: 95, sleepCycle: 20, hackathonEnergy: 90, caffeineDependency: 100 },
    lookingFor: ["startup cofounders", "AI hackers", "people who actually ship projects"],
    matchInsights: [],
  },
  {
    id: "2",
    username: "priya_ml",
    name: "Priya Patel",
    email: "priya@buildr.dev",
    password: "builder123",
    avatar: getAvatarUrl("priya-patel"),
    bio: "ML engineer by day, creative coder by night. Building at the intersection of art and algorithms.",
    college: "MIT",
    location: "Boston, MA",
    github: "priyaml",
    skills: ["Python", "AI/ML", "Data Science", "Backend", "Cloud"],
    builderDna: [{ label: "AI Enthusiast", emoji: "🤖" }, { label: "System Thinker", emoji: "🧠" }],
    funPrompts: [
      { question: "My toxic debugging trait is…", answer: "Blaming the data instead of my model architecture" },
    ],
    aiSummary: "Methodical AI builder with a passion for ethical tech.",
    availability: "Part-time",
    interests: ["Hackathon", "Open Source", "Research"],
    online: true,
    createdAt: "2024-02-20T00:00:00Z",
    liveVibe: { status: "currently debugging reality", activeHours: "10 AM – 8 PM", codingEnergy: "Classical + Deep Thought", workflow: "Measure twice, cut once" },
    personalityStats: { competitive: 60, chaotic: 30, shipsFast: 65, sleepSchedule: 90 },
    builderTags: ["🤖 AI Maxxer", "🧠 Idea Machine", "☕ Caffeine Powered"],
    builderMood: "🤖 AI-maxxing",
    hyperfixation: "Local LLMs and optimization",
    mostLikelyTo: "try to automate their entire life with LLMs",
    builderArchetype: "🤖 AI Maxxer",
    codingSoundtrack: "Doom soundtrack",
    builderEnergy: { chaosLevel: 75, shipsFast: 85, sleepCycle: 50, hackathonEnergy: 100, caffeineDependency: 85 },
    lookingFor: ["AI hackers", "hackathon teammates"],
    matchInsights: [],
  },
  {
    id: "3",
    username: "designjay",
    name: "Jay Kim",
    email: "jay@buildr.dev",
    password: "builder123",
    avatar: getAvatarUrl("jay-kim"),
    bio: "Product designer who codes. I obsess over micro-interactions and believe every pixel tells a story.",
    company: "Ex-Linear",
    location: "New York, NY",
    github: "designjay",
    skills: ["UI/UX", "Figma", "React", "TypeScript", "Next.js"],
    builderDna: [{ label: "Design Obsessed", emoji: "🎨" }, { label: "Creative Coder", emoji: "✨" }],
    funPrompts: [
      { question: "My toxic debugging trait is…", answer: "Spending 3 hours on a button shadow before writing any logic" },
    ],
    aiSummary: "Design-driven builder with engineering chops.",
    availability: "Open",
    interests: ["Startup", "Side Project", "Freelance"],
    online: false,
    createdAt: "2024-03-10T00:00:00Z",
    liveVibe: { status: "pixel pushing at 120Hz", activeHours: "11 AM – 2 AM", codingEnergy: "Lo-Fi + Aesthetic Flow", workflow: "Design first, code later" },
    personalityStats: { competitive: 40, chaotic: 50, shipsFast: 70, sleepSchedule: 60 },
    builderTags: ["🎨 UI Addict", "🎧 Lo-Fi Coder", "✨ Pixel Perfect"],
    builderMood: "🎧 locked into synthwave",
    hyperfixation: "CSS micro-animations",
    mostLikelyTo: "Spend 4 hours picking the perfect font",
    builderArchetype: "🎨 UI Wizard",
    codingSoundtrack: "Lo-fi",
    builderEnergy: { chaosLevel: 40, shipsFast: 70, sleepCycle: 80, hackathonEnergy: 75, caffeineDependency: 60 },
    lookingFor: ["backend goblins", "startup cofounders"],
    matchInsights: [],
  },
  {
    id: "4",
    username: "rustacean_dev",
    name: "Sam Okafor",
    email: "sam@buildr.dev",
    password: "builder123",
    avatar: getAvatarUrl("sam-okafor"),
    bio: "Systems programmer and performance enthusiast. If it's not fast, it's broken.",
    company: "CloudFlare",
    location: "Austin, TX",
    github: "rustaceansam",
    skills: ["Rust", "Go", "Backend", "System Design", "DevOps", "Docker"],
    builderDna: [{ label: "Competitive", emoji: "🏆" }, { label: "System Thinker", emoji: "🧠" }],
    funPrompts: [{ question: "My go-to stack for a weekend project…", answer: "Rust + HTMX. Fight me." }],
    aiSummary: "Performance-obsessed systems builder who writes bulletproof code.",
    availability: "Weekends",
    interests: ["Open Source", "Hackathon", "Research"],
    online: true,
    createdAt: "2024-01-28T00:00:00Z",
    liveVibe: { status: "borrow checker survivor", activeHours: "9 AM – 6 PM", codingEnergy: "Synthwave + Intense Focus", workflow: "Architects forever, compiles once" },
    personalityStats: { competitive: 95, chaotic: 20, shipsFast: 40, sleepSchedule: 95 },
    builderTags: ["🛠 Fixes Bugs Live", "🦀 Rustacean", "🧠 Deep Thinker"],
    builderMood: "🔥 hackathon tunnel vision",
    builderArchetype: "🦀 Systems Sage",
    codingSoundtrack: "Industrial Techno",
    builderEnergy: { chaosLevel: 20, shipsFast: 50, sleepCycle: 90, hackathonEnergy: 60, caffeineDependency: 70 },
    lookingFor: ["infra hackers"],
    matchInsights: [],
  },
  {
    id: "5",
    username: "luna_dev",
    name: "Luna Zhang",
    email: "luna@buildr.dev",
    password: "builder123",
    avatar: getAvatarUrl("luna-zhang"),
    bio: "Indie hacker building micro-SaaS products. Shipped 4 products in the last year.",
    location: "Toronto, Canada",
    github: "lunabuilds",
    skills: ["React", "Next.js", "TypeScript", "Backend", "Databases"],
    builderDna: [{ label: "Indie Hacker", emoji: "💡" }, { label: "Fast Shipper", emoji: "⚡" }],
    funPrompts: [{ question: "My toxic debugging trait is…", answer: "Deploying to prod to see if the fix works instead of testing locally" }],
    aiSummary: "Pragmatic builder focused on shipping and validation.",
    availability: "Full-time",
    interests: ["Startup", "Side Project", "Freelance"],
    online: false,
    createdAt: "2024-04-05T00:00:00Z",
    liveVibe: { status: "shipping micro-SaaS #5", activeHours: "Anytime", codingEnergy: "Pop + Extreme Chaos", workflow: "Ship now, fix in prod" },
    personalityStats: { competitive: 80, chaotic: 85, shipsFast: 100, sleepSchedule: 40 },
    builderTags: ["🔥 Startup Energy", "🚀 Fast Builder", "💀 Prod Deployer"],
    builderMood: "🚀 shipping mode",
    builderArchetype: "🚀 Indie Hacker",
    codingSoundtrack: "Ambient rain sounds",
    builderEnergy: { chaosLevel: 90, shipsFast: 100, sleepCycle: 10, hackathonEnergy: 95, caffeineDependency: 90 },
    lookingFor: ["hackathon teammates"],
    matchInsights: [],
  },
  {
    id: "6",
    username: "blockdev_max",
    name: "Max Andersen",
    email: "max@buildr.dev",
    password: "builder123",
    avatar: getAvatarUrl("max-andersen"),
    bio: "Web3 builder and DeFi researcher. Smart contract security nerd.",
    college: "ETH Zurich",
    location: "Berlin, Germany",
    github: "maxblockdev",
    skills: ["Blockchain", "Web3", "TypeScript", "Security", "Backend"],
    builderDna: [{ label: "Night Owl", emoji: "🌙" }, { label: "Hackathon Veteran", emoji: "🎖️" }],
    funPrompts: [{ question: "The stack I pretend to understand…", answer: "ZK-Rollups. I nod and say 'cryptography' a lot." }],
    aiSummary: "Deep technical builder with a vision for decentralized systems.",
    availability: "Hackathons Only",
    interests: ["Hackathon", "Open Source", "Research"],
    online: true,
    createdAt: "2024-02-14T00:00:00Z",
    liveVibe: { status: "powered by instant noodles", activeHours: "1 AM – 7 AM", codingEnergy: "Techno + Mainframe Hacking", workflow: "Reads docs for 5 hours, codes for 1" },
    personalityStats: { competitive: 70, chaotic: 95, shipsFast: 50, sleepSchedule: 5 },
    builderTags: ["🌙 Night Owl", "🧠 Deep Thinker", "💀 Last Minute Merchant"],
    builderMood: "☕ caffeinated",
    builderArchetype: "🛡️ Security Gremlin",
    codingSoundtrack: "Dark Ambient",
    builderEnergy: { chaosLevel: 95, shipsFast: 50, sleepCycle: 5, hackathonEnergy: 90, caffeineDependency: 100 },
    lookingFor: ["DeFi degens", "auditors"],
    matchInsights: [],
  },
];

const SEED_PINGS: StoredPing[] = [
  { id: "ping_1", fromUserId: "2", toUserId: "1", message: "Hey! I noticed we both enjoy AI + productivity tools. Want to team up for an upcoming hackathon?", aiSuggested: true, status: "pending", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "ping_2", fromUserId: "4", toUserId: "1", message: "Your builder DNA is awesome. I think our skills complement each other perfectly for a systems project!", aiSuggested: true, status: "pending", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "ping_3", fromUserId: "6", toUserId: "1", message: "Love your debugging trait 😂 Would you be interested in collaborating on a mobile-first AI app?", aiSuggested: false, status: "pending", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "ping_4", fromUserId: "1", toUserId: "5", message: "Hey Luna! Your indie hacker energy is inspiring. Want to brainstorm some micro-SaaS ideas?", aiSuggested: true, status: "accepted", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "ping_5", fromUserId: "1", toUserId: "3", message: "Jay! Fellow hackathon veteran here. Let's team up for the next one?", aiSuggested: false, status: "pending", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "ping_6", fromUserId: "3", toUserId: "2", message: "Priya! I love your AI research. Want to collaborate on something visual + ML?", aiSuggested: true, status: "pending", createdAt: new Date(Date.now() - 43200000).toISOString() },
];

const SEED_TEAMS: StoredTeam[] = [
  { id: "team_1", name: "Team Nexus", description: "Building an AI-powered developer tool", project: "AI Code Review Bot", status: "active", energy: "Chaotic Productive", lastActive: "2m ago", createdBy: "1", createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: "team_2", name: "HackSquad Alpha", description: "Hackathon team for upcoming AI hackathon", project: "Smart Campus App", status: "planning", energy: "Warming Up", lastActive: "1h ago", createdBy: "1", createdAt: new Date(Date.now() - 1209600000).toISOString() },
];

const SEED_TEAM_MEMBERS: StoredTeamMember[] = [
  { id: "tm_1", teamId: "team_1", userId: "1", role: "🎨 UI Wizard / Frontend Gremlin", joinedAt: new Date(Date.now() - 604800000).toISOString() },
  { id: "tm_2", teamId: "team_1", userId: "2", role: "🤖 AI Maxxer", joinedAt: new Date(Date.now() - 604800000).toISOString() },
  { id: "tm_3", teamId: "team_1", userId: "3", role: "💀 Backend Goblin", joinedAt: new Date(Date.now() - 604800000).toISOString() },
  { id: "tm_4", teamId: "team_2", userId: "1", role: "🚀 Project Lead / Full Stack", joinedAt: new Date(Date.now() - 1209600000).toISOString() },
  { id: "tm_5", teamId: "team_2", userId: "4", role: "⚙️ Systems Architect", joinedAt: new Date(Date.now() - 1209600000).toISOString() },
  { id: "tm_6", teamId: "team_2", userId: "6", role: "📱 Mobile UI Specialist", joinedAt: new Date(Date.now() - 1209600000).toISOString() },
];

const SEED_TASKS: StoredTask[] = [
  { id: "task_1", teamId: "team_1", title: "Set up project repo", description: "", status: "done", priority: "high", assigneeId: "1", createdBy: "1", mood: "☕ running on caffeine", createdAt: new Date(Date.now() - 518400000).toISOString() },
  { id: "task_2", teamId: "team_1", title: "Design system & component library", description: "", status: "in-progress", priority: "high", assigneeId: "3", createdBy: "1", mood: "🎨 making it pop", createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: "task_3", teamId: "team_1", title: "Implement AI code analysis API", description: "", status: "in-progress", priority: "urgent", assigneeId: "2", createdBy: "1", mood: "💀 this API is fighting back", createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: "task_4", teamId: "team_1", title: "Build diff viewer component", description: "", status: "todo", priority: "medium", assigneeId: "1", createdBy: "1", mood: "🚀 shipping tonight no matter what", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "task_5", teamId: "team_2", title: "Define hackathon MVP scope", description: "", status: "done", priority: "urgent", assigneeId: "4", createdBy: "1", mood: "⚡ locked in", createdAt: new Date(Date.now() - 1036800000).toISOString() },
  { id: "task_6", teamId: "team_2", title: "Set up React Native project", description: "", status: "in-progress", priority: "high", assigneeId: "6", createdBy: "1", mood: "📱 mobile grinding", createdAt: new Date(Date.now() - 864000000).toISOString() },
  { id: "task_7", teamId: "team_2", title: "Build room booking API", description: "", status: "todo", priority: "medium", assigneeId: "4", createdBy: "1", mood: "🔧 backend time", createdAt: new Date(Date.now() - 691200000).toISOString() },
];

const SEED_MESSAGES: StoredMessage[] = [
  { id: "msg_1", teamId: "team_1", userId: "2", content: "Hey team! I've been thinking about the architecture for the AI code review bot.", type: "text", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "msg_2", teamId: "team_1", userId: "1", content: "Nice! I was prototyping the frontend last night. Got a basic diff viewer working with syntax highlighting.", type: "text", createdAt: new Date(Date.now() - 86340000).toISOString() },
  { id: "msg_3", teamId: "team_1", userId: "3", content: "I can start on the UI design today. I'm thinking a Linear-inspired minimal interface.", type: "text", createdAt: new Date(Date.now() - 86280000).toISOString() },
  { id: "msg_s1", teamId: "team_1", userId: "1", content: "✨ AI Suggestion: Consider using tree-sitter for AST parsing — it would give you language-agnostic code analysis capabilities.", type: "ai-suggestion", createdAt: new Date(Date.now() - 86220000).toISOString() },
  { id: "msg_a1", teamId: "team_2", userId: "4", content: "Alright team, the hackathon starts in 48 hours. What's our MVP scope?", type: "text", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "msg_a2", teamId: "team_2", userId: "1", content: "I say we go with the smart campus idea — room booking + AR navigation.", type: "text", createdAt: new Date(Date.now() - 172740000).toISOString() },
  { id: "msg_a3", teamId: "team_2", userId: "6", content: "Love it. I can handle the mobile UI and the map integration.", type: "text", createdAt: new Date(Date.now() - 172680000).toISOString() },
];

// ── Seed function ─────────────────────────────────────────────────────────────

export function seedIfNeeded() {
  if (!isSeeded("users")) writeCollection("users", SEED_USERS);
  if (!isSeeded("pings")) writeCollection("pings", SEED_PINGS);
  if (!isSeeded("teams")) writeCollection("teams", SEED_TEAMS);
  if (!isSeeded("team_members")) writeCollection("team_members", SEED_TEAM_MEMBERS);
  if (!isSeeded("tasks")) writeCollection("tasks", SEED_TASKS);
  if (!isSeeded("messages")) writeCollection("messages", SEED_MESSAGES);
}

// Re-export types for API routes


// Re-export readCollection for convenience
export { readCollection, writeCollection, insertOne, updateOne, findById } from "./store";
