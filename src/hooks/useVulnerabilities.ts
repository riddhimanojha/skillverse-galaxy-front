import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Vulnerability } from "@/types/vulnerability";
import { toast } from "sonner";

export const useVulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial vulnerabilities
  useEffect(() => {
    const fetchVulnerabilities = async () => {
      const { data, error } = await supabase
        .from('vulnerabilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vulnerabilities:', error);
        toast.error('Failed to load threat data');
      } else {
        setVulnerabilities(data as Vulnerability[]);
      }
      setLoading(false);
    };

    fetchVulnerabilities();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('vulnerabilities-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vulnerabilities'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newVuln = payload.new as Vulnerability;
            setVulnerabilities(prev => [newVuln, ...prev]);
            toast.error(`🚨 New threat detected in ${newVuln.file_path}`, {
              description: newVuln.category,
              duration: 5000,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Vulnerability;
            setVulnerabilities(prev => 
              prev.map(v => v.id === updated.id ? updated : v)
            );
            if (updated.status === 'fixed') {
              toast.success(`✅ Threat patched: ${updated.file_path}`, {
                description: 'Security restored',
                duration: 3000,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setVulnerabilities(prev => prev.filter(v => v.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Patch a vulnerability
  const patchVulnerability = async (id: string) => {
    const { error } = await supabase
      .from('vulnerabilities')
      .update({ status: 'fixed' })
      .eq('id', id);

    if (error) {
      console.error('Error patching vulnerability:', error);
      toast.error('Failed to patch vulnerability');
      return false;
    }
    return true;
  };

  // Get vulnerabilities by category
  const getByCategory = (category: string) => {
    return vulnerabilities.filter(v => v.category === category);
  };

  // Get active (unfixed) vulnerabilities
  const getActiveVulnerabilities = () => {
    return vulnerabilities.filter(v => v.status === 'vulnerable');
  };

  // Check if a file path has vulnerabilities
  const hasVulnerability = (filePath: string) => {
    return vulnerabilities.some(
      v => v.file_path === filePath && v.status === 'vulnerable'
    );
  };

  // Get vulnerability for a specific file
  const getVulnerabilityByFile = (filePath: string) => {
    return vulnerabilities.find(
      v => v.file_path === filePath && v.status === 'vulnerable'
    );
  };

  return {
    vulnerabilities,
    loading,
    patchVulnerability,
    getByCategory,
    getActiveVulnerabilities,
    hasVulnerability,
    getVulnerabilityByFile,
  };
};
