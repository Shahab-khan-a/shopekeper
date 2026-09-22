export interface RunResult {
  changes: number;
  lastInsertRowId?: number;
}

export interface IDatabaseAdapter {
  init(): Promise<void>;
  exec(sql: string): Promise<void>;
  run(sql: string, params?: any[]): Promise<RunResult>;
  get<T = any>(sql: string, params?: any[]): Promise<T | null>;
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(action: (adapter: IDatabaseAdapter) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
