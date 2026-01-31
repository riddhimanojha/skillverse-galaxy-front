import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Finding } from "@/types/finding";
import { toast } from "sonner";

export const useFindings = () => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Fetch initial findings
  useEffect(() => {
    const fetchFindings = async () => {
      const { data, error } = await supabase
        .from('findings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching findings:', error);
        setConnectionStatus('error');
        toast.error('Failed to connect to security database');
      } else {
        setFindings(data as Finding[]);
        setConnectionStatus('connected');
      }
      setLoading(false);
    };

    fetchFindings();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('findings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'findings'
        },
        (payload) => {
          console.log('🔄 Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newFinding = payload.new as Finding;
            setFindings(prev => [...prev, newFinding]);
            if (newFinding.is_vulnerable) {
              toast.error(`🚨 New ${newFinding.severity.toUpperCase()} threat: ${newFinding.category}`, {
                duration: 5000,
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Finding;
            setFindings(prev => 
              prev.map(f => f.id === updated.id ? updated : f)
            );
            
            if (updated.is_vulnerable) {
              toast.error(`🚨 ${updated.category} is now VULNERABLE`, {
                description: `Severity: ${updated.severity.toUpperCase()}`,
                duration: 4000,
              });
            } else {
              toast.success(`✅ ${updated.category} secured!`, {
                description: 'Threat remediated successfully',
                duration: 3000,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setFindings(prev => prev.filter(f => f.id !== deleted.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Apply fix - set is_vulnerable to false
  const applyFix = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('findings')
      .update({ is_vulnerable: false })
      .eq('id', id);

    if (error) {
      console.error('Error applying fix:', error);
      toast.error('Failed to apply fix');
      return false;
    }
    return true;
  };

  // Get finding by category
  const getByCategory = (category: string): Finding | undefined => {
    return findings.find(f => f.category === category);
  };

  // Get stats
  const getStats = () => {
    const total = findings.filter(f => f.is_vulnerable).length;
    const critical = findings.filter(f => f.is_vulnerable && f.severity === 'critical').length;
    const lastScan = findings.length > 0 
      ? new Date(Math.max(...findings.map(f => new Date(f.created_at).getTime())))
      : null;
    
    return { total, critical, lastScan };
  };

  return {
    findings,
    loading,
    connectionStatus,
    applyFix,
    getByCategory,
    getStats,
  };
};
