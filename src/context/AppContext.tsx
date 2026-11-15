
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  initDatabase,
  getSetting,
  setSetting,
} from '../db/database';

import { lightColors, darkColors } from '../theme';

interface AppContextType {
  ready: boolean;
  error: string | null;
  dark: boolean;
  toggleDark: (value: boolean) => Promise<void>;
  colors: typeof lightColors;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps): React.ReactElement {
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();

        const savedTheme = await getSetting('dark');

        setDark(savedTheme === '1');
        setReady(true);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : String(e)
        );
      }
    };

    initialize();
  }, []);

  const toggleDark = async (value: boolean): Promise<void> => {
    setDark(value);
    await setSetting('dark', value ? '1' : '0');
  };

  const colors = dark ? darkColors : lightColors;

  return (
    <AppContext.Provider
      value={{
        ready,
        error,
        dark,
        toggleDark,
        colors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}
