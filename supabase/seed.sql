-- ============================================================
-- BUILDR — Seed Data
-- Run this in Supabase SQL Editor AFTER running schema.sql
-- ============================================================
-- This script creates demo auth users first, then populates
-- all related tables with sample data.
-- ============================================================

-- ==========================================
-- 1. CREATE AUTH USERS (required for profiles FK)
-- ==========================================
-- Supabase profiles.id references auth.users(id),
-- so we must insert auth users first.

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'alex@buildr.dev',
  crypt('demo_password_123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Alex Rivera", "user_name": "alexcodes", "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=alex-rivera"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'maya@buildr.dev',
  crypt('demo_password_123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Maya Chen", "user_name": "mayadesigns", "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=maya-chen"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'kai@buildr.dev',
  crypt('demo_password_123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Kai Nakamura", "user_name": "kai_ml", "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=kai-nakamura"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'sam@buildr.dev',
  crypt('demo_password_123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Sam Okafor", "user_name": "rustacean_dev", "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=sam-okafor"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'priya@buildr.dev',
  crypt('demo_password_123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Priya Sharma", "user_name": "priya_ui", "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=priya-sharma"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'jordan@buildr.dev',
  crypt('demo_password_123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Jordan Lee", "user_name": "jordanbuilds", "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=jordan-lee"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Also create identities for each auth user (required by Supabase)
insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) values
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '{"sub": "11111111-1111-1111-1111-111111111111", "email": "alex@buildr.dev"}', 'email', '11111111-1111-1111-1111-111111111111', now(), now(), now()),
('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '{"sub": "22222222-2222-2222-2222-222222222222", "email": "maya@buildr.dev"}', 'email', '22222222-2222-2222-2222-222222222222', now(), now(), now()),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '{"sub": "33333333-3333-3333-3333-333333333333", "email": "kai@buildr.dev"}', 'email', '33333333-3333-3333-3333-333333333333', now(), now(), now()),
('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '{"sub": "44444444-4444-4444-4444-444444444444", "email": "sam@buildr.dev"}', 'email', '44444444-4444-4444-4444-444444444444', now(), now(), now()),
('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '{"sub": "55555555-5555-5555-5555-555555555555", "email": "priya@buildr.dev"}', 'email', '55555555-5555-5555-5555-555555555555', now(), now(), now()),
('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '{"sub": "66666666-6666-6666-6666-666666666666", "email": "jordan@buildr.dev"}', 'email', '66666666-6666-6666-6666-666666666666', now(), now(), now());


-- ==========================================
-- 2. PROFILES (the trigger auto-creates these, but
--    we delete and re-insert with full data)
-- ==========================================
-- The handle_new_user trigger already inserted bare profiles.
-- Now update them with complete data.

update public.profiles set
  name = 'Alex Rivera',
  bio = 'Full-stack dev obsessed with building delightful products. Currently exploring AI agents and creative coding. Always shipping, never sleeping.',
  company = 'Ex-Vercel',
  location = 'San Francisco, CA',
  github = 'alexcodes',
  skills = ARRAY['React', 'Next.js', 'TypeScript', 'AI/ML', 'System Design'],
  builder_dna = '[{"label": "Fast Shipper", "emoji": "⚡"}, {"label": "Night Owl", "emoji": "🌙"}, {"label": "Startup Addict", "emoji": "🚀"}]'::jsonb,
  fun_prompts = '[{"question": "Tabs or spaces?", "answer": "Tabs. Fight me."}, {"question": "What''s your superpower?", "answer": "Turning caffeine into production-ready code at 3am"}, {"question": "Worst debugging story?", "answer": "Spent 6 hours on a bug that turned out to be a CSS z-index issue"}]'::jsonb,
  ai_summary = 'Creative rapid prototyper who thrives in high-energy, fast-paced environments. Combines strong full-stack skills with AI curiosity.',
  availability = 'Open',
  interests = ARRAY['Hackathon', 'Startup', 'Side Project'],
  online = true
where id = '11111111-1111-1111-1111-111111111111';

update public.profiles set
  name = 'Maya Chen',
  bio = 'Design engineer who codes. Obsessed with micro-interactions, design systems, and making pixels perfect.',
  company = 'Ex-Stripe',
  location = 'New York, NY',
  github = 'mayadesigns',
  skills = ARRAY['UI/UX', 'Figma', 'React', 'TypeScript', 'Mobile'],
  builder_dna = '[{"label": "Pixel Perfectionist", "emoji": "🎨"}, {"label": "Design Systems Nerd", "emoji": "📐"}, {"label": "Open Source", "emoji": "🌍"}]'::jsonb,
  fun_prompts = '[{"question": "Tabs or spaces?", "answer": "Spaces. 2 spaces."}, {"question": "Dream collab?", "answer": "Building the next-gen design tool that makes Figma look like MS Paint"}]'::jsonb,
  ai_summary = 'Meticulous design engineer who bridges design and development seamlessly. Expert at creating systems that scale.',
  availability = 'Part-time',
  interests = ARRAY['Startup', 'Open Source', 'Side Project'],
  online = true
where id = '22222222-2222-2222-2222-222222222222';

update public.profiles set
  name = 'Kai Nakamura',
  bio = 'ML researcher turned builder. Shipping AI products that actually solve problems. Ex-DeepMind intern.',
  company = 'Stanford AI Lab',
  location = 'Palo Alto, CA',
  github = 'kaiml',
  skills = ARRAY['Python', 'AI/ML', 'Data Science', 'Backend', 'Cloud'],
  builder_dna = '[{"label": "Research Nerd", "emoji": "🔬"}, {"label": "Night Owl", "emoji": "🌙"}, {"label": "Mentor", "emoji": "🎓"}]'::jsonb,
  fun_prompts = '[{"question": "What''s your superpower?", "answer": "Making complex ML concepts simple enough for a product demo"}, {"question": "Dream collab?", "answer": "An AI tool that writes itself"}]'::jsonb,
  ai_summary = 'Brilliant ML researcher with a product mindset. Equally comfortable writing papers and shipping features.',
  availability = 'Weekends',
  interests = ARRAY['Research', 'Startup', 'Hackathon'],
  online = false
where id = '33333333-3333-3333-3333-333333333333';

update public.profiles set
  name = 'Sam Okafor',
  bio = 'Systems programmer and performance enthusiast. If it''s not fast, it''s broken. Currently building open-source infra tools in Rust.',
  company = 'CloudFlare',
  location = 'Austin, TX',
  github = 'rustaceansam',
  skills = ARRAY['Rust', 'Go', 'Backend', 'System Design', 'DevOps', 'Docker'],
  builder_dna = '[{"label": "Competitive", "emoji": "🏆"}, {"label": "Full Stack Wizard", "emoji": "🧙"}, {"label": "Documentation Lover", "emoji": "📝"}]'::jsonb,
  fun_prompts = '[{"question": "Tabs or spaces?", "answer": "4 spaces. Rust fmt enforces it anyway."}, {"question": "What''s your superpower?", "answer": "Finding the O(n) solution while everyone else is stuck at O(n²)"}]'::jsonb,
  ai_summary = 'Performance-driven systems engineer who brings rigorous engineering discipline to every project.',
  availability = 'Hackathons Only',
  interests = ARRAY['Open Source', 'Hackathon', 'Side Project'],
  online = false
where id = '44444444-4444-4444-4444-444444444444';

update public.profiles set
  name = 'Priya Sharma',
  bio = 'Mobile-first product designer. Building inclusive experiences. Formerly at Razorpay.',
  company = 'Freelance',
  location = 'Bangalore, India',
  github = 'priyaui',
  skills = ARRAY['UI/UX', 'Figma', 'Flutter', 'Mobile', 'React'],
  builder_dna = '[{"label": "User Advocate", "emoji": "💡"}, {"label": "Pixel Perfectionist", "emoji": "🎨"}, {"label": "Early Bird", "emoji": "🌅"}]'::jsonb,
  fun_prompts = '[{"question": "Dream collab?", "answer": "A health-tech app that actually helps people, not just looks pretty"}, {"question": "What''s your superpower?", "answer": "Turning user pain points into delightful micro-interactions"}]'::jsonb,
  ai_summary = 'Empathetic product designer with strong mobile expertise. Champions accessibility and inclusive design.',
  availability = 'Full-time',
  interests = ARRAY['Startup', 'Freelance', 'Side Project'],
  online = true
where id = '55555555-5555-5555-5555-555555555555';

update public.profiles set
  name = 'Jordan Lee',
  bio = 'Full-stack builder and startup junkie. 3 failed startups and counting. Currently working on dev tools.',
  company = 'Indie Hacker',
  location = 'Toronto, CA',
  github = 'jordanbuilds',
  skills = ARRAY['Next.js', 'TypeScript', 'Node.js', 'Databases', 'Cloud', 'GraphQL'],
  builder_dna = '[{"label": "Startup Addict", "emoji": "🚀"}, {"label": "Fast Shipper", "emoji": "⚡"}, {"label": "Solo Builder", "emoji": "🏗️"}]'::jsonb,
  fun_prompts = '[{"question": "Worst debugging story?", "answer": "Deployed to prod on a Friday. Database migration deleted all user data. Never again."}, {"question": "What''s your superpower?", "answer": "Going from idea to MVP in 48 hours"}]'::jsonb,
  ai_summary = 'Serial builder with deep full-stack skills. Thrives in early-stage chaos and loves shipping fast.',
  availability = 'Open',
  interests = ARRAY['Startup', 'Hackathon', 'Side Project', 'Learning'],
  online = true
where id = '66666666-6666-6666-6666-666666666666';


-- ==========================================
-- 3. TEAMS
-- ==========================================
insert into public.teams (id, name, description, project, status, created_by) values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'AI Builders',
  'Working on next-gen AI collaboration tools',
  'BuildrAI',
  'active',
  '11111111-1111-1111-1111-111111111111'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Mobile Squad',
  'Building a cross-platform health & wellness app',
  'WellnessOS',
  'planning',
  '55555555-5555-5555-5555-555555555555'
);


-- ==========================================
-- 4. TEAM MEMBERS
-- ==========================================
-- Team: AI Builders
insert into public.team_members (team_id, user_id, role) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Owner'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Designer'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'ML Engineer'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'Backend Dev');

-- Team: Mobile Squad
insert into public.team_members (team_id, user_id, role) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Owner'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'UI Designer'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Backend Dev');


-- ==========================================
-- 5. TASKS
-- ==========================================
-- AI Builders team tasks
insert into public.tasks (team_id, title, description, status, priority, assignee_id, created_by) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Design onboarding flow', 'Create high-fidelity mockups for the multi-step onboarding', 'done', 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Build compatibility API', 'Integrate Gemini for AI-powered compatibility scoring', 'in-progress', 'urgent', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Set up CI/CD pipeline', 'Configure GitHub Actions for auto-deploy to Vercel', 'todo', 'medium', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Implement swipe gestures', 'Add Framer Motion drag gestures for card swiping', 'done', 'high', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Add realtime chat', 'Wire up Supabase Realtime for team messaging', 'in-progress', 'medium', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111');

-- Mobile Squad team tasks
insert into public.tasks (team_id, title, description, status, priority, assignee_id, created_by) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Design app wireframes', 'Create low-fi wireframes for the 5 core screens', 'in-progress', 'high', '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Set up Flutter project', 'Initialize Flutter project with proper architecture', 'todo', 'medium', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Research health APIs', 'Evaluate Apple HealthKit vs Google Fit integration', 'todo', 'low', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555');


-- ==========================================
-- 6. MESSAGES
-- ==========================================
-- AI Builders team chat
insert into public.messages (team_id, user_id, content, type) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Hey team! Let''s ship v1 this week 🚀', 'text'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Just pushed the new card designs, check them out!', 'text'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'The compatibility model is hitting 89% accuracy on test data 🔥', 'text'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null, 'AI Suggestion: Consider adding a "builder chemistry" dimension to your compatibility scoring.', 'ai-suggestion'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'Realtime chat is almost done, just need to handle edge cases for reconnection.', 'text'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Amazing progress everyone! Let''s sync tomorrow at 10am PST.', 'text');

-- Mobile Squad team chat
insert into public.messages (team_id, user_id, content, type) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Welcome to Mobile Squad! Let''s build something amazing 🎉', 'text'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Excited to work on the backend. Should we use Rust or Go for the API?', 'text'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'I''ve started on some initial design concepts, will share Figma link soon!', 'text');


-- ==========================================
-- 7. PINGS (collaboration requests)
-- ==========================================
insert into public.pings (from_user_id, to_user_id, message, ai_suggested, status) values
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Hey Alex! I love your work on AI agents. Want to team up for the upcoming AI hackathon?', true, 'accepted'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Your Next.js + AI combo is exactly what my research project needs. Let''s chat!', true, 'pending'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Maya, your design systems work at Stripe was incredible. I''d love your help on our mobile app!', false, 'pending'),
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Sam, would love to learn about your Rust infra work. Got a project that could use your expertise!', true, 'pending'),
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Kai, I''m building a dev tool with an ML component. Your background would be perfect!', false, 'pending');


-- ==========================================
-- 8. COMPATIBILITY CACHE (pre-computed)
-- ==========================================
insert into public.compatibility_cache (user1_id, user2_id, overall_score, dimensions, strengths, challenges, suggested_roles, ai_insight) values
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  92,
  '[{"name": "Technical Synergy", "score": 95, "icon": "⚡", "description": "Perfect full-stack + design combo"}, {"name": "Work Style", "score": 88, "icon": "🎯", "description": "Both are fast shippers"}, {"name": "Vision Alignment", "score": 93, "icon": "🔮", "description": "Startup-minded builders"}]'::jsonb,
  '["Complementary skills (dev + design)", "Both are fast shippers", "Shared startup ambitions"]'::jsonb,
  '["Different time zones could slow async work", "Both tend to overcommit"]'::jsonb,
  '[{"user": "Alex", "role": "Tech Lead", "reason": "Strong full-stack architecture skills"}, {"user": "Maya", "role": "Design Lead", "reason": "Expert in design systems and UX"}]'::jsonb,
  'Alex and Maya are a powerhouse duo — the classic engineer + designer pairing that makes startups succeed. Their shared fast-shipping mentality means they''ll prototype rapidly, while Maya''s design rigor ensures quality doesn''t suffer.'
),
(
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  87,
  '[{"name": "Technical Synergy", "score": 90, "icon": "⚡", "description": "Full-stack + ML is a killer combo"}, {"name": "Work Style", "score": 78, "icon": "🎯", "description": "Alex ships fast, Kai is methodical"}, {"name": "Vision Alignment", "score": 92, "icon": "🔮", "description": "Both excited about AI products"}]'::jsonb,
  '["Shared AI/ML passion", "Alex can productize Kai''s research", "Strong technical depth together"]'::jsonb,
  '["Kai prefers research depth, Alex prefers shipping speed", "May need a designer to round out the team"]'::jsonb,
  '[{"user": "Alex", "role": "Product Engineer", "reason": "Can turn research into shippable features"}, {"user": "Kai", "role": "ML Lead", "reason": "Deep expertise in AI models"}]'::jsonb,
  'Alex and Kai bring the rare combination of product engineering and deep ML research. They could build AI-powered products that are both technically impressive and user-friendly.'
);
