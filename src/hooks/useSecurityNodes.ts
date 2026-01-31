import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SecurityNode } from "@/types/securityNode";
import { toast } from "sonner";

export const useSecurityNodes = () => {
  const [nodes, setNodes] = useState<SecurityNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial nodes
  useEffect(() => {
    const fetchNodes = async () => {
      const { data, error } = await supabase
        .from('security_nodes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching security nodes:', error);
        toast.error('Failed to load threat data');
      } else {
        setNodes(data as SecurityNode[]);
      }
      setLoading(false);
    };

    fetchNodes();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('security-nodes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_nodes'
        },
        (payload) => {
          console.log('🔄 Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNode = payload.new as SecurityNode;
            setNodes(prev => [...prev, newNode]);
            if (newNode.is_vulnerable) {
              toast.error(`🚨 New ${newNode.severity} threat: ${newNode.category_name}`, {
                duration: 5000,
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as SecurityNode;
            setNodes(prev => 
              prev.map(n => n.id === updated.id ? updated : n)
            );
            
            if (updated.is_vulnerable) {
              toast.error(`🚨 ${updated.category_name} is now VULNERABLE`, {
                description: `Severity: ${updated.severity}`,
                duration: 4000,
              });
            } else {
              toast.success(`✅ ${updated.category_name} secured!`, {
                description: 'Patch deployed successfully',
                duration: 3000,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setNodes(prev => prev.filter(n => n.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Deploy patch - set is_vulnerable to false
  const deployPatch = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('security_nodes')
      .update({ is_vulnerable: false })
      .eq('id', id);

    if (error) {
      console.error('Error deploying patch:', error);
      toast.error('Failed to deploy patch');
      return false;
    }
    return true;
  };

  // Get stats
  const getStats = () => {
    const activeThreats = nodes.filter(n => n.is_vulnerable).length;
    const criticalThreats = nodes.filter(n => n.is_vulnerable && n.severity === 'Critical').length;
    const highThreats = nodes.filter(n => n.is_vulnerable && n.severity === 'High').length;
    const securedNodes = nodes.filter(n => !n.is_vulnerable).length;
    
    return { activeThreats, criticalThreats, highThreats, securedNodes, total: nodes.length };
  };

  return {
    nodes,
    loading,
    deployPatch,
    getStats,
  };
};
