import { Contact } from "../../sdk/contacts";
import styles from "./contactSearchResults.module.css";
import { ContactSearchElement } from "../contactSearchElement/ContactSearchElement";
import React from "react";

export const ContactSearchResults = ({
  contacts,
  onSelect,
  style,
}: {
  contacts: Contact[];
  onSelect: Function;
  style: React.CSSProperties;
}) => {
  return (
    <div className={styles.container} style={style}>
      {contacts &&
        contacts.map((contact) => (
          <div onClick={() => onSelect(contact)}>
            <ContactSearchElement contact={contact} />
          </div>
        ))}
    </div>
  );
};
