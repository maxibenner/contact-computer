import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import { ProfileContext } from "../../context/ProfileContext";
import { Request, TransformedConnectionType } from "../../sdk/db";
import { Button } from "../button/Button";
import styles from "./contactListElement.module.css";
import { Relationship } from "../../sdk/db";

export const ContactListElement = ({
  contact,
  onClick,
  requests,
}: {
  contact: TransformedConnectionType;
  onClick?: () => void;
  requests: Request[];
}) => {
  const { profile, sendContactRequest, reloadData } =
    useContext(ProfileContext);

  // Contact request is loading
  const [requestLoading, setRequestLoading] = useState(false);

  const handleSendRequest = async () => {
    setRequestLoading(true);
    await sendContactRequest(contact.contact.id);
    await reloadData();
    setRequestLoading(false);
  };

  // Check for relationship between user and selected contact
  const [relationship, setRelationship] = useState<Relationship>(undefined);
  useEffect(() => {
    if (profile && contact) {
      let newRelationship = null;
      if (contact.contact_follows && contact.follows_contact) {
        newRelationship = "full";
      } else {
        if (contact.contact_follows) newRelationship = "follower";
        if (contact.follows_contact) newRelationship = "following";
        for (let i = 0; i < profile.requests_sent.length; i++) {
          if (profile.requests_sent[i].recipient_id === contact.contact.id) {
            newRelationship = "requesting";
          }
        }
      }
      setRelationship(newRelationship as Relationship);
    }
  }, [contact]);

  // Only return if relationship has been set
  if (!relationship) return null;

  // Return prematurely if request is pending in order to not double up contact and request
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].recipient_id === profile?.id) {
      return null;
    }
  }

  return (
    <div tabIndex={0} className={styles.container}>
      <div className={styles.contentContainer} onClick={onClick}>
        <div className={styles.imgContainer}>
          <Image
            src={contact.contact.img_src}
            width={50}
            height={50}
            objectFit="cover"
          />
        </div>
        <h3 className={styles.name}>
          {contact.contact.name + " " + contact.contact.surname}
        </h3>
      </div>
      <div className={styles.buttonContainer}>
        {(relationship === "following" || relationship === "requesting") && (
          <Button
            inactive={relationship === "requesting"}
            icon={<MdGroupAdd />}
            loading={requestLoading}
            onClick={handleSendRequest}
          />
        )}
      </div>
    </div>
  );
};