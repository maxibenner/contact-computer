import { User } from "@supabase/supabase-js";
import Head from "next/head";
import { ContactCard } from "../components/contactCard/ContactCard";
import { getContact } from "../sdk/db";
import { supabase } from "../sdk/supabase";
import styles from "../styles/Home.module.css";
import { Card } from "../components/card/Card";
import { ProfileContext } from "../context/ProfileContext";
import { useContext } from "react";
import { ContactListElement } from "../components/contactListElement/ContactListElement";
import { Button } from "../components/button/Button";

export default function Contact() {
  const profile = useContext(ProfileContext);
  console.log(profile);

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card style={{ margin: "10vh 35px 70px 35px" }}>
          <h1 style={{ fontSize: "4rem" }}>Contacts</h1>
          {profile?.request.map((request) => (
            <ContactListElement
              key={request.owner_id}
              contact={request.owner}
              onAccept={(access) =>
                console.log(
                  `Accepting: ${request.owner.name} ${request.owner.surname} with access "${access}."`
                )
              }
              onDecline={() =>
                console.log(
                  `Declining: ${request.owner.name} ${request.owner.surname}`
                )
              }
            />
          ))}
          <hr />
          {profile?.connection.map((c) => (
            <ContactListElement key={c.connection_id} contact={c.owner} />
          ))}
        </Card>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req, query }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (user) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: { destination: "/signin", permanent: false },
    };
  }
}
