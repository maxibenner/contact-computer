import styles from "./contactSearchResults.module.css";
import { ContactSearchElement } from "../contactSearchElement/ContactSearchElement";
import React from "react";

export const ContactSearchResults = ({
  contacts,
  onSelect,
  style,
}: {
  contacts: any[];
  onSelect: Function;
  style: React.CSSProperties;
}) => {
  return (
    <div className={styles.container} style={style}>
      {contacts &&
        contacts.length > 0 &&
        contacts.map((contact) => (
          <div key={contact.id} onClick={() => onSelect(contact)}>
            <ContactSearchElement contact={contact} />
          </div>
        ))}
    </div>
  );
};
