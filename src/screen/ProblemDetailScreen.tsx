import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getProblem, isFavorite, toggleFavorite, addHistory } from '../db/database';
import { Screen, TopBar, RiskBadge, SectionTitle, BulletList, Button } from '../components/ui';
import { categoryIcon } from '../theme';

export default function ProblemDetailScreen({ navigation, route }) {
  const { colors } = useApp();
  const { id } = route.params;
  const [p, setP] = useState(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    (async () => {
      setP(await getProblem(id));
      setFav(await isFavorite(id));
      await addHistory(id, 'viewed');
    })();
  }, [id]);

  const onFav = async () => setFav(await toggleFavorite(id));

  return (
    <Screen edges={['top', 'bottom']}>
      <TopBar
        title="Problem details"
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={onFav} hitSlop={10} accessibilityLabel={fav ? 'Remove from saved' : 'Save problem'}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={26} color={fav ? colors.high : colors.ink} />
          </Pressable>
        }
      />
      {!p ? null : (
        <>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <RiskBadge risk={p.risk} />
              <Ionicons name={categoryIcon(p.category)} size={16} color={colors.sub} />
              <Text style={{ color: colors.sub }}>{p.category}</Text>
            </View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: colors.ink }}>{p.title}</Text>
            <Text style={{ color: colors.sub, fontSize: 15, marginTop: 6, lineHeight: 22 }}>{p.summary}</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Info label="Difficulty" value={p.difficulty} />
              <Info label="Time" value={`${p.minutes} min`} />
              <Info label="Steps" value={String(p.steps.length)} />
            </View>

            {p.call_pro ? (
              <View style={{ marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: colors.highBg, flexDirection: 'row', gap: 10 }}>
                <Ionicons name="alert-circle" size={22} color={colors.high} />
                <Text style={{ flex: 1, color: colors.ink, lineHeight: 21 }}>
                  This problem may need a licensed electrician. The guide shows you what is safe to check and where to stop.
                </Text>
              </View>
            ) : null}

            <SectionTitle icon="eye-outline">Symptoms</SectionTitle>
            <BulletList items={p.symptoms} />
            <SectionTitle icon="help-circle-outline">Likely causes</SectionTitle>
            <BulletList items={p.causes} />
            <SectionTitle icon="construct-outline">Tools needed</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {p.tools.map((t) => (
                <View key={t} style={{ backgroundColor: colors.chip, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16 }}>
                  <Text style={{ color: colors.ink, fontSize: 13 }}>{t}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.card }}>
            <Button label="Start troubleshooting" icon="play" onPress={() => navigation.navigate('Steps', { id })} />
          </View>
        </>
      )}
    </Screen>
  );
}

function Info({ label, value }) {
  const { colors } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
      <Text style={{ color: colors.sub, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: 2 }}>{value}</Text>
    </View>
  );
}
