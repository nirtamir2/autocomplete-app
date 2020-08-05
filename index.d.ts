declare module "*.svg";

declare module "next-page-transitions" {
  interface IPageTransitionProps {
    timeout: number;
    classNames: string;
    children: React.ReactNode;
  }
  export declare class PageTransition extends React.Component<
    IPageTransitionProps,
    any
  > {}
}
