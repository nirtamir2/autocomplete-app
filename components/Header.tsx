import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Button } from "antd";
import Logo from "./assets/logo.svg";

const FixedHeader = styled.header`
  height: var(--headerHeight);
  width: 100%;
  padding: 0 var(--gutter);

  position: fixed;
  display: grid;
  grid-auto-flow: column;
  grid-gap: var(--gutter);
  align-items: center;
  justify-content: space-between;

  z-index: 1;
  background-color: var(--headerBackgroundColor);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--gutter);
`;

const List = styled.nav`
  padding: var(--gutter);

  display: grid;
  grid-auto-flow: column;
  grid-gap: var(--gutter);
  align-items: center;

  list-style: none;
`;

const CompanyTitle = styled.div`
  font-size: var(--fontSizeLarge);
  color: var(--whiteColor);
`;

const VerticalHeight = styled.div`
  height: var(--headerHeight);
`;

const CompanyInfo = styled.div`
  display: grid;
  grid-gap: var(--gutter);
  grid-auto-flow: column;
  align-items: center;
`;

export function Header() {
  const router = useRouter();

  function renderTitleText() {
    switch (router.pathname) {
      case "/":
        return "Home";
      case "/subscribe":
        return "Subscribe";
    }
  }

  return (
    <>
      <FixedHeader>
        <CompanyInfo>
          <Link href="/">
            <a>
              <Logo height={45} width={122} />
            </a>
          </Link>
          <CompanyTitle>{renderTitleText()}</CompanyTitle>
        </CompanyInfo>
        <Nav>
          <List>
            <li>
              <Link href="/">
                <Button ghost type="default">
                  Home
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/subscribe">
                <Button ghost type="default">
                  Subscribe
                </Button>
              </Link>
            </li>
          </List>
        </Nav>
      </FixedHeader>
      <VerticalHeight />
    </>
  );
}
