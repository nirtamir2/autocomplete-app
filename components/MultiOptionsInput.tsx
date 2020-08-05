import React from "react";
import { Button, Empty, Tag, Tooltip, Typography } from "antd";
import { useCombobox, useMultipleSelection } from "downshift";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { FixedSizeList } from "react-window";

interface IProps {
  inputValue: string;
  selectedItems: string[];
  options: string[];
  onChangeOptions: (options: string[]) => void;
  onChangeSelectedItems: (items: string[]) => void;
  onChangeInputValue: (value: string) => void;
}

const SelectedTagsContainer = styled.div`
  display: flex;
  padding-left: var(--gutterSmall);
  align-items: center;
`;

const StyledFixedSizeOptionsList = styled(FixedSizeList)`
  margin: 0;
  padding: 0;

  overflow: auto;
  list-style-type: none;
`;

const OptionsListItem = styled.li<{ highlighted: boolean }>`
  padding: var(--gutter);
  background-color: ${(props) =>
    props.highlighted ? "var(--hoverColor)" : "var(--whiteColor)"};
`;

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const TransparentInput = styled.input`
  width: 100%;

  flex: 1;

  outline: none;
  border: none;
  background-color: transparent;
`;

const SelectMenuButton = styled.button`
  padding-right: var(--gutterSmall);
  align-self: center;

  background-color: transparent;
  border: none;
`;

const OptionsModalContainer = styled.div`
  position: relative;
`;

const OptionsModal = styled.div`
  width: 100%;

  position: absolute;
  left: 0;
  top: var(--gutterSmall);

  background-color: var(--whiteColor);
  border: 1px solid var(--borderColor);
  z-index: 1;
`;

const BorderedBox = styled.div`
  flex: 1;
  display: flex;
  border-radius: var(--borderRadius) 0 var(--borderRadius) 0;
  border: 1px solid var(--borderColor);
  background-color: var(--whiteColor);
  position: relative;
`;

const SelectContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TransparentInputWrapper = styled.div`
  flex: 1;
  display: flex;
`;

const OPTIONS_PADDING = 16;
const OPTION_LINE_HEIGHT = 22;
const OPTION_HEIGHT = OPTIONS_PADDING * 2 + OPTION_LINE_HEIGHT;
const ROWS_COUNT = 3;

function getCalculatedTagSize({
  textLength,
  // Could measure, but it's good enough
  fontSizeInPx = 6.469,
}: {
  textLength: number;
  fontSizeInPx?: number;
}) {
  const TAG_PADDING = 7;
  const TAG_BORDER_WIDTH = 1;
  const MARGIN = 8;
  return (
    textLength * fontSizeInPx + TAG_PADDING * 2 + TAG_BORDER_WIDTH * 2 + MARGIN
  );
}

function getMaxTagCount({
  selectedItems,
  inputWidth,
  inputMinWidth,
}: {
  selectedItems: string[];
  inputWidth: number;
  inputMinWidth: number;
}) {
  const elementsDimensions = selectedItems.map((i) =>
    getCalculatedTagSize({ textLength: i.length })
  );

  const INITIAL_PADDING = 5 * 2;
  let result =
    INITIAL_PADDING + getCalculatedTagSize({ textLength: "10 more".length });
  for (let index = 0; index < elementsDimensions.length; index++) {
    result += elementsDimensions[index];
    if (result > inputWidth - inputMinWidth) {
      return index - 1;
    }
  }

  return elementsDimensions.length;
}

