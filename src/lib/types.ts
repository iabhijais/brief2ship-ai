export type TaskPriority = "Critical" | "High" | "Medium";
export type TaskStatus = "todo" | "doing" | "done";

export interface JudgeLensItem {
  criterion: string;
  whyItMatters: string;
  howToSatisfy: string;
}

export interface CutItem {
  feature: string;
  reason: string;
}

export interface MvpScope {
  mustBuild: string[];
  niceToHave: string[];
  cutList: CutItem[];
}

export interface RecoveryPlans {
  twoHour: string[];
  sixHour: string[];
  twelveHour: string[];
}

export interface Task {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  reason: string;
}

export interface Readiness {
  score: number;
  verdict: string;
  fixFirst: string[];
}

export interface AnalysisResult {
  projectTitle: string;
  problemSummary: string;
  targetUser: string;
  deliverables: string[];
  constraints: string[];
  judgingSignals: string[];
  judgeLens: JudgeLensItem[];
  mvpScope: MvpScope;
  riskScore: number;
  criticalRisks: string[];
  recoveryPlans: RecoveryPlans;
  tasks: Task[];
  submissionChecklist: string[];
  readmeDraft: string;
  demoScript: string;
  pitch: string;
  readiness: Readiness;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
  source: "gemini" | "mock";
}
