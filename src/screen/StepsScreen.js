import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getProblem, addHistory } from '../db/database';
import { Screen, TopBar, Button } from '../components/ui';

const CHECKS = [
  'I have switched off the breaker for this area, or unplugged the item.',
  'My hands are dry and I am not standing on a wet floor.',
  'I will stop and call a professional if I am unsure.',
];

export default function StepsScreen({ navigation, route }) {
  const { colors } = useApp();
  const { id } = route.params;
  const [p, setP] = useState(null);
  const [idx, setIdx] = useState(-1); // -1 = safety check, 0..n-1 = steps, n = result
  const [checked, setChecked] = useState([false, false, false]);
  const [result, setResult] = useState(null);

  useEffect(() => { getProblem(id).then(setP); }, [id]);
  if (!p) return <Screen edges={['top', 'bottom']}><TopBar title="Troubleshooting" onBack={() => navigation.goBack()} /></Screen>;

  const n = p.steps.length;
  const step = idx >= 0 && idx < n ? p.steps[idx] : null;
  const progress = Math.max(0, Math.min(1, (idx + 1) / (n + 1)));

  const finish = async (status) => {
    await addHistory(id, status);
    setResult(status);
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <TopBar title={p.title} onBack={() => navigation.goBack()} />
      <View style={{ height: 6, backgroundColor: colors.chip }}>
        <View style={{ height: 6, width: `${progress * 100}%`, backgroundColor: colors.accent }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {idx === -1 && (
          <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>Safety check first</Text>
            <Text style={{ color: colors.sub, marginTop: 6, marginBottom: 16, lineHeight: 21 }}>Tick each box before you start.</Text>
            {CHECKS.map((c, i) => (
              <Pressable
                key={c}
                onPress={() => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.card, padding: 14, borderRadius: 12, marginBottom: 10, alignItems: 'center' }}
              >
                <Ionicons name={checked[i] ? 'checkbox' : 'square-outline'} size={26} color={checked[i] ? colors.low : colors.sub} />
                <Text style={{ flex: 1, color: colors.ink, fontSize: 15, lineHeight: 21 }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step && (
          <View>
            <Text style={{ color: colors.sub, fontWeight: '700' }}>Step {idx + 1} of {n}</Text>
            {step.stop ? (
              <View style={{ marginTop: 10, padding: 18, borderRadius: 14, backgroundColor: colors.highBg, borderLeftWidth: 6, borderLeftColor: colors.high }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="hand-left" size={24} color={colors.high} />
                  <Text style={{ fontSize: 20, fontWeight: '800', color: colors.high }}>Stop here</Text>
                </View>
                <Text style={{ color: colors.ink, fontSize: 17, lineHeight: 25, marginTop: 10 }}>{step.text}</Text>
              </View>
            ) : (
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.ink, marginTop: 10, lineHeight: 31 }}>{step.text}</Text>
            )}
            {step.warn ? (
              <View style={{ marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: colors.medBg, flexDirection: 'row', gap: 10 }}>
                <Ionicons name="warning" size={20} color={colors.med} />
                <Text style={{ flex: 1, color: colors.ink, lineHeight: 21 }}>{step.warn}</Text>
              </View>
            ) : null}
          </View>
        )}

        {idx === n && (
          <View>
            {result === null && (
              <>
                <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>Did this fix it?</Text>
                <Text style={{ color: colors.sub, marginTop: 6, lineHeight: 21 }}>Your answer is saved to your history on this phone.</Text>
              </>
            )}
            {result === 'fixed' && <Result icon="checkmark-circle" color={colors.low} title="Great, marked as fixed" text="Keep an eye on it. If the problem returns, open this guide again." />}
            {result === 'not_fixed' && <Result icon="alert-circle" color={colors.high} title="Not fixed" text="Leave the circuit or appliance switched off and call a licensed electrician. Do not try anything beyond the steps in this guide." />}
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 16, gap: 10, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.line }}>
        {idx === -1 && <Button label="Start" icon="play" disabled={!checked.every(Boolean)} onPress={() => setIdx(0)} />}

        {step && step.stop && (
          <>
            <Button
              label="I will stop and call a professional"
              icon="call"
              kind="danger"
              onPress={async () => { await addHistory(id, 'stopped'); navigation.goBack(); }}
            />
            <Button label="Emergency numbers" icon="medkit-outline" kind="secondary" onPress={() => navigation.navigate('Tabs', { screen: 'Safety' })} />
          </>
        )}
        {step && !step.stop && <Button label={idx === n - 1 ? 'Finish' : 'Next step'} icon="arrow-forward" onPress={() => setIdx(idx + 1)} />}
        {step && idx > 0 && <Button label="Previous step" kind="secondary" onPress={() => setIdx(idx - 1)} />}
        {step && idx === 0 && <Button label="Back to safety check" kind="secondary" onPress={() => setIdx(-1)} />}

        {idx === n && result === null && (
          <>
            <Button label="Yes, it is fixed" icon="checkmark" onPress={() => finish('fixed')} />
            <Button label="No, still not working" kind="secondary" onPress={() => finish('not_fixed')} />
          </>
        )}
        {idx === n && result !== null && <Button label="Done" onPress={() => navigation.goBack()} />}
      </View>
    </Screen>
  );
}

function Result({ icon, color, title, text }) {
  const { colors } = useApp();
  return (
    <View style={{ alignItems: 'center', padding: 12 }}>
      <Ionicons name={icon} size={64} color={color} />
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, marginTop: 10 }}>{title}</Text>
      <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>{text}</Text>
    </View>
  );
}
