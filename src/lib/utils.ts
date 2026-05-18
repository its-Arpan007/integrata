import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function generateCompatibilityScore(): number {
  return Math.floor(Math.random() * 30) + 70;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=c0aede,d1d4f9,b6e3f4,ffd5dc`;
}

export function getSkillColor(skill: string): string {
  const colors: Record<string, string> = {
    "React": "from-cyan-500 to-blue-500",
    "Next.js": "from-white to-gray-400",
    "TypeScript": "from-blue-500 to-blue-700",
    "Python": "from-yellow-400 to-blue-500",
    "AI/ML": "from-purple-500 to-pink-500",
    "Backend": "from-green-500 to-emerald-600",
    "Node.js": "from-green-400 to-green-600",
    "DevOps": "from-orange-500 to-red-500",
    "UI/UX": "from-pink-400 to-purple-500",
    "Figma": "from-red-400 to-purple-500",
    "Blockchain": "from-yellow-500 to-orange-500",
    "Rust": "from-orange-600 to-red-700",
    "Go": "from-cyan-400 to-blue-600",
    "Flutter": "from-blue-400 to-cyan-400",
    "Swift": "from-orange-500 to-red-500",
    "Databases": "from-blue-600 to-indigo-600",
    "Cloud": "from-sky-400 to-blue-500",
    "Security": "from-red-500 to-rose-600",
    "Data Science": "from-indigo-500 to-purple-600",
    "Web3": "from-violet-500 to-purple-600",
    "Mobile": "from-teal-400 to-cyan-500",
    "System Design": "from-slate-400 to-gray-600",
    "GraphQL": "from-pink-500 to-rose-500",
    "Docker": "from-blue-500 to-cyan-500",
  };
  return colors[skill] || "from-gray-500 to-gray-600";
}
