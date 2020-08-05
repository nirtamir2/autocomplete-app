import createPersistedState from "use-persisted-state";

export function useSelectedOptions(initialValue: string[] = []) {
  const [selectedOptions, setSelectedOptions] = createPersistedState(
    "selected-options"
  )<string[]>(initialValue);
  return [selectedOptions, setSelectedOptions] as const;
}
