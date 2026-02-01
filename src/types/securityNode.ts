export interface SecurityNode {
  id: string;
  category_name: string;
  is_vulnerable: boolean;
  severity: 'Critical' | 'High' | 'Medium';
  occam_fix: string;
  fix_code: string | null;
  file_name: string | null;
  file_content: string | null;
  line_no: number | null;
  created_at: string;
}
