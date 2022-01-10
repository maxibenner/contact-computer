import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Border } from "../components/border/Border";
import React, { useState, useContext } from "react";
import { FieldsContext } from "../context/fieldsContext";
import { Logo } from "../components/logo/Logo";
import { ContactCard } from "../components/contactCard/ContactCard";
import { Search } from "../components/search/Search";
import { ContactSearchResults } from "../components/contactSearchResults/ContactSearchResults";
import { Contact } from "../sdk/contacts";

const Home: NextPage = () => {
  const { fields, addField } = useContext(FieldsContext);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);

  const handleSelect = (contact: Contact) => {
    setContacts([]);
    setSelected(contact);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Computer</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Border />
      <main className={styles.main}>
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <Logo />
        </div>
        {selected ? (
          <ContactCard
            onCancel={() => setSelected(null)}
            onAdd={addField}
            fields={fields}
            contact={selected}
          />
        ) : (
          <div style={{ width: "90%", maxWidth: "400px" }}>
            <Search onResult={setContacts} />
            <ContactSearchResults
              onSelect={handleSelect}
              contacts={contacts}
              style={{ marginTop: "10px" }}
            />
          </div>
        )}
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
