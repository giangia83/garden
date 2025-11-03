// FIX: Define ThemeColor here to break circular dependency with constants.ts
export type ThemeColor = 'blue' | 'pink' | 'green' | 'orange' | 'purple' | 'teal' | 'indigo' | 'red';

export type ThemeMode = 'light' | 'dark' | 'black';

export type Shape = 'flower' | 'circle' | 'heart';

export type DayStatus = 'sick';
export type WeatherCondition = 'sunny' | 'cloudy' | 'bad';

export type DayEntry = {
  hours: number;
  ldcHours?: number;
  status?: DayStatus;
  weather?: WeatherCondition;
  isSummary?: boolean;
  isCampaign?: boolean;
};

export type HistoryLog = {
  [dateKey: string]: DayEntry;
};

export type DayLog = {
  date: string;
  hours: number;
};

export type ActivityType = 'visit' | 'study';

export type ActivityItem = {
  id: string;
  type: ActivityType;
  name: string;
  location?: string;
  comments?: string;
  date: string; // ISO string
  lat?: number;
  lng?: number;
  recurring?: boolean;
};

export type GroupArrangement = {
  groupNumber?: string;
  conductor?: string;
  time?: string;
  location?: string;
  territory?: string;
};

export type SetupData = {
  name: string;
  previousHours: { [dateKey: string]: number };
};

export type TutorialStep = {
  target: string; // CSS Selector
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlightPadding?: number;
};

export type TutorialsSeen = {
  [key in 'tracker' | 'activity' | 'history']?: boolean;
};

export type AppState = {
  currentHours: number;
  currentLdcHours: number;
  userName: string;
  goal: number;
  currentDate: string; // ISO string
  progressShape: Shape;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  archives: Record<string, HistoryLog>;
  currentServiceYear: string;
  activities: ActivityItem[];
  groupArrangements: GroupArrangement[];
  streak: number;
  lastLogDate: string | null; // ISO string
  streakRestores: number;
  lastRestoreMonth: number;
  protectedDay: number | null;
};
