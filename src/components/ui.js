import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { riskTone, categoryIcon, STATUS_LABEL } from '../theme';

export function Screen({ children, edges = ['top'] }) {
  const { colors } = useApp();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.bg }}>
      {children}
    </SafeAreaView>
  );
}

export function TopBar({ title, onBack, right }) {
  const { colors } = useApp();
  return (
    <View style={[s.topBar, { borderBottomColor: colors.line, backgroundColor: colors.card }]}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={s.iconBtn} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.ink} />
        </Pressable>
      ) : null}
      <Text numberOfLines={1} style={[s.topTitle, { color: colors.ink }]}>{title}</Text>
      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function PageTitle({ title, subtitle }) {
  const { colors } = useApp();
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.ink }}>{title}</Text>
      {subtitle ? <Text style={{ fontSize: 14, color: colors.sub, marginTop: 2 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function RiskBadge({ risk }) {
  const { colors } = useApp();
  const t = riskTone(colors, risk);
  return (
    <View style={[s.badge, { backgroundColor: t.bg }]}>
      <View style={[s.dot, { backgroundColor: t.fg }]} />
      <Text style={{ color: t.fg, fontWeight: '700', fontSize: 12 }}>{risk} risk</Text>
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[s.chip, { backgroundColor: active ? colors.chipActive : colors.chip }]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
    >
      <Text style={{ color: active ? colors.onChipActive : colors.ink, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export function Segmented({ options, value, onChange }) {
  const { colors } = useApp();
  return (
    <View style={[s.seg, { backgroundColor: colors.chip }]}>
      {options.map((o) => (
        <Pressable key={o.value} onPress={() => onChange(o.value)} style={[s.segItem, value === o.value && { backgroundColor: colors.card }]}>
          <Text style={{ fontWeight: '700', color: value === o.value ? colors.ink : colors.sub }}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ProblemCard({ item, onPress, footer }) {
  const { colors } = useApp();
  const t = riskTone(colors, item.risk);
  return (
    <Pressable onPress={onPress} style={[s.card, { backgroundColor: colors.card }]} accessibilityRole="button">
      <View style={[s.strip, { backgroundColor: t.fg }]} />
      <View style={{ flex: 1, padding: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: colors.ink }}>{item.title}</Text>
          <RiskBadge risk={item.risk} />
        </View>
        <Text numberOfLines={2} style={{ color: colors.sub, marginTop: 4, fontSize: 14 }}>{item.summary}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 14 }}>
          <Meta icon={categoryIcon(item.category)} text={item.category} />
          <Meta icon="speedometer-outline" text={item.difficulty} />
          <Meta icon="time-outline" text={`${item.minutes} min`} />
        </View>
        {footer ? <Text style={{ color: colors.sub, fontSize: 12, marginTop: 8 }}>{footer}</Text> : null}
      </View>
    </Pressable>
  );
}

function Meta({ icon, text }) {
  const { colors } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name={icon} size={14} color={colors.sub} />
      <Text style={{ color: colors.sub, fontSize: 12 }}>{text}</Text>
    </View>
  );
}

export function SectionTitle({ children, icon }) {
  const { colors } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22, marginBottom: 8 }}>
      {icon ? <Ionicons name={icon} size={18} color={colors.ink} /> : null}
      <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>{children}</Text>
    </View>
  );
}

export function BulletList({ items }) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 6 }}>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={{ color: colors.sub, fontSize: 15 }}>{'\u2022'}</Text>
          <Text style={{ flex: 1, color: colors.ink, fontSize: 15, lineHeight: 22 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export function Button({ label, onPress, icon, kind = 'primary', disabled }) {
  const { colors } = useApp();
  const bg = kind === 'primary' ? colors.accent : kind === 'danger' ? colors.high : colors.chip;
  const fg = kind === 'primary' ? colors.onAccent : kind === 'danger' ? '#FFFFFF' : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[s.btn, { backgroundColor: bg, opacity: disabled ? 0.4 : 1 }]}
      accessibilityRole="button"
    >
      {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <Text style={{ color: fg, fontWeight: '800', fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({ icon = 'search-outline', title, text }) {
  const { colors } = useApp();
  return (
    <View style={{ alignItems: 'center', padding: 32 }}>
      <Ionicons name={icon} size={44} color={colors.sub} />
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink, marginTop: 10 }}>{title}</Text>
      <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 4 }}>{text}</Text>
    </View>
  );
}

export const callNumber = (n) => Linking.openURL(`tel:${n}`).catch(() => {});
export const statusLabel = (st) => STATUS_LABEL[st] || st;
export const formatTime = (ts) => new Date(ts).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const s = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 52, borderBottomWidth: StyleSheet.hairlineWidth },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 17, fontWeight: '800', marginLeft: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, marginRight: 8 },
  seg: { flexDirection: 'row', borderRadius: 12, padding: 3, marginHorizontal: 16, marginBottom: 10 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10 },
  card: { flexDirection: 'row', borderRadius: 14, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' },
  strip: { width: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12 },
});
