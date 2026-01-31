-- Create security_nodes table for Aegis Nebula
CREATE TABLE public.security_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL,
  is_vulnerable BOOLEAN NOT NULL DEFAULT false,
  severity TEXT NOT NULL DEFAULT 'Medium',
  occam_fix TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.security_nodes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view security_nodes"
ON public.security_nodes FOR SELECT USING (true);

-- Allow public insert (for CLI/scanner)
CREATE POLICY "Anyone can insert security_nodes"
ON public.security_nodes FOR INSERT WITH CHECK (true);

-- Allow public update (for Deploy Patch)
CREATE POLICY "Anyone can update security_nodes"
ON public.security_nodes FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_nodes;

-- Insert initial security categories as nodes
INSERT INTO public.security_nodes (category_name, is_vulnerable, severity, occam_fix) VALUES
('Authentication', false, 'Critical', E'// ❌ Vulnerable\nconst token = localStorage.getItem("token");\n\n// ✅ Secure\nconst { data: { session } } = await supabase.auth.getSession();'),
('SQL Injection', false, 'Critical', E'// ❌ Vulnerable\nconst query = `SELECT * FROM users WHERE id = ${userId}`;\n\n// ✅ Secure\nconst { data } = await supabase.from("users").select("*").eq("id", userId);'),
('API Keys', false, 'High', E'// ❌ Vulnerable\nconst apiKey = "sk_live_abc123";\n\n// ✅ Secure\nconst apiKey = Deno.env.get("API_KEY");'),
('XSS Prevention', false, 'High', E'// ❌ Vulnerable\ndiv.innerHTML = userInput;\n\n// ✅ Secure\ndiv.textContent = userInput;'),
('CORS Policy', false, 'Medium', E'// ❌ Vulnerable\nAccess-Control-Allow-Origin: *\n\n// ✅ Secure\nAccess-Control-Allow-Origin: https://yourdomain.com'),
('Rate Limiting', false, 'Medium', E'// ❌ Vulnerable\n// No rate limiting\n\n// ✅ Secure\nconst rateLimit = new RateLimiter({ requests: 100, period: "1m" });');