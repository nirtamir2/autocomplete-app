import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { MultiOptionsInput } from "../ui-core";

interface IProps {
  onSave: (values: { selectedItems: string[]; options: string[] }) => void;
  initialSelectedItems: string[];
  initialOptions: string[];
}

const StyledForm = styled.form`
  display: grid;
  grid-gap: var(--gutter);
  grid-auto-flow: row;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export function SubscribeModalContent(props: IProps) {
  const { onSave, initialOptions, initialSelectedItems } = props;
  const [selectedItems, setSelectedItems] = React.useState(
    initialSelectedItems
  );
  const [options, setOptions] = React.useState(initialOptions);
  const [inputValue, setInputValue] = React.useState("");

  function handleSubmit() {
    onSave({ selectedItems, options });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // Cancel form submitting by input enter key
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    // Cancel form submitting by clicking button
    e.preventDefault();
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      {/**
       * Hack:
       * Wrapper component allows select options using the enter key,
       * and toggle menu using button inside <MultiFormInput> without form submitting
       */}
      <div onKeyDown={handleKeyDown} onClick={handleClick}>
        <MultiOptionsInput
          inputValue={inputValue}
          selectedItems={selectedItems}
          options={options}
          onChangeOptions={setOptions}
          onChangeSelectedItems={setSelectedItems}
          onChangeInputValue={setInputValue}
        />
      </div>
      <ButtonContainer>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </ButtonContainer>
    </StyledForm>
  );
}
