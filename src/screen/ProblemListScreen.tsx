import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../theme';
import { getProblems } from '../db/database';
import { Screen, PageTitle, Chip, ProblemCard, EmptyState } from '../components/ui';

const CATS = ['All', ...CATEGORIES.map((c) => c.name)];
const RISKS = ['All', 'Low', 'Medium', 'High'];
const LEVELS = ['All', 'Easy', 'Medium', 'Hard'];

export default function ProblemListScreen({ navigation, route }) {
  const { colors } = useApp();
  const inputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [risk, setRisk] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const p = route.params;
    if (p && p.category) setCategory(p.category);
    if (p && p.focusSearch) setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
  }, [route.params]);

  useEffect(() => {
    let on = true;
    getProblems({ search, category, risk, difficulty }).then((r) => on && setItems(r));
    return () => { on = false; };
  }, [search, category, risk, difficulty]);

  const filtered = category !== 'All' || risk !== 'All' || difficulty !== 'All' || search !== '';
  const clear = () => { setSearch(''); setCategory('All'); setRisk('All'); setDifficulty('All'); };

  return (
    <Screen>
      <PageTitle title="Problems" subtitle="Search or filter to find the right guide" />
      <View style={{ marginHorizontal: 16, backgroundColor: colors.card, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
        <Ionicons name="search" size={18} color={colors.sub} />
        <TextInput
          ref={inputRef}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by title, symptom or cause"
          placeholderTextColor={colors.sub}
          style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: colors.ink, fontSize: 15 }}
          returnKeyType="search"
        />
        {search ? (
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.sub} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginTop: 12 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATS.map((c) => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginTop: 8 }} contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.sub, marginRight: 8, fontSize: 13 }}>Risk</Text>
        {RISKS.map((r) => <Chip key={r} label={r} active={risk === r} onPress={() => setRisk(r)} />)}
        <Text style={{ color: colors.sub, marginHorizontal: 8, fontSize: 13 }}>Difficulty</Text>
        {LEVELS.map((l) => <Chip key={l} label={l} active={difficulty === l} onPress={() => setDifficulty(l)} />)}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginVertical: 10 }}>
        <Text style={{ color: colors.sub }}>{items.length} {items.length === 1 ? 'guide' : 'guides'}</Text>
        {filtered ? (
          <Pressable onPress={clear}><Text style={{ color: colors.ink, fontWeight: '700' }}>Clear filters</Text></Pressable>
        ) : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => <ProblemCard item={item} onPress={() => navigation.navigate('ProblemDetail', { id: item.id })} />}
        ListEmptyComponent={<EmptyState title="No guides match" text="Try a different word, or clear the filters." />}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}
