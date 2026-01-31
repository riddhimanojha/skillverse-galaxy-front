export interface Finding {
  id: string;
  category: 'Authentication' | 'Database' | 'API Security';
  is_vulnerable: boolean;
  remediation_code: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
}

export type FindingCategory = 'Authentication' | 'Database' | 'API Security';
