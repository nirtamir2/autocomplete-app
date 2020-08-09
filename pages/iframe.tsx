import React from "react";
import styled from "styled-components";
import { SubscribeModalContent } from "../components";
import { useOptions, useSelectedOptions } from "../state";

const Container = styled.div`
  padding: var(--gutter);
`;

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
    <Container>
      <SubscribeModalContent
        initialOptions={localStorageOptions}
        initialSelectedItems={localStorageSelectedItems}
        onSave={handleSave}
      />
    </Container>
  );
}
