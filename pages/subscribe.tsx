import { Button, Modal } from "antd";
import React from "react";
import { Layout } from "../components/Layout";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useOptions } from "../components/hooks/useOptions";
import { useSelectedOptions } from "../components/hooks/useSelectedOptions";
import { isSSR } from "../utils/utils";
import { SubscribeModalContent } from "../components/SubscribeModalContent";

const Content = styled.div`
  height: 100%;
  padding: var(--gutter);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const defaultOptions = [...Array(20)].map((_, index) => `option-${index}`);

const MODAL_WIDTH = isSSR() ? 0 : window.innerWidth;

export default function Subscribe() {
  const [
    localStorageSelectedItems,
    setLocalStateSelectedItems,
  ] = useSelectedOptions();
  const [localStorageOptions, setLocalStateOptions] = useOptions(
    defaultOptions
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter();

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleSave({
    selectedItems,
    options,
  }: {
    selectedItems: string[];
    options: string[];
  }) {
    setLocalStateSelectedItems(selectedItems);
    setLocalStateOptions(options);
    router.push("/");
  }

  return (
    <Layout>
      <Content>
        <Button type="primary" onClick={handleOpenModal}>
          Subscribe to our channel
        </Button>
        <Modal
          centered
          visible={isModalOpen}
          title="Modal"
          width={MODAL_WIDTH / 2}
          footer={null}
          onCancel={handleCloseModal}
        >
          {/* NOTE: unmounting the component in order to reset state */}
          {/* This can be done by setting different key too */}
          {isModalOpen ? (
            <SubscribeModalContent
              initialOptions={localStorageOptions}
              initialSelectedItems={localStorageSelectedItems}
              onSave={handleSave}
            />
          ) : null}
        </Modal>
      </Content>
    </Layout>
  );
}
