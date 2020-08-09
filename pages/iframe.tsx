import React from "react";
import { SubscribeModalContent } from "../components/SubscribeModalContent";
import { useSelectedOptions } from "../components/hooks/useSelectedOptions";
import { useOptions } from "../components/hooks/useOptions";

export default function iframe() {
  const [localStorageSelectedItems] = useSelectedOptions();
  const [localStorageOptions] = useOptions();

  function handleSave({
    selectedItems,
    options,
  }: {
    selectedItems: string[];
    options: string[];
  }) {
    const data = {
      type: "form-submitted",
      payload: { options, selectedItems },
    };
    window.top.postMessage(JSON.stringify(data), "*");
  }

  return (
    <SubscribeModalContent
      initialOptions={localStorageOptions}
      initialSelectedItems={localStorageSelectedItems}
      onSave={handleSave}
    />
  );
}
