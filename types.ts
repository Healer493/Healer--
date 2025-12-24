
export interface PlatformMetric {
  platform: string;
  mentionCount: number;
  sentimentScore: number;
  hotTopic: string;
}

export interface CompetitorProfile {
  name: string;
  positioning: string;
  targetAudience: string;
  metrics: PlatformMetric[];
  strengths: string[];
  weaknesses: string[];
}

export interface AnalysisReport {
  executiveSummary: string;
  marketLandscape: {
    marketSize: string;
    trends: string[];
    competitiveLandscape: string;
  };
  competitors: CompetitorProfile[];
  strategicComparison: {
    dimension: string;
    values: { brand: string; score: number }[];
  }[];
  marketingInsights: string;
  actionPlan: {
    phase: string;
    steps: string[];
  }[];
  sources: { title: string; uri: string }[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
