/**
 * Demo accounts for local testing.
 * These are fake credentials — no real auth backend required.
 */
export const DEMO_ACCOUNTS = [
  {
    email: "alex@buildr.dev",
    password: "builder123",
    label: "Alex Rivera",
    emoji: "⚡",
    role: "Full-Stack Dev",
  },
  {
    email: "priya@buildr.dev",
    password: "builder123",
    label: "Priya Patel",
    emoji: "🤖",
    role: "ML Engineer",
  },
  {
    email: "jay@buildr.dev",
    password: "builder123",
    label: "Jay Kim",
    emoji: "🎨",
    role: "Product Designer",
  },
] as const;

export type DemoAccount = (typeof DEMO_ACCOUNTS)[number];

/** Validates email + password against the demo account list. */
export function validateDemoCredentials(email: string, password: string): boolean {
  return DEMO_ACCOUNTS.some(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );
}
