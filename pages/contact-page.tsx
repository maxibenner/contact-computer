import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ContactCard } from "../components/contactCard/ContactCard";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { ProfileContext } from "../context/ProfileContext";
import { ContactType, db_getContact, Relationship } from "../sdk/db";
import styles from "../styles/Home.module.css";
import { checkRelationship } from "../utils/checkRelationship";

export default function ContactPage() {
  const router = useRouter();

  // Notifications
  const [notification, setNotification] = useContext(NotificationContext);

  // User
  const user = useContext(AuthContext);

  // User profile
  const { profile, sendContactRequest } = useContext(ProfileContext);

  // Contact
  const [contact, setContact] = useState<ContactType>();
  useEffect(() => {
    loadContact();
  }, [profile]);

  const loadContact = async () => {
    const queryId = router.query.u;
    if (queryId && typeof queryId === "string") {
      const { data, error } = await db_getContact(queryId);
      if (data) setContact(data);
    }
  };

  // TODO
  // Check for relationship between user and selected contact
  const [relationship, setRelationship] = useState<Relationship>(null);
  useEffect(() => {
    const relationShip = checkRelationship(profile, contact);
    setRelationship(relationShip);
    console.log(relationship);
  }, [contact]);

  // Handle contact request
  const [contactRequestLoading, setContactRequestLoading] = useState(false);
  const handleSendContactRequest = async () => {
    if (profile && typeof profile.id === "string" && contact) {
      setContactRequestLoading(true);
      await sendContactRequest(contact.id);
      console.log("3. Stopped animation");
      setContactRequestLoading(false);
    } else
      setNotification({
        title: "Not signed in",
        description: "You need to create an account in order to add contacts.",
        type: "info",
        buttonText: "Ok",
      });
  };

  // Check for pending, outgoing requests
  const [pendingRequest, setPendingRequest] = useState(false);
  useEffect(() => {
    checkForPendingRequest();
  }, [contact]);
  const checkForPendingRequest = () => {
    if (contact) {
      for (let i = 0; i < contact.requests_received.length; i++) {
        if (contact.requests_received[i].recipient_id === contact.id) {
          setPendingRequest(true);
          break;
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {contact && profile && (
          <ContactCard
            style={{ margin: "10vh 35px 70px 35px" }}
            backHref={typeof router.query.o === "string" ? router.query.o : "/"}
            contact={contact}
            user={user ? user : null}
            relationship={relationship}
            contactRequestLoading={contactRequestLoading}
            onSendContactRequest={handleSendContactRequest}
            pendingContactRequest={pendingRequest}
          />
        )}
      </main>
    </div>
  );
}
