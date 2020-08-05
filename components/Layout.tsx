import React from "react";
import { Header } from "./Header";
import styled, { createGlobalStyle } from "styled-components";
import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";

interface IProps {
  children: React.ReactNode;
}

const Content = styled.main`
  height: calc(100vh - var(--headerHeight));
`;

const PageTransitionGlobalStyles = createGlobalStyle` 
  .page-transition-enter {
    opacity: 0;
  }
  .page-transition-enter-active {
    opacity: 1;
    transition: opacity var(--transition-timing-medium);
  }
  .page-transition-exit {
    opacity: 1;
  }
  .page-transition-exit-active {
    opacity: 0;
    transition: opacity var(--transition-timing-medium);
  }
`;

export function Layout(props: IProps) {
  const { children } = props;
  const router = useRouter();
  return (
    <>
      <Header />
      <PageTransition timeout={300} classNames="page-transition">
        <Content key={router.route}>{children}</Content>
      </PageTransition>
      <PageTransitionGlobalStyles />
    </>
  );
}
