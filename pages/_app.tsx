import React from "react";
import App, { AppProps } from "next/app";
import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";

export default class MyApp extends App<AppProps> {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
