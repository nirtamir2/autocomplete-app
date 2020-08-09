import React from "react";
import { Button, Typography, List } from "antd";
import Link from "next/link";
import styled from "styled-components";
import { Layout } from "../components";
import { useSelectedOptions } from "../state";

const Content = styled.div`
  padding: var(--gutter);

  display: grid;
  grid-auto-flow: row;
  grid-gap: var(--gutter);
  align-items: center;
  justify-content: center;

  text-align: center;
`;

export default function Home() {
  const [selectedOptions] = useSelectedOptions();

  function renderWelcome() {
    return (
      <>
        <Typography.Title level={2}>Welcome to Nir!</Typography.Title>
        <div>
          <Button type="primary">
            <Link href="/subscribe">
              <a>Go to second Page</a>
            </Link>
          </Button>
        </div>
      </>
    );
  }

  function renderSelectedOptions() {
    return (
      <>
        <Typography.Title level={4}>User subscribed!</Typography.Title>
        <List<string>
          bordered
          dataSource={selectedOptions}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item}</Typography.Text>
            </List.Item>
          )}
        />
      </>
    );
  }

  return (
    <Layout>
      <Content>
        {selectedOptions.length === 0
          ? renderWelcome()
          : renderSelectedOptions()}
      </Content>
    </Layout>
  );
}
