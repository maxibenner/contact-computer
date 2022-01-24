import { NextPage } from "next";
import Head from "next/head";
import { Button } from "../components/button/Button";
import { Card } from "../components/card/Card";
import styles from "../styles/Home.module.css";
import textStyles from "../styles/text.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Router from "next/router";

const Verification: NextPage = () => {
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    const { email } = Router.query;
    if (typeof email === "string") setEmail(email);
  }, []);
  return (
    <>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card style={{ margin: "10vh 35px 70px 35px", paddingBottom: "60px" }}>
          <h1 style={{ fontSize: "4rem" }}>Confirm email</h1>
          <p className={textStyles.bodyLight}>
            You are almost there! We sent an email to{" "}
            <b className={textStyles.bodyRegular}>{email}</b>.
          </p>
          <p className={textStyles.bodyLight}>
            Just click the link in the email to start editing your profile and
            adding contacts. If you don&apos;t see it, you may need to{" "}
            <b className={textStyles.bodyRegular}>check your spam folder</b>.
          </p>
          <p className={textStyles.bodyLight} style={{ marginTop: "25px" }}>
            Still can&apos;t find it?
          </p>
          <Link href="mailto:benner@fotura.co">
            <a>
              <Button innerStyle={{ padding: "0 15px" }} text="Contact us" />
            </a>
          </Link>
        </Card>
      </main>
    </>
  );
};

export default Verification;
