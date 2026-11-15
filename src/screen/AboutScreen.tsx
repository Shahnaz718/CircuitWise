import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { clearHistory, clearFavorites, getStats } from '../db/database';
import { Screen, PageTitle, SectionTitle } from '../components/ui';

export default function AboutScreen({ navigation }) {
  const { colors, dark, toggleDark } = useApp();
  const [stats, setStats] = useState({ problems: 0, favorites: 0, fixed: 0 });
  const refresh = useCallback(() => { getStats().then(setStats); }, []);
  useFocusEffect(refresh);

  const confirm = (title, msg, action) =>
    Alert.alert(title, msg, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await action(); refresh(); } },
    ]);

  return (
    <Screen>
      <PageTitle title="More" subtitle="Settings, tools and app information" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 32 }}>
        <Row icon="moon-outline" label="Dark mode" right={<Switch value={dark} onValueChange={toggleDark} />} />
        <Row icon="construct-outline" label="Tools and glossary" onPress={() => navigation.navigate('Tools')} right={<Ionicons name="chevron-forward" size={20} color={colors.sub} />} />
        <Row icon="time-outline" label="Clear history" onPress={() => confirm('Clear history?', 'This removes your troubleshooting history from this phone.', clearHistory)} />
        <Row icon="heart-dislike-outline" label="Clear favourites" onPress={() => confirm('Clear favourites?', 'This removes all saved problems.', clearFavorites)} />

        <SectionTitle icon="information-circle-outline">About CircuitWise</SectionTitle>
        <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, gap: 6 }}>
          <Text style={{ color: colors.ink, lineHeight: 21 }}>
            An offline companion for diagnosing common household electrical problems, with safety instructions and step-by-step troubleshooting.
          </Text>
          <Text style={{ color: colors.sub }}>{stats.problems} guides stored locally in SQLite</Text>
          <Text style={{ color: colors.sub }}>Version 1.0.0 - ICA 03, Reg. No. 2022ICT141</Text>
        </View>

        <SectionTitle icon="warning-outline">Disclaimer</SectionTitle>
        <View style={{ backgroundColor: colors.medBg, borderRadius: 14, padding: 14 }}>
          <Text style={{ color: colors.ink, lineHeight: 21 }}>
            CircuitWise gives general guidance only and is not a substitute for a licensed electrician. Electricity can cause serious injury, fire or death. Always switch off the power before checking anything, and never work on wiring, breaker boards or the inside of appliances. If you are unsure, stop and call a professional.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, label, onPress, right }) {
  const { colors } = useApp();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8 }}>
      <Ionicons name={icon} size={22} color={colors.ink} />
      <Text style={{ flex: 1, color: colors.ink, fontSize: 15, fontWeight: '600' }}>{label}</Text>
      {right}
    </Pressable>
  );
}
