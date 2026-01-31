-- Create findings table for Orion Security Constellation
CREATE TABLE public.findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  is_vulnerable BOOLEAN NOT NULL DEFAULT false,
  remediation_code TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view findings"
ON public.findings FOR SELECT USING (true);

-- Allow public insert (for CLI/scanner)
CREATE POLICY "Anyone can insert findings"
ON public.findings FOR INSERT WITH CHECK (true);

-- Allow public update (for Apply Fix)
CREATE POLICY "Anyone can update findings"
ON public.findings FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.findings;

-- Insert the 3 core categories
INSERT INTO public.findings (category, is_vulnerable, remediation_code, severity) VALUES
('Authentication', false, E'// ❌ Vulnerable\nconst token = localStorage.getItem("token");\n\n// ✅ Fixed\nconst { data: { session } } = await supabase.auth.getSession();', 'critical'),
('Database', false, E'// ❌ Vulnerable\nconst query = `SELECT * FROM users WHERE id = ${userId}`;\n\n// ✅ Fixed\nconst { data } = await supabase\n  .from("users")\n  .select("*")\n  .eq("id", userId);', 'critical'),
('API Security', false, E'// ❌ Vulnerable\nconst apiKey = "sk_live_abc123";\n\n// ✅ Fixed\nconst apiKey = Deno.env.get("API_KEY");', 'high');