export function MultiOptionsInput(props: IProps) {
  const {
    onChangeOptions,
    onChangeSelectedItems,
    options,
    selectedItems,
  } = props;

  const [inputValue, setInputValue] = React.useState("");
  const {
    ref: borderedBoxRef,
    width: borderedBoxWidth = 100,
  } = useResizeObserver<HTMLDivElement>();

  function getFilteredItems() {
    return options.filter(
      (item) =>
        !selectedItems.includes(item) &&
        item.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  const { getSelectedItemProps, getDropdownProps } = useMultipleSelection<
    string
  >({
    selectedItems,
    onSelectedItemsChange: (changes) => {
      onChangeSelectedItems(changes.selectedItems ?? []);
    },
  });

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    toggleMenu,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox<string>({
    inputValue,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    items: getFilteredItems(),
    stateReducer: (_state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputChange:
          return {
            ...changes,
            isOpen: true,
          };
      }
      return changes;
    },
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue ?? "");
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            setInputValue("");
            onChangeSelectedItems([...selectedItems, selectedItem]);
          }
          break;
        default:
          break;
      }
    },
  });

  function addNewOption() {
    if (inputValue.length > 0) {
      if (!options.includes(inputValue)) {
        onChangeOptions([...options, inputValue]);
        setInputValue("");
      }
      if (!selectedItems.includes(inputValue)) {
        onChangeSelectedItems([...selectedItems, inputValue]);
        setInputValue("");
      }
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Enter":
        addNewOption();
        break;
      case "Delete":
      case "Backspace": {
        if (inputValue.length === 0) {
          onChangeSelectedItems([
            ...selectedItems.slice(0, selectedItems.length - 1),
          ]);
        }
      }
    }
  }

  //#region Render Functions
  function renderSelectedTags() {
    const maxTagCount = getMaxTagCount({
      selectedItems,
      inputWidth: borderedBoxWidth,
      inputMinWidth: 100,
    });
    const tagItems = selectedItems
      .map((selectedItem, index) => {
        return (
          <Tag
            key={`selected-item-${index}`}
            closable
            visible
            onClose={() => {
              onChangeSelectedItems(
                selectedItems.filter((i) => i !== selectedItem)
              );
            }}
            {...getSelectedItemProps({ selectedItem, index })}
          >
            {selectedItem}
          </Tag>
        );
      })
      .filter((_, index) => index < maxTagCount);
    return (
      <SelectedTagsContainer>
        {tagItems}
        {selectedItems.length > tagItems.length ? (
          <Tooltip
            placement="bottom"
            title={selectedItems
              .filter((_, index) => index >= tagItems.length)
              .join(", ")}
          >
            <Tag>{selectedItems.length - tagItems.length} more</Tag>
          </Tooltip>
        ) : null}
      </SelectedTagsContainer>
    );
  }

  function renderOptions() {
    const filteredItems = getFilteredItems();
    if (filteredItems.length === 0) return <Empty />;
    return (
      <StyledFixedSizeOptionsList
        itemCount={filteredItems.length}
        itemSize={OPTION_HEIGHT}
        height={Math.min(ROWS_COUNT, filteredItems.length) * OPTION_HEIGHT}
        width="100%"
        innerElementType="ul"
      >
        {({ index, style }) => {
          const item = filteredItems[index];
          return (
            <OptionsListItem
              highlighted={highlightedIndex === index}
              {...getItemProps({ item, index })}
              style={style}
            >
              <Typography.Text>{item}</Typography.Text>
            </OptionsListItem>
          );
        }}
      </StyledFixedSizeOptionsList>
    );
  }
  //#endregion

  const isAddButtonDisabled =
    inputValue.length === 0 || selectedItems.includes(inputValue);

  return (
    <Container>
      <SelectContainer>
        <BorderedBox ref={borderedBoxRef}>
          {renderSelectedTags()}
          <TransparentInputWrapper {...getComboboxProps()}>
            <TransparentInput
              {...getInputProps({
                ...getDropdownProps({ preventKeyAction: isOpen }),
                onClick: toggleMenu,
                onKeyDown: handleInputKeyDown,
              })}
              placeholder="Add Option"
            />
            <SelectMenuButton
              {...getToggleButtonProps()}
              aria-label="Toggle menu"
            >
              {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
            </SelectMenuButton>
          </TransparentInputWrapper>
        </BorderedBox>
        <OptionsModalContainer {...getMenuProps()}>
          {isOpen ? <OptionsModal>{renderOptions()}</OptionsModal> : null}
        </OptionsModalContainer>
      </SelectContainer>
      <Button
        disabled={isAddButtonDisabled}
        type="default"
        onClick={() => {
          addNewOption();
        }}
      >
        Add
      </Button>
    </Container>
  );
}
