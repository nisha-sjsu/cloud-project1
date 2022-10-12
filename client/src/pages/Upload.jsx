import img from "./image.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Uploading from "../components/Uploading";
import Uploaded from "../components/Uploaded";
import { Navbar, NavbarBrand } from "reactstrap";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ImageContainer = (props) => {
  const [fileSrc, setFileSrc] = useState();
  const [isUploading, setIsUploading] = useState();
  const [uploaded, setUploaded] = useState();
  const [url, setUrl] = useState("");

  const buttonHandler = (img) => {
    setFileSrc(img);
  };

  const addFile = async () => {
    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", fileSrc);
      data.append("user", localStorage.getItem("user"));
      let response = await axios.post(
        "/postFile?filename=" + fileSrc.name,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUrl(response.data.cdnUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploaded(true);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!fileSrc) return;
    addFile();
  }, [fileSrc]);

  return (
    <>
      {" "}
      <Navbar color="dark" light expand="md">
        <NavbarBrand
          style={{ color: "white", cursor: "pointer" }}
          href="/gallery"
        >
          File Gallery
        </NavbarBrand>
        <a
          href="/"
          onClick={() => {
            localStorage.clear();
            props.logOut();
          }}
          style={{ color: "white" }}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
        </a>
      </Navbar>
      <div className="img-content">
        <header>
          <h1>Upload your file</h1>
        </header>
        <div
          className="img-uploader"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFileSrc(e.dataTransfer.files[0]);
          }}
        >
          <img src={img} />
          <p className="">Drag & Drop your file here</p>
        </div>

        <p className="or">or</p>
        <input
          type="file"
          id="file"
          name="file"
          onChange={(e) => buttonHandler(e.target.files[0])}
        />
        <label htmlFor="file">browser files</label>

        {isUploading && !uploaded ? <Uploading /> : null}
        {uploaded && <Uploaded url={url} fileSrc={fileSrc} />}
      </div>
    </>
  );
};

export default ImageContainer;
