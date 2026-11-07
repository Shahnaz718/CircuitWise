export const lightColors = {
  bg: '#EDF0F4', 
  card: '#FFFFFF', 
  ink: '#0F1B2D', 
  sub: '#586578', 
  line: '#D5DBE4',
  brand: '#0F1B2D', 
  onBrand: '#FFFFFF', 
  accent: '#FFC93C', 
  onAccent: '#0F1B2D',
  tabActive: '#0F1B2D', 
  chip: '#E3E8EF', 
  chipActive: '#0F1B2D', 
  onChipActive: '#FFFFFF',
  low: '#1B8A57', 
  lowBg: '#E1F3EA', 
  med: '#A86A00', 
  medBg: '#FFF0D0', 
  high: '#CF3128', 
  highBg: '#FBE3E1'

};

export const darkColors = {
  bg: '#0B121C', 
  card: '#152131', 
  ink: '#EEF2F7', 
  sub: '#9AA8BA', 
  line: '#27364A',
  brand: '#060B12', 
  onBrand: '#FFFFFF', 
  accent: '#FFC93C', 
  onAccent: '#0F1B2D',
  tabActive: '#FFC93C', 
  chip: '#1E2C40', 
  chipActive: '#FFC93C', 
  onChipActive: '#0F1B2D',
  low: '#4CCB8C', 
  lowBg: '#16372B', 
  med: '#F2B544', 
  medBg: '#3A2D12', 
  high: '#FF6B61', 
  highBg: '#3F1B1A',
  
};

export const CATEGORIES = [
  { name: 'Lighting', icon: 'bulb-outline', hint: 'Bulbs, switches, flicker' },
  { name: 'Outlets', icon: 'power-outline', hint: 'Sockets, plugs, cords' },
  { name: 'Breakers', icon: 'toggle-outline', hint: 'MCB, ELCB, outages' },
  { name: 'Appliances', icon: 'tv-outline', hint: 'Fridge, fan, AC, heater' },
  { name: 'Wiring', icon: 'git-branch-outline', hint: 'Cables, smells, voltage' },
];

export const categoryIcon = (name) => (CATEGORIES.find((c) => c.name === name) || {}).icon || 'flash-outline';

export function riskTone(colors, risk) {
  if (risk === 'High') return { fg: colors.high, bg: colors.highBg };
  if (risk === 'Medium') return { fg: colors.med, bg: colors.medBg };
  return { fg: colors.low, bg: colors.lowBg };
}

export const STATUS_LABEL = {
  viewed: 'Viewed',
  fixed: 'Marked as fixed',
  not_fixed: 'Not fixed',
  stopped: 'Stopped, needs electrician',
};
