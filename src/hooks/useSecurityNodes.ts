import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { toast } from "sonner";

export const useSecurityNodes = () => {
  const [nodes, setNodes] = useState<SecurityNode[]>([]);
  const [relationships, setRelationships] = useState<FileRelationship[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial nodes and relationships
  useEffect(() => {
    const fetchData = async () => {
      const [nodesResult, relationshipsResult] = await Promise.all([
        supabase
          .from('security_nodes')
          .select('*')
          .order('created_at', { ascending: true }),
        supabase
          .from('file_relationships')
          .select('*')
      ]);

      if (nodesResult.error) {
        console.error('Error fetching security nodes:', nodesResult.error);
        toast.error('Failed to load threat data');
      } else {
        setNodes(nodesResult.data as SecurityNode[]);
      }

      if (relationshipsResult.error) {
        console.error('Error fetching file relationships:', relationshipsResult.error);
      } else {
        setRelationships(relationshipsResult.data as FileRelationship[]);
      }

      setLoading(false);
    };

    fetchData();
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

  // Deploy patch - set is_vulnerable to false (marks as resolved, not deleted)
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

  // Check if an open finding exists for the same file and line
  const hasOpenFinding = async (fileName: string, lineNo: number): Promise<boolean> => {
    const { data, error } = await supabase
      .from('security_nodes')
      .select('id')
      .eq('file_name', fileName)
      .eq('line_no', lineNo)
      .eq('is_vulnerable', true)
      .limit(1);

    if (error) {
      console.error('Error checking for open finding:', error);
      return false;
    }
    return (data?.length ?? 0) > 0;
  };

  // Get only open (active) nodes for display
  const getOpenNodes = () => {
    return nodes.filter(n => n.is_vulnerable);
  };

  // Get stats (only counts open vulnerabilities as active threats)
  const getStats = () => {
    const openNodes = nodes.filter(n => n.is_vulnerable);
    const activeThreats = openNodes.length;
    const criticalThreats = openNodes.filter(n => n.severity === 'Critical').length;
    const highThreats = openNodes.filter(n => n.severity === 'High').length;
    const securedNodes = nodes.filter(n => !n.is_vulnerable).length;
    
    return { activeThreats, criticalThreats, highThreats, securedNodes, total: nodes.length };
  };

  return {
    nodes,
    relationships,
    loading,
    deployPatch,
    hasOpenFinding,
    getOpenNodes,
    getStats,
  };
};
