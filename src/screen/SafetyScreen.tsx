import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getSafety } from '../db/database';
import { EMERGENCY_CONTACTS } from '../data/reference';
import { Screen, PageTitle, SectionTitle, callNumber } from '../components/ui';

export default function SafetyScreen() {
  const { colors } = useApp();
  const [rows, setRows] = useState([]);
  useEffect(() => { getSafety().then(setRows); }, []);
  const of = (type) => rows.filter((r) => r.type === type);

  return (
    <Screen>
      <PageTitle title="Safety guide" subtitle="Read this before you touch anything electrical" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 32 }}>
        <View style={{ backgroundColor: colors.highBg, borderRadius: 14, padding: 16, borderLeftWidth: 6, borderLeftColor: colors.high }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.high }}>If someone has an electric shock</Text>
          {of('emergency').map((r, i) => (
            <View key={r.id} style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Text style={{ fontWeight: '800', color: colors.high, width: 18 }}>{i + 1}.</Text>
              <Text style={{ flex: 1, color: colors.ink, lineHeight: 21 }}>{r.text}</Text>
            </View>
          ))}
        </View>

        <SectionTitle icon="call-outline">Emergency contacts</SectionTitle>
        {EMERGENCY_CONTACTS.map((c) => (
          <Pressable key={c.number} onPress={() => callNumber(c.number)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.ink }}>{c.label}</Text>
              <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>{c.note}</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink, marginRight: 10 }}>{c.number}</Text>
            <Ionicons name="call" size={20} color={colors.low} />
          </Pressable>
        ))}
        <Text style={{ color: colors.sub, fontSize: 12 }}>Numbers are for Sri Lanka. Confirm them locally.</Text>

        <Block title="Do" icon="checkmark-circle" color={colors.low} items={of('do')} />
        <Block title="Don't" icon="close-circle" color={colors.high} items={of('dont')} />
        <Block title="Protective equipment" icon="shield-checkmark" color={colors.ink} items={of('ppe')} />
      </ScrollView>
    </Screen>
  );
}

function Block({ title, icon, color, items }) {
  const { colors } = useApp();
  return (
    <View>
      <SectionTitle>{title}</SectionTitle>
      <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, gap: 10 }}>
        {items.map((r) => (
          <View key={r.id} style={{ flexDirection: 'row', gap: 10 }}>
            <Ionicons name={icon} size={20} color={color} />
            <Text style={{ flex: 1, color: colors.ink, lineHeight: 21 }}>{r.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
