
import { ThemeColor } from "./types";

type ThemeConfig = {
  name: ThemeColor;
  gradientFrom: string;
  gradientTo: string;
  gradientFromColor: string;
  gradientToColor: string;
  bg: string;
  text: string;
  ring: string;
  accentText: string;
  accentTextLight: string;
};

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  blue: {
    name: 'blue',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-600',
    gradientFromColor: '#3b82f6',
    gradientToColor: '#8b5cf6',
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    ring: 'focus:ring-blue-500',
    accentText: 'text-blue-100',
    accentTextLight: 'text-blue-200'
  },
  pink: {
    name: 'pink',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-rose-500',
    gradientFromColor: '#ec4899',
    gradientToColor: '#f43f5e',
    bg: 'bg-pink-600',
    text: 'text-pink-600',
    ring: 'focus:ring-pink-500',
    accentText: 'text-pink-100',
    accentTextLight: 'text-pink-200'
  },
  green: {
    name: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-600',
    gradientFromColor: '#22c55e',
    gradientToColor: '#10b981',
    bg: 'bg-green-600',
    text: 'text-green-600',
    ring: 'focus:ring-green-500',
    accentText: 'text-green-100',
    accentTextLight: 'text-green-200'
  },
  orange: {
    name: 'orange',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-amber-600',
    gradientFromColor: '#f97316',
    gradientToColor: '#d97706',
    bg: 'bg-orange-600',
    text: 'text-orange-600',
    ring: 'focus:ring-orange-500',
    accentText: 'text-orange-100',
    accentTextLight: 'text-orange-200'
  },
  purple: {
    name: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-violet-600',
    gradientFromColor: '#a855f7',
    gradientToColor: '#7c3aed',
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    ring: 'focus:ring-purple-500',
    accentText: 'text-purple-100',
    accentTextLight: 'text-purple-200'
  },
  teal: {
    name: 'teal',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-cyan-600',
    gradientFromColor: '#14b8a6',
    gradientToColor: '#0891b2',
    bg: 'bg-teal-600',
    text: 'text-teal-600',
    ring: 'focus:ring-teal-500',
    accentText: 'text-teal-100',
    accentTextLight: 'text-teal-200'
  },
  indigo: {
    name: 'indigo',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-blue-600',
    gradientFromColor: '#6366f1',
    gradientToColor: '#2563eb',
    bg: 'bg-indigo-600',
    text: 'text-indigo-600',
    ring: 'focus:ring-indigo-500',
    accentText: 'text-indigo-100',
    accentTextLight: 'text-indigo-200'
  },
  red: {
    name: 'red',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-500',
    gradientFromColor: '#ef4444',
    gradientToColor: '#f97316',
    bg: 'bg-red-600',
    text: 'text-red-600',
    ring: 'focus:ring-red-500',
    accentText: 'text-red-100',
    accentTextLight: 'text-red-200'
  },
};

export const THEME_LIST = Object.values(THEMES);
