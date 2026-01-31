-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create vulnerabilities table for Hacktron Security Threat Map
CREATE TABLE public.vulnerabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  fix_code TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'vulnerable',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;

-- Allow public read access (vulnerabilities are meant to be visible)
CREATE POLICY "Anyone can view vulnerabilities"
ON public.vulnerabilities
FOR SELECT
USING (true);

-- Allow public insert (for CLI tool to insert)
CREATE POLICY "Anyone can insert vulnerabilities"
ON public.vulnerabilities
FOR INSERT
WITH CHECK (true);

-- Allow public update (for patching)
CREATE POLICY "Anyone can update vulnerabilities"
ON public.vulnerabilities
FOR UPDATE
USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.vulnerabilities;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vulnerabilities_updated_at
BEFORE UPDATE ON public.vulnerabilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();