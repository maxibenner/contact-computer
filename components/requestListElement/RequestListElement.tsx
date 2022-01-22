import Image from "next/image";
import { useContext, useState } from "react";
import {
  MdCheck,
  MdOutlineClose,
  MdOutlineFavorite,
  MdWork,
} from "react-icons/md";
import { ProfileContext } from "../../context/ProfileContext";
import { Access, Request } from "../../sdk/db";
import { Button } from "../button/Button";
import { Dropdown } from "../dropdown/Dropdown";
import styles from "./requestListElement.module.css";
import { useRouter } from "next/router";

export const RequestListElement = ({ data }: { data: Request }) => {
  const router = useRouter();
  const { declineContactRequest, acceptContactRequest } =
    useContext(ProfileContext);

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const handleAccept = async (access: Access) => {
    setAcceptLoading(true);
    await acceptContactRequest(data.id, access);
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
        <Dropdown
          loading={acceptLoading}
          position="left"
          icon={<MdCheck />}
          iconActive={<MdOutlineClose />}
        >
          <Button
            icon={<MdOutlineFavorite />}
            onClick={() => handleAccept("friends")}
          />
          <Button icon={<MdWork />} onClick={() => handleAccept("contacts")} />
        </Dropdown>

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
