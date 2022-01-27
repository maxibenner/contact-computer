import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  ChangeEvent,
  CSSProperties,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MdAdd,
  MdArrowBack,
  MdGroupAdd,
  MdGroupOff,
  MdOutlineClose,
  MdOutlineFavorite,
  MdPublic,
  MdWork,
} from "react-icons/md";
import { ProfileContext } from "../../context/ProfileContext";
import {
  Access,
  AddressData,
  ContactType,
  DataType,
  Relationship,
  TransformedConnectionType,
} from "../../sdk/db";
import { AddressField } from "../addressField/AddressField";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Dropdown } from "../dropdown/Dropdown";
import { NoDataPlaceholder } from "../noDataPlaceholder/NoDataPlaceholder";
import { SingleLineField } from "../singleLineField/SingleLineField";
import { Spinner } from "../spinner/Spinner";
import styles from "./contactCard.module.css";

export const ContactCard = ({
  contact,
  style,
  backHref,
  relationship,
  onSendContactRequest,
  contactRequestLoading,
  pendingContactRequest,
  onChangeContactAccess,
  onChangeContactAccessLoading,
  onRemoveConnection,
  onRemoveConnectionLoadingRevoke,
  onRemoveConnectionLoadingUnfollow,
  user,
}: {
  contact: ContactType & { contact: TransformedConnectionType[] };
  style?: CSSProperties;
  backHref: string;
  relationship: Relationship;
  onSendContactRequest?: () => void;
  contactRequestLoading?: boolean;
  pendingContactRequest?: boolean;
  onChangeContactAccess?: (
    owner_id: string,
    contact_id: string,
    access: Access
  ) => void;
  onChangeContactAccessLoading?: boolean;
  onRemoveConnection?: (
    owner_id: string,
    contact_id: string,
    type: "unfollow" | "revoke_access"
  ) => void;
  onRemoveConnectionLoadingRevoke?: boolean;
  onRemoveConnectionLoadingUnfollow?: boolean;
  user?: User | null;
}) => {
  const router = useRouter();

  // Toggle add dropdown
  const [dropdownToggle, setDropdownToggle] = useState(false);

  // Access toggle
  const [accessDropdown, setAccessDropdown] = useState(false);

  // Context for profile image change
  const imgInputRef = useRef<HTMLInputElement>();

  // Profile context
  const { updateProfileImage } = useContext(ProfileContext);

  // Get access
  const [access, setAccess] = useState("public");
  useEffect(() => {
    if (contact && user) {
      for (let i = 0; i < contact.contact.length; i++) {
        if (
          contact.contact[i].contact.id === user.id &&
          contact.contact[i].contact_follows
        ) {
          setAccess(contact.contact[i].access);
        }
      }
    }
  }, [contact]);

  // Local copy of contact data and keep updated
  const [localContact, setLocalContact] = useState<ContactType>(contact);
  useEffect(() => setLocalContact(contact), [contact]);

  // Track if a field is currently being edited
  const [activeEdit, setActiveEdit] = useState(false);

  // LOADING STATES
  const [isProfileImage, setIsProfileImage] = useState(false);

  // Add new field to local data copy
  const handleAddData = (type: DataType) => {
    console.log(user);
    if (user) {
      // Set to active editing
      setActiveEdit(true);

      // Create arbitrary id to facilitate cancel operation
      const randomId = (Math.random() * 99999999).toFixed(0) + "_local";
      console.log(randomId);

      // Push cappropriate data
      if (type === "address") {
        setLocalContact({
          ...localContact,
          [type]: [
            ...localContact[type],
            {
              id: randomId,
              label: "",
              access: "public",
              street: "",
              city: "",
              state: "",
              postal: "",
              country: "",
              startEditing: true,
              owner_id: user.id,
            } as AddressData & { startEditing: boolean },
          ],
        });
      } else {
        setLocalContact({
          ...localContact,
          [type]: [
            ...localContact[type],
            {
              id: randomId,
              label: "",
              value: "",
              access: "public",
              startEditing: true,
              owner_id: user.id,
            },
          ],
        });
      }
      // Close add field dropdown
      setDropdownToggle((prev) => !prev);
    }
  };

  // LOCAL: Remove unsaved data from local copy
  const handleCancel = ({
    id,
    type,
  }: {
    id: number | string | null;
    type: "phone" | "email" | "web" | "address";
  }) => {
    if (!id) return console.log("There was a problem. Id is null.");

    const tmpContact = { ...localContact };

    // Get array of corresponding type
    const typeArray = tmpContact[type] as any[];

    // Remove passed field
    tmpContact[type] = typeArray.filter((e) => e.id !== id);

    // LOCAL: Update fields
    setLocalContact(tmpContact);

    // End active editing status
    setActiveEdit(false);
  };

  // For dropdown close
  const handleChangeContactAccess = (
    uid: string,
    contact_id: string,
    type: "contacts" | "friends"
  ) => {
    if (onChangeContactAccess) {
      setAccessDropdown((prev) => !prev);
      onChangeContactAccess(uid, contact_id, type);
    }
  };
  const handleRemoveContact = (
    contact_id: string,
    uid: string,
    type: "revoke_access" | "unfollow"
  ) => {
    if (onRemoveConnection) {
      if (type === "revoke_access") {
        setAccessDropdown((prev) => !prev);
        onRemoveConnection(contact_id, uid, "revoke_access");
      } else {
        onRemoveConnection(contact_id, uid, "unfollow");
      }
    }
  };

  const handleChangeImage = () => {
    imgInputRef.current?.click();
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      // Show loading spinner
      setIsUpdating(true);

      // Update image
      await updateProfileImage(e.target.files[0]);
      setIsUpdating(false);
    }
  };

  /* ANIMATION */
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      style={{ margin: "10px" }}
      animate={{ y: -10 }}
      transition={{ duration: 0.2 }}
      variants={variants}
    >
      <Card style={style}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", marginBottom: "25px" }}>
            <div
              className={
                relationship === "self"
                  ? styles.imageContainer_interactive
                  : styles.imageContainer
              }
              onClick={() => relationship === "self" && handleChangeImage()}
            >
              <div
                style={{
                  opacity: isProfileImage ? 1 : 0,
                  position: isProfileImage ? "relative" : "absolute",
                  width: "100%",
                  height: "100%",
                  transition: ".3s",
                }}
              >
                <Image
                  onLoadingComplete={() => setIsProfileImage(true)}
                  objectFit="cover"
                  layout="fill"
                  src={localContact.img_src}
                />
              </div>
              {/*Loading*/}
              <div style={{ display: isProfileImage ? "none" : "unset" }}>
                <Spinner />
              </div>
              {/*Updating*/}
              <div
                style={{
                  display: isUpdating ? "unset" : "none",
                  position: "absolute",
                }}
              >
                <Spinner />
              </div>
            </div>
            <h1
              style={{ fontSize: "2.8rem", margin: 0 }}
            >{`${localContact.name} ${localContact.surname}`}</h1>
          </div>
          {/* Actions */}

          <div className={styles.contactButtonContainer}>
            {(relationship === "following" || relationship === "none") && (
              <Button
                onClick={onSendContactRequest}
                text={pendingContactRequest ? "Pending" : "Follow"}
                iconStyle={{ fontSize: "2.6rem" }}
                icon={<MdGroupAdd />}
                loading={contactRequestLoading}
                inactive={pendingContactRequest}
                innerStyle={{ padding: "0 15px", width: "134px" }}
              />
            )}
            {(relationship === "following" || relationship === "full") && user && (
              <Dropdown
                innerButtonStyle={{ padding: "0 15px", width: "118px" }}
                text="Access"
                loading={onChangeContactAccessLoading}
                outsideToggle={accessDropdown}
                icon={access === "friends" ? <MdOutlineFavorite /> : <MdWork />}
              >
                {access === "friends" && (
                  <Button
                    text="Work"
                    innerStyle={{ padding: "0 15px" }}
                    onClick={() =>
                      handleChangeContactAccess(user.id, contact.id, "contacts")
                    }
                    icon={<MdWork />}
                  />
                )}
                {access === "contacts" && (
                  <Button
                    text="Friends"
                    innerStyle={{ padding: "0 15px" }}
                    onClick={() =>
                      handleChangeContactAccess(user.id, contact.id, "friends")
                    }
                    icon={<MdOutlineFavorite />}
                  />
                )}
                <Button
                  text="Public"
                  innerStyle={{ padding: "0 15px" }}
                  onClick={() =>
                    handleRemoveContact(user.id, contact.id, "revoke_access")
                  }
                  icon={<MdPublic />}
                  backgroundColor="var(--color-error)"
                  loading={onRemoveConnectionLoadingRevoke}
                />
              </Dropdown>
            )}
            {(relationship === "follower" || relationship === "full") &&
              user && (
                <Button
                  text="Unfollow"
                  innerStyle={{ padding: "0 15px", width: "134px" }}
                  onClick={() =>
                    handleRemoveContact(contact.id, user.id, "unfollow")
                  }
                  loading={onRemoveConnectionLoadingUnfollow}
                  icon={<MdGroupOff />}
                  backgroundColor="var(--color-grey)"
                />
              )}
          </div>
          {/* Data */}
          <div>
            {localContact.email.length > 0 && (
              <>
                <h1 style={{ margin: "20px 0 8px 0" }}>Email</h1>
                {localContact.email.map((email) => (
                  <SingleLineField
                    key={email.value}
                    type="email"
                    data={email}
                    onCancel={handleCancel}
                    editable={relationship === "self"}
                    self={relationship === "self"}
                    onSubmitEnd={() => setActiveEdit(false)}
                  />
                ))}
              </>
            )}
            {localContact.phone.length > 0 && (
              <>
                <h1 style={{ margin: "40px 0 8px 0" }}>Phone</h1>
                {localContact.phone.map((phone) => (
                  <SingleLineField
                    key={phone.value}
                    type="phone"
                    data={phone}
                    onCancel={handleCancel}
                    editable={relationship === "self"}
                    self={relationship === "self"}
                    onSubmitEnd={() => setActiveEdit(false)}
                  />
                ))}
              </>
            )}
            {localContact.web.length > 0 && (
              <>
                <h1 style={{ margin: "40px 0 8px 0" }}>Web</h1>
                {localContact.web.map((web) => (
                  <SingleLineField
                    key={web.value}
                    type="web"
                    data={web}
                    onCancel={handleCancel}
                    editable={relationship === "self"}
                    self={relationship === "self"}
                    onSubmitEnd={() => setActiveEdit(false)}
                  />
                ))}
              </>
            )}
            {localContact.address.length > 0 && (
              <>
                <h1 style={{ margin: "40px 0 8px 0" }}>Address</h1>
                {localContact.address.map((address) => (
                  <AddressField
                    key={address.street}
                    data={address}
                    onCancel={handleCancel}
                    editable={relationship === "self"}
                    self={relationship === "self"}
                    onSubmitEnd={() => setActiveEdit(false)}
                  />
                ))}
              </>
            )}
            {localContact.phone.length === 0 &&
              localContact.email.length === 0 &&
              localContact.web.length === 0 &&
              localContact.address.length === 0 && (
                <NoDataPlaceholder
                  style={{ marginTop: "25px" }}
                  text="No Data"
                />
              )}
          </div>
          {relationship === "self" ? (
            <Dropdown
              outsideToggle={dropdownToggle}
              inactive={activeEdit}
              icon={<MdAdd />}
              iconActive={<MdOutlineClose />}
              style={{ position: "absolute", top: -20, left: -20 }}
            >
              <Button
                onClick={() => handleAddData("phone")}
                innerStyle={{ padding: "0 15px" }}
                text="Phone"
              />
              <Button
                onClick={() => handleAddData("email")}
                innerStyle={{ padding: "0 15px" }}
                text="Email"
              />
              <Button
                onClick={() => handleAddData("web")}
                innerStyle={{ padding: "0 15px" }}
                text="Web"
              />
              <Button
                onClick={() => handleAddData("address")}
                innerStyle={{ padding: "0 15px" }}
                text="Address"
              />
            </Dropdown>
          ) : (
            <>
              {backHref && (
                <Button
                  onClick={() => router.push(backHref)}
                  icon={<MdArrowBack />}
                  style={{ position: "absolute", top: -20, left: -20 }}
                />
              )}
            </>
          )}
        </div>
        <input
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={imgInputRef as any}
          type="file"
        />
      </Card>
    </motion.div>
  );
};
