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
const modalBodyStyle = { padding: 0 };

const GUTTER = 16;
const MODAL_WIDTH = isSSR() ? 0 : window.innerWidth / 2;
const MODAL_HEIGHT = isSSR() ? 0 : window.innerHeight / 2;

export default function Subscribe() {
  const router = useRouter();

  const [, setLocalStateSelectedItems] = useSelectedOptions();
  const [, setLocalStateOptions] = useOptions(defaultOptions);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [modalKey, setModalKey] = React.useState(0);

  React.useEffect(() => {
    setModalKey((key) => key + 1);
  }, [isModalOpen]);

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
          width={MODAL_WIDTH}
          footer={null}
          closable={false}
          bodyStyle={modalBodyStyle}
          onCancel={handleCloseModal}
        >
          <iframe
            key={modalKey}
            src="/iframe"
            height={MODAL_HEIGHT / 2 + 2 * GUTTER}
            width="100%"
            frameBorder={0}
          />
        </Modal>
      </Content>
    </Layout>
  );
}
