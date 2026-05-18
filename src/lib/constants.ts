import type { BuilderDnaTag, Skill, ProjectType } from "@/types";

export const APP_NAME = "Buildr";
export const APP_TAGLINE = "Find Your Perfect Builder Team.";
export const APP_DESCRIPTION =
  "Buildr helps developers, designers, and founders discover teammates based on chemistry, ambition, and work style.";

export const ALL_SKILLS: Skill[] = [
  "React", "Next.js", "TypeScript", "Python", "AI/ML", "Backend",
  "Node.js", "DevOps", "UI/UX", "Figma", "Blockchain", "Rust",
  "Go", "Flutter", "Swift", "Databases", "Cloud", "Security",
  "Data Science", "Web3", "Mobile", "System Design", "GraphQL", "Docker",
];

export const BUILDER_DNA_OPTIONS: BuilderDnaTag[] = [
  { label: "Night Owl", emoji: "🌙" },
  { label: "Startup Addict", emoji: "🚀" },
  { label: "Competitive", emoji: "🏆" },
  { label: "Fast Shipper", emoji: "⚡" },
  { label: "Chill Builder", emoji: "☕" },
  { label: "Meme Debugger", emoji: "💀" },
  { label: "Open Source Lover", emoji: "❤️" },
  { label: "Design Obsessed", emoji: "🎨" },
  { label: "AI Enthusiast", emoji: "🤖" },
  { label: "Full Stack Wizard", emoji: "🧙" },
  { label: "Hackathon Veteran", emoji: "🎖️" },
  { label: "Indie Hacker", emoji: "💡" },
  { label: "Data Nerd", emoji: "📊" },
  { label: "System Thinker", emoji: "🧠" },
  { label: "Creative Coder", emoji: "✨" },
  { label: "Team Player", emoji: "🤝" },
  { label: "Solo Warrior", emoji: "⚔️" },
  { label: "Documentation Lover", emoji: "📝" },
  { label: "Coffee Powered", emoji: "☕" },
  { label: "Bug Whisperer", emoji: "🐛" },
];

export const FUN_PROMPT_QUESTIONS = [
  "My toxic debugging trait is…",
  "I work best when…",
  "My ideal hackathon vibe…",
  "The weirdest thing I built…",
  "My go-to stack for a weekend project…",
  "I'm irrationally passionate about…",
  "My most controversial tech opinion…",
  "The project I'm most proud of…",
];

export const PROJECT_TYPES: ProjectType[] = [
  "Hackathon", "Startup", "Side Project", "Open Source",
  "Freelance", "Research", "Learning",
];

export const AVAILABILITY_OPTIONS = [
  "Full-time", "Part-time", "Weekends", "Hackathons Only", "Open",
] as const;

export const NAV_LINKS = [
  { href: "/discover", label: "Discover", icon: "compass" },
  { href: "/pings", label: "Pings", icon: "zap" },
  { href: "/teams", label: "Teams", icon: "users" },
  { href: "/profile", label: "Profile", icon: "user" },
] as const;

export const FEATURES = [
  {
    title: "AI-Powered Matching",
    description: "Our AI analyzes personality, work style, and ambition to find your ideal collaborators.",
    icon: "brain",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Builder DNA Profiles",
    description: "Go beyond skills. Express your builder personality with DNA tags and fun prompts.",
    icon: "dna",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Swipe to Connect",
    description: "Discover builders through an intuitive swipe interface with real-time compatibility scores.",
    icon: "heart",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Smart Icebreakers",
    description: "AI generates personalized intro messages based on shared interests and complementary skills.",
    icon: "sparkles",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Team Workspaces",
    description: "Once matched, collaborate in beautiful workspaces with chat, tasks, and AI project ideas.",
    icon: "layout",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Compatibility Engine",
    description: "Deep analysis of collaboration potential with strengths, challenges, and role suggestions.",
    icon: "chart",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Set up your builder profile with skills, DNA tags, and personality prompts.",
  },
  {
    step: 2,
    title: "Discover Builders",
    description: "Swipe through AI-curated profiles matched to your style and goals.",
  },
  {
    step: 3,
    title: "Send a Ping",
    description: "Reach out with AI-crafted icebreakers. No awkward intros needed.",
  },
  {
    step: 4,
    title: "Build Together",
    description: "Form teams, plan projects, and ship amazing things together.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Aria Chen",
    role: "Full Stack Developer",
    avatar: "aria-chen",
    quote: "Found my hackathon dream team in 10 minutes. We won first place!",
    company: "Stanford CS",
  },
  {
    name: "Marcus Rivera",
    role: "UI/UX Designer",
    avatar: "marcus-rivera",
    quote: "Finally a platform that understands builder chemistry isn't just about tech stacks.",
    company: "Ex-Figma",
  },
  {
    name: "Priya Sharma",
    role: "AI/ML Engineer",
    avatar: "priya-sharma",
    quote: "The AI compatibility analysis is scary accurate. My co-founder match was perfect.",
    company: "MIT AI Lab",
  },
];
