export interface NodeExecutionStats {
  failures: number;
  total: number;
  successes: number;
  pending: number;
}

export interface CoverageMetric {
  title: string;
  description: string;
  percentage: number;
}

export interface WorkflowSummaryMetric {
  tasks: number;
  executions: number;
  completed: number;
}

export interface WorkflowInsightMetric {
  id: string;
  icon: string;
  title: string;
  description: string;
  value: string;
}

export interface WorkflowOverviewCard {
  id: string;
  title: string;
  triggeredBy: string;
  metrics: WorkflowSummaryMetric;
}

export interface WorkflowMetrics {
  coverage: CoverageMetric;
  workflows: WorkflowOverviewCard[];
  insightMetrics: WorkflowInsightMetric[];
  flowObjectives: WorkflowInsightMetric[];
}
