import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ContactCard } from "../components/contactCard/ContactCard";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { ProfileContext } from "../context/ProfileContext";
import { Access, ContactType, db_getContact, Relationship } from "../sdk/db";
import styles from "../styles/Home.module.css";
import { checkRelationship } from "../utils/checkRelationship";

export default function ContactPage() {
  const router = useRouter();

  // Notifications
  const [notification, setNotification] = useContext(NotificationContext);

  // User & profile functions
  const user = useContext(AuthContext);
  const { profile, sendContactRequest, changeContactAccess, removeConnection } =
    useContext(ProfileContext);

  // Get contact from query
  const [contact, setContact] = useState<ContactType>();
  useEffect(() => {
    const queryId = router.query.u;
    if (queryId && typeof queryId === "string") {
      db_getContact(queryId).then(({ data, error }) => {
        if (data) {
          // Set contacts
          setContact(data);
        }
      });
    }
  }, [user, router]);

  // Check for relationship between authenticated user and contact
  const [relationship, setRelationship] = useState<Relationship>(undefined);
  useEffect(() => {
    if (contact && profile) {
      setRelationship(checkRelationship(profile, contact.id));
    }
  }, [contact, profile]);

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
  // const [pendingRequest, setPendingRequest] = useState(false);
  // useEffect(() => {
  //   checkForPendingRequest();
  // }, [contact]);
  // const checkForPendingRequest = () => {
  //   if (contact) {
  //     for (let i = 0; i < contact.requests_received.length; i++) {
  //       if (contact.requests_received[i].recipient_id === contact.id) {
  //         setPendingRequest(true);
  //         break;
  //       }
  //     }
  //   }
  // };

  // Handle change contact access
  const [
    onRemoveConnectionLoadingUnfollow,
    setOnRemoveConnectionLoadingUnfollow,
  ] = useState(false);
  const handleRemoveConnection = async (id: number) => {
    setOnRemoveConnectionLoadingUnfollow(true);
    await removeConnection(id);
    setOnRemoveConnectionLoadingUnfollow(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Ask the computer anything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {contact && (
          <ContactCard
            style={{ margin: "10vh 35px 70px 35px" }}
            backHref={typeof router.query.o === "string" ? router.query.o : "/"}
            contact={contact}
            user={user ? user : null}
            relationship={relationship}
            contactRequestLoading={contactRequestLoading}
            onSendContactRequest={handleSendContactRequest}
            onRemoveConnection={handleRemoveConnection}
            onRemoveConnectionLoadingUnfollow={
              onRemoveConnectionLoadingUnfollow
            }
          />
        )}
      </main>
    </div>
  );
}
