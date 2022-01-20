import { ChangeEvent, CSSProperties, useRef, useState } from "react";
import { MdPhoto } from "react-icons/md";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { ImageUploaderButton } from "../imageUploaderButton/ImageUploaderButton";
import { InputText } from "../inputText/InputText";
import { Spinner } from "../spinner/Spinner";

export const InitialSetupCard = ({
  style,
  onSubmit,
  isLoading,
}: {
  style?: CSSProperties;
  onSubmit: Function;
  isLoading: boolean;
}) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string | ArrayBuffer | null>(
    null
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => inputRef.current && inputRef.current.click();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      // Create image data url to display preview
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = function (e) {
        setImageDataUrl(reader.result);
      };

      // Pass form data for upload
      setImage(e.target.files[0]);
    }
  };
  const handleSubmit = () => {
    onSubmit({ name: name, surname: surname, image: image });
  };

  return (
    <Card style={style}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ImageUploaderButton
          style={{ width: "70px", height: "70px", marginBottom: "25px" }}
          iconStyle={{ fontSize: "2.8rem" }}
          icon={<MdPhoto />}
          backgroundImage={imageDataUrl}
          onClick={handleImageClick}
        />

        <div>
          <InputText
            onChange={setName}
            value={name}
            label="First Name"
            style={{ marginBottom: "6px" }}
          />
          <InputText
            onChange={setSurname}
            value={surname}
            label="Last Name"
            style={{ marginBottom: "25px" }}
          />
        </div>
      </div>
      <Button
        style={{ width: "100%" }}
        icon={isLoading && <Spinner />}
        text={!isLoading ? "Submit" : undefined}
        onClick={handleSubmit}
      />
      <input
        accept="image/jpg | image/jpeg | image/png"
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Card>
  );
};
