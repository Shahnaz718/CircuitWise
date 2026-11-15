import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getTools, getGlossary } from '../db/database';
import { Screen, TopBar, Segmented, EmptyState } from '../components/ui';

export default function ToolsScreen({ navigation }) {
  const { colors } = useApp();
  const [tab, setTab] = useState('tools');
  const [tools, setTools] = useState([]);
  const [terms, setTerms] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => { getTools().then(setTools); }, []);
  useEffect(() => { getGlossary(q).then(setTerms); }, [q]);

  return (
    <Screen edges={['top', 'bottom']}>
      <TopBar title="Tools and terms" onBack={() => navigation.goBack()} />
      <View style={{ height: 12 }} />
      <Segmented options={[{ label: 'Tools', value: 'tools' }, { label: 'Glossary', value: 'glossary' }]} value={tab} onChange={setTab} />

      {tab === 'tools' ? (
        <FlatList
          data={tools}
          keyExtractor={(t) => String(t.id)}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={item.icon} size={24} color={colors.ink} />
                <Text style={{ fontSize: 16, fontWeight: '800', color: colors.ink, flex: 1 }}>{item.name}</Text>
              </View>
              <Text style={{ color: colors.ink, marginTop: 8, lineHeight: 21 }}>{item.purpose}</Text>
              <Text style={{ color: colors.sub, marginTop: 6, lineHeight: 21 }}>{item.usage}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, backgroundColor: colors.medBg, padding: 10, borderRadius: 10 }}>
                <Ionicons name="warning" size={16} color={colors.med} />
                <Text style={{ flex: 1, color: colors.ink, fontSize: 13, lineHeight: 19 }}>{item.safety}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <>
          <View style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: colors.card, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
            <Ionicons name="search" size={18} color={colors.sub} />
            <TextInput value={q} onChangeText={setQ} placeholder="Search a term" placeholderTextColor={colors.sub} style={{ flex: 1, padding: 12, color: colors.ink }} />
          </View>
          <FlatList
            data={terms}
            keyExtractor={(t) => String(t.id)}
            contentContainerStyle={{ padding: 16, paddingTop: 4 }}
            ListEmptyComponent={<EmptyState title="No matching term" text="Try another word." />}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <Text style={{ fontWeight: '800', color: colors.ink, fontSize: 15 }}>{item.term}</Text>
                <Text style={{ color: colors.sub, marginTop: 4, lineHeight: 21 }}>{item.definition}</Text>
              </View>
            )}
          />
        </>
      )}
    </Screen>
  );
}
