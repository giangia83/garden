export type ThemeColor = 'blue' | 'green' | 'red' | 'yellow';

export interface HistoryLog {
  [date: string]: number; // date in 'YYYY-MM-DD' format mapped to hours worked
}

export type Shape = 'flower' | 'circle' | 'heart';