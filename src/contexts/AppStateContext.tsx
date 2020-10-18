import * as R from 'ramda';
import React from 'react';


// ----- Types -----------------------------------------------------------------

/**
 * Type of the value provided by this Context: a custom hook function that
 * accepts a key and returns tuple with a value of type T and a setValue
 * function that accepts a value of type T.
 */
export type AppStateContext = <T = any>(key: string) => [
  T | undefined,
  React.Dispatch<React.SetStateAction<T>>
];


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


// ----- Initial State ---------------------------------------------------------

const initialState: State = {
  darkMode: false
};


// ----- Context ---------------------------------------------------------------

const Context = React.createContext<AppStateContext>({} as any);


export const Provider = (props: React.PropsWithChildren<Record<string, unknown>>) => {
  /**
   * Initializes app state by iterating over each key in our initial state
   * object and fetching the corresponding value from Local Storage.
   */
  const initializer = (initialState: State): State => {
    return R.mapObjIndexed((initialValue, key) => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? initialValue);
      } catch {
        // Local storage may be unavailable. Return the initial value.
        return initialValue;
      }
    }, initialState);
  };

  /**
   * Handles state updates by setting values in Local Storage.
   */
  const reducer = (state: State, action: SetStateAction): State => {
    try {
      localStorage.setItem(String(action.key), JSON.stringify(action.value));
    } catch {
      // Local storage may not be available due to private mode, etc.
    }

    return {...state, [action.key]: action.value};
  };

  const [state, dispatch] = React.useReducer(reducer, initialState, initializer);

  // N.B. There seems to be a parsing error with TSX + arrow functions that use
  // generic type parameters. Re-visit in the future.
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  function useAppState<T = any>(key: string) {
    const setState: React.Dispatch<React.SetStateAction<T>> = (value: React.SetStateAction<T>) => {
      dispatch({key, value});
    };

    return [state[key], setState] as any;
  }

  return (
    <Context.Provider value={useAppState}>
      {props.children}
    </Context.Provider>
  );
};


export default Context;
