import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../theme';
import { getCategoryCounts, getRecent, getStats } from '../db/database';
import { ProblemCard, SectionTitle } from '../components/ui';

export default function HomeScreen({ navigation }) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState({});
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ problems: 0, favorites: 0, fixed: 0 });

  useFocusEffect(
    useCallback(() => {
      let on = true;
      (async () => {
        const [c, r, st] = await Promise.all([getCategoryCounts(), getRecent(4), getStats()]);
        if (!on) return;
        setCounts(Object.fromEntries(c.map((x) => [x.category, x.n])));
        setRecent(r);
        setStats(st);
      })();
      return () => { on = false; };
    }, [])
  );

  const openProblem = (id) => navigation.navigate('ProblemDetail', { id });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ backgroundColor: colors.brand, paddingTop: insets.top + 16, paddingBottom: 22, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="flash" size={24} color={colors.onAccent} />
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.onBrand }}>CircuitWise</Text>
          </View>
          <Text style={{ color: '#B8C4D6', marginTop: 8, fontSize: 15 }}>
            Find the fault, fix what is safe, and know when to call an electrician. Works fully offline.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Problems', { focusSearch: Date.now() })}
            style={{ marginTop: 16, backgroundColor: colors.card, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <Ionicons name="search" size={18} color={colors.sub} />
            <Text style={{ color: colors.sub, fontSize: 15 }}>Search a problem, e.g. "burning smell"</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Safety')}
          style={{ margin: 16, padding: 16, borderRadius: 14, backgroundColor: colors.highBg, borderLeftWidth: 6, borderLeftColor: colors.high }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="warning" size={20} color={colors.high} />
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.high }}>Sparks, smoke or a burning smell?</Text>
          </View>
          <Text style={{ color: colors.ink, marginTop: 6, lineHeight: 21 }}>
            Switch off the main breaker if it is safe, leave the area, and call 110 for fire or 1987 for CEB. Tap for emergency steps.
          </Text>
        </Pressable>

        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 10 }}>
          {[
            ['Guides', stats.problems], ['Saved', stats.favorites], ['Fixed', stats.fixed],
          ].map(([label, n]) => (
            <View key={label} style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>{n}</Text>
              <Text style={{ color: colors.sub, fontSize: 13 }}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <SectionTitle icon="apps-outline">Browse by problem type</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.name}
                onPress={() => navigation.navigate('Problems', { category: c.name, ts: Date.now() })}
                style={{ width: '48%', backgroundColor: colors.card, borderRadius: 14, padding: 14 }}
              >
                <Ionicons name={c.icon} size={26} color={colors.ink} />
                <Text style={{ fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: 8 }}>{c.name}</Text>
                <Text style={{ color: colors.sub, fontSize: 12, marginTop: 2 }}>{c.hint}</Text>
                <Text style={{ color: colors.sub, fontSize: 12, marginTop: 6 }}>{counts[c.name] || 0} guides</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => navigation.navigate('Tools')}
              style={{ width: '48%', backgroundColor: colors.accent, borderRadius: 14, padding: 14 }}
            >
              <Ionicons name="construct-outline" size={26} color={colors.onAccent} />
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.onAccent, marginTop: 8 }}>Tools and terms</Text>
              <Text style={{ color: colors.onAccent, fontSize: 12, marginTop: 2 }}>What each tool does, plus a glossary</Text>
            </Pressable>
          </View>

          <SectionTitle icon="time-outline">Recently viewed</SectionTitle>
        </View>
        {recent.length === 0 ? (
          <Text style={{ color: colors.sub, paddingHorizontal: 16 }}>Guides you open will appear here.</Text>
        ) : (
          recent.map((p) => <ProblemCard key={p.id} item={p} onPress={() => openProblem(p.id)} />)
        )}
      </ScrollView>
    </View>
  );
}
