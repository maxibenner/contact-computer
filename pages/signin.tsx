import { NextPage } from "next";
import Head from "next/head";
import { Card } from "../components/card/Card";
import { Button } from "../components/button/Button";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { InputText } from "../components/inputText/InputText";
import { useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import { signIn } from "../sdk/auth";
import { NotificationContext } from "../context/NotificationContext";
import { Spinner } from "../components/spinner/Spinner";
import Router from "next/router";

const SignIn: NextPage = () => {
  const [password, onChangePassword] = useState("");
  const [email, onChangeEmail] = useState("");
  const [notification, setNotification] = useContext(NotificationContext);
  const [isLoading, setItsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setItsLoading(true);

    // Sign in
    signIn(email, password).then(({ error, session, user }) => {
      if (error) {
        setItsLoading(false);
        if (
          error.message === "Unable to validate email address: invalid format"
        ) {
          setNotification({
            title: "Error",
            description: "Please enter a valid email address.",
            type: "error",
            buttonText: "Ok",
          });
        } else if (error.message === "Invalid login credentials") {
          setNotification({
            title: "Error",
            description: "Invalid email or password.",
            type: "error",
            buttonText: "Ok",
          });
        } else if (
          error.message ===
          "You must provide either an email, phone number or a third-party provider."
        ) {
          setNotification({
            title: "Error",
            description: "Please provide an email address and a password.",
            type: "error",
            buttonText: "Ok",
          });
        } else {
          setNotification({
            title: "Error",
            description: error.message,
            type: "error",
            buttonText: "Ok",
          });
        }
      } else Router.push("/contact");
    });
  };

  return (
    <>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card style={{ margin: "10vh 35px 70px 35px" }}>
          <Link href="/">
            <a>
              <Button
                icon={<MdArrowBack />}
                style={{ position: "absolute", top: -20, left: -20 }}
              />
            </a>
          </Link>
          <h1 style={{ fontSize: "4rem" }}>Sign In</h1>
          <form
            name="Sign In"
            onSubmit={handleSignIn}
            noValidate
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
            }}
          >
            <InputText
              label="Email"
              type="email"
              style={{ marginBottom: "15px" }}
              onChange={onChangeEmail}
              value={email}
            />
            <InputText
              value={password}
              type="password"
              label="Password"
              style={{ marginBottom: "30px" }}
              onChange={onChangePassword}
            />
            <Button
              tabindex={0}
              icon={isLoading && <Spinner />}
              style={{
                height: "50px",
                width: "100%",
                margin: "0 auto",
              }}
              text={!isLoading ? "Sign In" : undefined}
            />
            <Link href="/signup">
              <p
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  width: "fit-content",
                  margin: "20px auto",
                }}
              >
                Create account
              </p>
            </Link>
          </form>
        </Card>
      </main>
    </>
  );
};

export default SignIn;
