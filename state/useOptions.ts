import createPersistedState from "use-persisted-state";

export function useOptions(initialValue: string[] = []) {
  const [options, setOptions] = createPersistedState("options")<string[]>(
    initialValue
  );
  return [options, setOptions] as const;
}
