import styles from "./contactListElement.module.css";
import Image from "next/image";
import {
  MdCheck,
  MdAdd,
  MdOutlineFavorite,
  MdWork,
  MdOutlineClose,
} from "react-icons/md";
import { Button } from "../button/Button";
import { Dropdown } from "../dropdown/Dropdown";

export const ContactListElement = ({
  contact,
  onAccept,
  onDecline,
  onUpdate,
  onRequest,
}: {
  contact: any;
  onAccept?: (access: "friends" | "contacts") => void;
  onDecline?: () => void;
  onUpdate?: () => void;
  onRequest?: () => void;
}) => {
  return (
    <div tabIndex={0} className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={contact.img_src}
            width={50}
            height={50}
            objectFit="cover"
          />
        </div>
        <h3 className={styles.name}>{contact.name + " " + contact.surname}</h3>
      </div>
      <div className={styles.buttonContainer}>
        <Dropdown
          position="left"
          icon={<MdCheck />}
          iconActive={<MdOutlineClose />}
        >
          <Button
            icon={<MdOutlineFavorite />}
            onClick={() => onAccept && onAccept("friends")}
          />
          <Button
            icon={<MdWork />}
            onClick={() => onAccept && onAccept("contacts")}
          />
        </Dropdown>
        <Button
          icon={<MdOutlineClose />}
          backgroundColor="var(--color-error)"
          onClick={onDecline}
        />
      </div>
    </div>
  );
};
