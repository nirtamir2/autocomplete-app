import { Button, Modal } from "antd";
import React from "react";
import { Layout } from "../components/Layout";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useOptions } from "../components/hooks/useOptions";
import { useSelectedOptions } from "../components/hooks/useSelectedOptions";
import { isSSR } from "../utils/utils";

const Content = styled.div`
  height: 100%;
  padding: var(--gutter);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const defaultOptions = [...Array(20)].map((_, index) => `option-${index}`);

const MODAL_WIDTH = isSSR() ? 0 : window.innerWidth / 2;
const MODAL_HEIGHT = isSSR() ? 0 : window.innerHeight / 2;

export default function Subscribe() {
  const [, setLocalStateSelectedItems] = useSelectedOptions();
  const [, setLocalStateOptions] = useOptions(defaultOptions);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter();

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  React.useEffect(() => {
    function onReceive(e: MessageEvent) {
      const data = JSON.parse(e.data);
      if (data.type === "form-submitted") {
        const payload = data.payload as {
          selectedItems: string[];
          options: string[];
        };
        const { options, selectedItems } = payload;
        setLocalStateSelectedItems(selectedItems);
        setLocalStateOptions(options);
        router.push("/");
      }
    }
    window.addEventListener("message", onReceive);
    return () => {
      window.removeEventListener("message", onReceive);
    };
  }, [router]);

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
          width={MODAL_WIDTH}
          footer={null}
          onCancel={handleCloseModal}
        >
          {isModalOpen ? (
            <iframe src="/iframe" height={MODAL_HEIGHT / 2} width="100%" />
          ) : null}
        </Modal>
      </Content>
    </Layout>
  );
}
