import Head from "next/head";
import Router from "next/router";
import { useContext } from "react";
import { Card } from "../components/card/Card";
import { ContactListElement } from "../components/contactListElement/ContactListElement";
import { NoDataPlaceholder } from "../components/noDataPlaceholder/NoDataPlaceholder";
import { RequestListElement } from "../components/requestListElement/RequestListElement";
import { ProfileContext } from "../context/ProfileContext";
import styles from "../styles/Home.module.css";

export default function Contact() {
  const { profile } = useContext(ProfileContext);

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card style={{ margin: "10vh 35px 70px 35px" }}>
          <h1 style={{ fontSize: "4rem", margin: "0 0 24px 0" }}>Contacts</h1>
          {profile?.requests_received.map((request) => (
            <RequestListElement key={request.owner.id} data={request} />
          ))}
          {profile?.contact.map((c) => (
            <ContactListElement
              requests={profile.requests_received}
              key={c.contact.id}
              data={c}
              onClick={() =>
                Router.push(`/contact-page?u=${c.contact.id}&o=/contacts`)
              }
            />
          ))}
          {profile?.contact.length === 0 &&
            profile?.requests_received.length === 0 && (
              <NoDataPlaceholder text="No contacts" />
            )}
        </Card>
      </main>
    </div>
  );
}
