import * as R from 'ramda';
import React from 'react';


export interface AppStateContext {
  /**
   * Provided a key, returns a tuple containing the value for that key and a
   * setter function to update it. Values will be persisted to LocalStorage.
   */
  useAppState: <T = any>(key: string) => [T | undefined, React.Dispatch<React.SetStateAction<T>>];

  /**
   * Provided a key, returns a tuple containing the value for that key and a
   * function that, when invoked, sets the value to its inverse.
   */
  toggleAppState: (key: string) => [boolean, () => void];
}


/**
 * The context's state is a map that mirrors key/value pairs in Local Storage.
 * We keep this in-memory mapping to avoid having to read from Local Storage on
 * each re-render.
 */
interface State {
  [index: string]: any;
}


/**
 * Action type for our reducer.
 */
interface SetStateAction {
  key: string;
  value: any;
}


/**
 * Initial state for this context.
 */
const initialState: State = {
  // Set initial dark mode according to the user's preferences.
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  showNsfw: false,
  sortOrder: 'latest'
};


/**
 * Initializes app state by iterating over each key in our initial state
 * object and fetching the corresponding value from Local Storage.
 */
function initializer(initialState: State): State {
  return R.mapObjIndexed((initialValue, key) => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? initialValue);
    } catch {
      // Local storage may be unavailable. Return the initial value.
      return initialValue;
    }
  }, initialState);
}


/**
 * Handles state updates by setting values in Local Storage.
 */
function reducer(state: State, action: SetStateAction): State {
  try {
    localStorage.setItem(String(action.key), JSON.stringify(action.value));
  } catch {
    // Local storage may not be available due to private mode, etc.
  }

  return {
    ...state,
    [action.key]: action.value
  };
}


const Context = React.createContext<AppStateContext>({} as any);


export function Provider(props: React.PropsWithChildren<Record<string, unknown>>) {
  const [state, dispatch] = React.useReducer(reducer, initialState, initializer);


  const useAppState = React.useCallback<AppStateContext['useAppState']>((key: string) => {
    const setState = (value: any) => void dispatch({ key, value });
    return [state[key], setState];
  }, [state, dispatch]);


  const toggleAppState = React.useCallback<AppStateContext['toggleAppState']>((key: string) => {
    const toggleState = () => void dispatch({ key, value: !state[key] });
    return [state[key], toggleState];
  }, [state, dispatch]);


  const [darkMode] = useAppState<boolean>('darkMode');


  /**
   * Adds or removes a data attribute to the <html> element to enable or disable
   * dark mode.
   */
  React.useEffect(() => {
    const htmlEl = document.querySelector('html');
    if (!htmlEl) return;
    htmlEl.dataset.bsTheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);


  return (
    <Context.Provider
      value={{
        useAppState,
        toggleAppState
      }}
    >
      {props.children}
    </Context.Provider>
  );
}


export default Context;
