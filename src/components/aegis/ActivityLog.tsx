import { SecurityNode } from "@/types/securityNode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, AlertTriangle } from "lucide-react";

interface ActivityLogProps {
  nodes: SecurityNode[];
}

export const ActivityLog = ({ nodes }: ActivityLogProps) => {
  // Sort nodes by created_at descending for recent activity
  const sortedNodes = [...nodes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateFix = (fix: string, maxLength: number = 50) => {
    if (fix.length <= maxLength) return fix;
    return fix.substring(0, maxLength) + '...';
  };

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {sortedNodes.map((node) => (
            <div
              key={node.id}
              className={`p-3 rounded-lg border transition-all ${
                node.is_vulnerable
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                  : 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {node.is_vulnerable ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : (
                    <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{node.category_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(node.created_at)}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    node.is_vulnerable
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}
                >
                  {node.is_vulnerable ? 'OPEN' : 'FIXED'}
                </span>
              </div>
              
              {/* Occam Fix Preview */}
              <div className="mt-2 p-2 bg-background/50 rounded text-xs font-mono text-muted-foreground truncate">
                {truncateFix(node.occam_fix)}
              </div>
            </div>
          ))}
          
          {nodes.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No activity recorded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
