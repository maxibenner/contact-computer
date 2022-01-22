import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import { ProfileContext } from "../../context/ProfileContext";
import { Request, TransformedConnectionType } from "../../sdk/db";
import { Button } from "../button/Button";
import styles from "./contactListElement.module.css";

export const ContactListElement = ({
  data,
  onClick,
  requests,
}: {
  data: TransformedConnectionType;
  onClick?: () => void;
  requests: Request[];
}) => {
  const { profile, sendContactRequest, reloadData } =
    useContext(ProfileContext);

  const [requestLoading, setRequestLoading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  useEffect(() => {
    checkForPendingRequest();
  }, [profile]);

  // Check for pending requests
  const checkForPendingRequest = () => {
    if (profile) {
      for (let i = 0; i < profile.requests_sent.length; i++) {
        if (profile.requests_sent[i].recipient_id === data.contact.id) {
          setPendingRequest(true);
          break;
        } else setPendingRequest(false);
      }
    }
  };

  const handleSendRequest = async () => {
    setRequestLoading(true);
    await sendContactRequest(data.contact.id);
    await reloadData();
    setRequestLoading(false);
  };

  // const [relationship, setRelationship] = useState(false);
  // useEffect(() => {
  //   console.log(data.contact_follows)
  //   const rs = checkRelationshipWithoutLoop(profile, data);
  // }, [profile, data]);

  // // Check if there is currently a. incoming request and hit contact accordingly
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
            src={data.contact.img_src}
            width={50}
            height={50}
            objectFit="cover"
          />
        </div>
        <h3 className={styles.name}>
          {data.contact.name + " " + data.contact.surname}
        </h3>
      </div>
      <div className={styles.buttonContainer}>
        {!data.follows_contact && (
          <Button
            inactive={pendingRequest}
            icon={<MdGroupAdd />}
            loading={requestLoading}
            onClick={handleSendRequest}
          />
        )}
      </div>
    </div>
  );
};
