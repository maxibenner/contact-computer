import { Field } from "../../context/fieldsContext";
import { Card } from "../card/Card";
import { Button } from "../button/Button";
import Image from "next/image";
import { MdArrowBack, MdEdit, MdSave, MdAdd } from "react-icons/md";
import { InlineEdit } from "../inlineEdit/InlineEdit";
import { ChangeEvent } from "react";
import { Contact } from "../../sdk/contacts";

export const ContactCard = ({
  fields,
  contact,
  onAdd,
  onCancel,
}: {
  fields: Field[];
  contact: Contact;
  onAdd: Function;
  onCancel: Function;
}) => {
  const handleFieldChange = ({ i, v }: { i: number; v: string }) => {};

  return (
    <Card style={{ marginTop: 100 }}>
      <div style={{ display: "flex", position: "relative" }}>
        <Button
          onClick={() => onCancel()}
          icon={<MdArrowBack />}
          style={{ position: "absolute", top: -45, left: -45 }}
        />
        <div
          style={{
            position: "relative",
            boxShadow: "2px 2px 0 #000",
            overflow: "hidden",
            display: "flex",
            width: "55px",
            height: "55px",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "2px solid black",
          }}
        >
          <Image
            src={contact.profileImgSrc}
            width={50}
            height={50}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>

        <h2
          style={{
            color: "black",
            fontSize: "2rem",
            marginTop: -3,
            marginLeft: 14,
            lineHeight: "2rem",
          }}
        >
          {contact.name}
        </h2>
      </div>

      {fields &&
        fields.map((field: Field, i: number) => {
          return (
            <div style={{ display: "flex", marginTop: "8px" }}>
              <InlineEdit
                value={field.value /*fields[i].value*/}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange({ i: i, v: e.target.value })
                }
                // onSave={(value: string) => handleFieldSave({ i, value })}
                iconStart={<MdEdit />}
                iconEnd={<MdSave />}
                onSave={() => console.log("tst")}
              />
            </div>
          );
        })}

      <Button
        onClick={() =>
          onAdd({
            name: "",
            categorie: "phone",
            value: "+1 (929) 353-8426",
            access: "public",
          })
        }
        style={{ width: "100%", marginTop: "8px" }}
        icon={<MdAdd />}
      />
    </Card>
  );
};
