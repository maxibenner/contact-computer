import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import { MdAdd, MdArrowBack, MdGroupAdd, MdOutlineClose } from "react-icons/md";
import {
  AddressData,
  ContactType,
  DataType,
  Relationship,
  SingleLineData,
  TransformedConnectionType
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
  user,
}: {
  contact: ContactType & { contact: TransformedConnectionType[] };
  style?: CSSProperties;
  backHref: string;
  relationship: Relationship;
  onSendContactRequest: () => void;
  contactRequestLoading: boolean;
  pendingContactRequest: boolean;
  user: User | null;
}) => {
  const router = useRouter();

  // Toggle add dropdown
  const [dropdownToggle, setDropdownToggle] = useState(false);

  // Local copy of contact data and keep updated
  const [localContact, setLocalContact] = useState<ContactType>(contact);
  useEffect(() => setLocalContact(contact), [contact]);

  // Track if a field is currently being edited
  const [activeEdit, setActiveEdit] = useState(false);

  // LOADING STATES
  const [isProfileImage, setIsProfileImage] = useState(false);

  // Add new field to local data copy
  const handleAddData = (type: DataType) => {
    if (user) {
      // Set to active editing
      setActiveEdit(true);

      // Create copy of data
      const contactCopy = { ...localContact };

      // Create arbitrary id to facilitate cancel operation
      const randomId = (Math.random() * 99999999).toFixed(0) + "_local";
      console.log(randomId);

      // Push cappropriate data
      if (type === "address") {
        contactCopy.address.push({
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
        } as AddressData & { startEditing: boolean });
      } else
        contactCopy[type].push({
          id: randomId,
          label: "",
          value: "",
          access: "public",
          startEditing: true,
          owner_id: user.id,
        } as SingleLineData & { startEditing: boolean });

      // Close add field dropdown
      setDropdownToggle((prev) => !prev);

      // Update local data copy
      setLocalContact(contactCopy);
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

  return (
    <Card style={style}>
      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", marginBottom: "25px" }}>
          <div className={styles.imageContainer}>
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
            <div style={{ display: isProfileImage ? "none" : "unset" }}>
              <Spinner />
            </div>
          </div>
          <h1
            style={{ fontSize: "2.8rem", margin: 0 }}
          >{`${localContact.name} ${localContact.surname}`}</h1>
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
                />
              ))}
            </>
          )}
          {localContact.phone.length === 0 &&
            localContact.email.length === 0 &&
            localContact.web.length === 0 &&
            localContact.address.length === 0 && (
              <NoDataPlaceholder text="No Data" />
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
            {relationship !== "follower" && relationship !== "requesting" && (
              <Button
                onClick={onSendContactRequest}
                text={"Request access"}
                iconStyle={{ fontSize: "2.6rem" }}
                style={{ marginTop: "25px" }}
                icon={<MdGroupAdd />}
                loading={contactRequestLoading}
                inactive={pendingContactRequest}
              />
            )}
            {relationship === "requesting" && (
              <Button
                style={{ marginTop: "25px" }}
                inactive
                text="Request pending"
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
};
