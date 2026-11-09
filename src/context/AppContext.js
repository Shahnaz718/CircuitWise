import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase, getSetting, setSetting } from '../db/database';
import { lightColors, darkColors } from '../theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        setDark((await getSetting('dark')) === '1');
        setReady(true);
      } catch (e) {
        setError(String(e && e.message ? e.message : e));
      }
    })();
  }, []);

  const toggleDark = async (value) => {
    setDark(value);
    await setSetting('dark', value ? '1' : '0');
  };

  return (
    <AppContext.Provider value={{ ready, error, dark, toggleDark, colors: dark ? darkColors : lightColors }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
