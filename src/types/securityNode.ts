export interface SecurityNode {
  id: string;
  category_name: string;
  is_vulnerable: boolean;
  severity: 'Critical' | 'High' | 'Medium';
  occam_fix: string;
  created_at: string;
}
