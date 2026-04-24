import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { Toast, Notification, AppSettings } from '../models';
import { MOCK_NOTIFICATIONS, DEFAULT_SETTINGS } from '../data/mockData';

// ─── State Shape ──────────────────────────────────────────────────────────────
interface AppState {
  sidebarCollapsed: boolean;
  toasts: Toast[];
  notifications: Notification[];
  settings: AppSettings;
  loading: Record<string, boolean>;
}

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_LOADING'; payload: { key: string; value: boolean } };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_SIDEBAR':
      return { ...state, sidebarCollapsed: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [action.payload, ...state.toasts] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };
    default:
      return state;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: AppState = {
  sidebarCollapsed: false,
  toasts: [],
  notifications: MOCK_NOTIFICATIONS,
  settings: DEFAULT_SETTINGS,
  loading: {},
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  toggleSidebar: () => void;
  setSidebar: (collapsed: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLoading: (key: string, value: boolean) => void;
  isLoading: (key: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSidebar = useCallback((collapsed: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: collapsed }), []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = toast.duration ?? 4000;
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), duration);
  }, []);

  const removeToast = useCallback((id: string) => dispatch({ type: 'REMOVE_TOAST', payload: id }), []);
  const markNotificationRead = useCallback((id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }), []);
  const markAllRead = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), []);
  const updateSettings = useCallback((settings: Partial<AppSettings>) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }), []);
  const setLoading = useCallback((key: string, value: boolean) => dispatch({ type: 'SET_LOADING', payload: { key, value } }), []);
  const isLoading = useCallback((key: string) => !!state.loading[key], [state.loading]);

  return (
    <AppContext.Provider value={{
      state, toggleSidebar, setSidebar,
      addToast, removeToast,
      markNotificationRead, markAllRead,
      updateSettings, setLoading, isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
