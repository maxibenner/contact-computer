import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FieldsWrapper } from "../context/fieldsContext";
import { MouseWrapper } from "../context/mouseContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MouseWrapper>
      <FieldsWrapper>
        <Component {...pageProps} />
      </FieldsWrapper>
    </MouseWrapper>
  );
}

export default MyApp;
