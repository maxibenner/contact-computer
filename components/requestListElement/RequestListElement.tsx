import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import {
  MdCheck,
  MdOutlineClose
} from "react-icons/md";
import { ProfileContext } from "../../context/ProfileContext";
import { Request } from "../../sdk/db";
import { Button } from "../button/Button";
import styles from "./requestListElement.module.css";

export const RequestListElement = ({ data }: { data: Request }) => {
  const router = useRouter();
  const { declineContactRequest, acceptContactRequest } =
    useContext(ProfileContext);

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const handleAccept = async () => {
    setAcceptLoading(true);
    await acceptContactRequest(data.owner.id);
  };
  const handleDecline = async () => {
    setDeclineLoading(true);
    await declineContactRequest(data.id);
  };
  const handleRoute = () => {
    router.push(`/contact-page?u=${data.owner.id}&o=/contacts`);
  };

  return (
    <div tabIndex={0} className={styles.container} onClick={handleRoute}>
      <div className={styles.contentContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={data.owner?.img_src}
            width={50}
            height={50}
            objectFit="cover"
          />
        </div>
        <h3 className={styles.name}>
          {data.owner?.name + " " + data.owner?.surname}
        </h3>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          loading={acceptLoading}
          icon={<MdCheck />}
          onClick={handleAccept}
        />
        <Button
          loading={declineLoading}
          icon={<MdOutlineClose />}
          backgroundColor="var(--color-error)"
          onClick={() => handleDecline()}
        />
      </div>
    </div>
  );
};
