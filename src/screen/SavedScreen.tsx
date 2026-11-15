import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, getHistory } from '../db/database';
import { Screen, PageTitle, Segmented, ProblemCard, EmptyState, statusLabel, formatTime } from '../components/ui';

export default function SavedScreen({ navigation }) {
  const [tab, setTab] = useState('favorites');
  const [favs, setFavs] = useState([]);
  const [hist, setHist] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let on = true;
      Promise.all([getFavorites(), getHistory()]).then(([f, h]) => { if (on) { setFavs(f); setHist(h); } });
      return () => { on = false; };
    }, [])
  );

  const data = tab === 'favorites' ? favs : hist;
  return (
    <Screen>
      <PageTitle title="Saved" subtitle="Your favourites and troubleshooting history" />
      <Segmented
        options={[{ label: `Favourites (${favs.length})`, value: 'favorites' }, { label: 'History', value: 'history' }]}
        value={tab}
        onChange={setTab}
      />
      <FlatList
        data={data}
        keyExtractor={(i, idx) => `${tab}-${i.id}-${i.at || idx}`}
        renderItem={({ item }) => (
          <ProblemCard
            item={item}
            onPress={() => navigation.navigate('ProblemDetail', { id: item.id })}
            footer={tab === 'history' ? `${statusLabel(item.status)} - ${formatTime(item.at)}` : null}
          />
        )}
        ListEmptyComponent={
          tab === 'favorites'
            ? <EmptyState icon="heart-outline" title="No favourites yet" text="Tap the heart on a problem to save it here." />
            : <EmptyState icon="time-outline" title="No history yet" text="Guides you open or finish will be listed here." />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Screen>
  );
}
