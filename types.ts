export type ThemeColor = 'blue' | 'pink' | 'green' | 'orange' | 'purple' | 'teal' | 'indigo' | 'red';

export type Shape = 'flower' | 'circle' | 'heart';

export interface HistoryLog {
  [dateKey: string]: number;
}
