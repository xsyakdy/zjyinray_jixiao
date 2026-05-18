export interface DashboardFilters {
  year: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  scopeNote: string;
}

export type MetricStatus = '达标' | '关注' | '预警';

export interface MetricRecord {
  key: 'contract' | 'collection' | 'outputValue';
  name: string;
  unit: '万元';
  annualTarget: number;
  annualActual: number;
  quarterTarget: number;
  quarterActual: number;
}

export interface RecognitionItem {
  rank: 1 | 2 | 3;
  name: string;
  label: string;
  score: number;
  avatarText: string;
}

export interface RecognitionBoardData {
  marketingBattle: RecognitionItem[];
  brandProjects: RecognitionItem[];
  pioneerList: RecognitionItem[];
}

export type WarningRiskLevel = '高风险' | '中风险' | '低风险';

export type WarningStatus = '待处理' | '处理中' | '待确认' | '已处理';

export interface WarningItem {
  id: string;
  title: string;
  projectName: string;
  issueDesc: string;
  owner: string;
  riskLevel: WarningRiskLevel;
  status: WarningStatus;
  todo: string;
}

export interface EditHistoryRecord {
  id: string;
  metricName: string;
  fieldName: string;
  oldValue: number;
  newValue: number;
  editedAt: string;
}

export interface DashboardData {
  filters: DashboardFilters;
  metrics: MetricRecord[];
  recognition: RecognitionBoardData;
  warnings: WarningItem[];
}
