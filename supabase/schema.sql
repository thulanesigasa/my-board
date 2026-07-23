-- Supabase PostgreSQL Database Schema for my-board

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#6366F1',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Board',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Shapes Table (Persisted whiteboard elements)
CREATE TABLE IF NOT EXISTS public.shapes (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  properties JSONB NOT NULL,
  z_index INTEGER DEFAULT 0 NOT NULL,
  created_by TEXT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- 4. Room Snapshots Table (Rapid hydration backup)
CREATE TABLE IF NOT EXISTS public.room_snapshots (
  room_id TEXT PRIMARY KEY REFERENCES public.rooms(id) ON DELETE CASCADE,
  shapes_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_snapshots ENABLE ROW LEVEL SECURITY;

-- Public policies for shared board rooms
CREATE POLICY "Public rooms access" ON public.rooms FOR ALL USING (true);
CREATE POLICY "Public shapes access" ON public.shapes FOR ALL USING (true);
CREATE POLICY "Public snapshots access" ON public.room_snapshots FOR ALL USING (true);
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true);
