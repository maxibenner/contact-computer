import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import localStyles from "../styles/index.module.css";
import { useState, useEffect, useContext } from "react";
import { Search } from "../components/search/Search";
import { ContactSearchResults } from "../components/contactSearchResults/ContactSearchResults";
import { ContactType } from "./contact";
import { getContactSearchResult } from "../sdk/db";
import Router from "next/router";
import { NotificationContext } from "../context/NotificationContext";

const Home: NextPage = () => {
  const [contacts, setContacts] = useState<any>([]);

  const [notification, setNotification] = useContext(NotificationContext);

  const handleSearch = async (d: string) => {
    const { data, error } = await getContactSearchResult(d);
    if (error) {
      console.log(error);
    }
    setContacts(data);
  };

  const handleSelect = (contact: ContactType) => {
    setContacts([]);
    Router.push(`/contact?u=${contact.id}`);
  };

  // Give info to user
  useEffect(() => {
    setNotification({
      title: "Hey there!",
      description:
        "My name is Contact Computer. I'm a privacy focused, global address book that is always up to date.",
      type: "info",
      buttonText: "Sounds good",
    });
  }, []);

  return (
    <>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={localStyles.container}>
          <h1 className={styles.heroText}>The global address book</h1>
          <Search onSearch={handleSearch} />
          <ContactSearchResults
            onSelect={handleSelect}
            contacts={contacts}
            style={{ margin: "10px 0" }}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
