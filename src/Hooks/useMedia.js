import React from 'react';
const formatDebugValue = ({ query, state }) => `\`${query}\` => ${state}`;

export function useMedia(query, initialState = false) {
  const [state, setState] = React.useState(initialState);
  React.useDebugValue({ query, state }, formatDebugValue);

  React.useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    function onChange() {
      if (!mounted) {
        return;
      }
      setState(Boolean(mql.matches));
    }

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
}
