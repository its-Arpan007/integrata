"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { GlowButton } from "@/components/shared/glow-button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { useAuth } from "@/providers/auth-provider";



function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithOAuth, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null);

  // Show error from OAuth callback failure
  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError === "auth_failed") {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/discover");
    }
  }, [isAuthenticated, router]);

  const handleEmailLogin = async () => {
    setError("");
    setLoading(true);

    const result = await login(email);

    if (result.success) {
      router.push("/onboarding");
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: "google") => {
    setError("");
    setOauthLoading(provider);

    const result = await loginWithOAuth(provider);

    if (result.redirecting) {
      // Supabase is handling the redirect to GitHub/Google — don't navigate
      return;
    }

    if (result.success) {
      router.push("/onboarding");
    } else {
      setError(result.error || "OAuth login failed");
    }
    setOauthLoading(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email) {
      handleEmailLogin();
    }
  };

  // Loading or already authenticated
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient-bg">
        <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 animated-gradient-bg">
      <FloatingElements count={4} />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="glass-static rounded-3xl p-8 sm:p-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Buildr</h1>
            <p className="text-sm text-text-secondary">
              Sign in to find your perfect builder team
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OAuth buttons */}
          <div className="space-y-3">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <GlowButton
                variant="secondary"
                fullWidth
                size="lg"
                disabled={!!oauthLoading}
                icon={oauthLoading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
                onClick={() => handleOAuth("google")}
              >
                Continue with Google
              </GlowButton>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-glass-border" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-glass-border" />
          </div>

          {/* Email form */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <label className="block text-sm text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-all"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <GlowButton
                fullWidth
                size="lg"
                disabled={loading || !email}
                icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
                onClick={handleEmailLogin}
              >
                {loading ? "Signing in..." : "Continue with Email"}
              </GlowButton>
            </motion.div>
          </div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-text-muted text-center mt-6 leading-relaxed"
          >
            By continuing, you agree to Buildr&apos;s Terms of Service and Privacy Policy.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center animated-gradient-bg">
        <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
