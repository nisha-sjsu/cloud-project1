import { Table, Button, Label, Input } from "reactstrap";
import { Modal, ModalBody, ModalHeader, FormGroup, Navbar, NavbarBrand } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Gallery() {
  const [filesData, setFilesData] = useState();
  const [open, setOpen] = useState(false);
  const [fileData, setFileData] = useState();
  const [fileSrc, setFileSrc] = useState();

  let user = localStorage.getItem("user");
  let email = JSON.parse(user).email;

  const getFiles = async () => {
    axios.get("/getFiles?email=" + email).then(function (response) {
      setFilesData(response.data);
    });
  };

  const fileHandler = (file) => {
    setFileSrc(file);
  };

  const inputHandler = (e) => {
    setFileData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const postUpdate = async () => {
    const data = new FormData();
    data.append("file", fileSrc);
    data.append("fileDesc", fileData.description);
    data.append("email", fileData.email);
    data.append("key", fileData.key);
    console.log(fileData);
    let response = await axios.post(
      "/postFile?filename=" + fileSrc.name + "&action=update",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    axios.get("/getFiles?email=" + email).then(function (response) {
      setFilesData(response.data);
    });
    setOpen(false);
  };

  const deleteFile = async (file) => {
    setFileData(file);
    let response = await axios.delete(
      "/deleteFile?key=" + file.key + "&&email=" + fileData.email
    );
    if(file.data.Status==200){
      axios.get("/getFiles?email=" + email).then(function (response) {
        setFilesData(response.data);
      });
    }
  };

  const createRow = (file) => {
    return (
      <>
        <tr>
          <td>{file.key}</td>
          <td>{file.creationDate}</td>
          <td>{file.modifiedDate}</td>
          <td>{file.description}</td>
          <td>{file.email}</td>
          <td>
            <a href={file.url} style={{ color: "black" }}>
              <FontAwesomeIcon icon={faFileArrowDown} size="2x" />
            </a>
          </td>
          <td
            onClick={() => {
              setOpen(true);
              setFileData(file);
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faEdit} size="2x" />
          </td>
          <td
            onClick={() => {
              deleteFile(file);
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faTrash} size="2x" />
          </td>
        </tr>
      </>
    );
  };

  return (
    <div>
      <Navbar color="dark" light expand="md">
          <NavbarBrand  style={{color:"white", cursor:"pointer"}} href="/upload">Upload</NavbarBrand>
          <a
          href="/"
          onClick={() => localStorage.clear()}
          style={{ color: "white" }}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
        </a>
      </Navbar>
      <Button style={{ margin: "40px" }} onClick={getFiles}>
        Get Files!
      </Button>

      {email == "srinishaa@gmail.com" ? (
        <h2 style={{ textAlign: "center" }}>Welcome Admin!</h2>
      ) : null}
      <Table style={{ margin: "20px" }}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Creation date</th>
            <th>Modified date</th>
            <th>File description</th>
            <th>Owner</th>
          </tr>
        </thead>
        {filesData ? filesData.map((file) => createRow(file)) : null}
      </Table>

      <Modal isOpen={open} toggle={() => setOpen(false)}>
        <ModalHeader>Edit file</ModalHeader>
        <ModalBody>
          <input
            type="file"
            id="file"
            name="file"
            onChange={(e) => fileHandler(e.target.files[0])}
          />
          <label htmlFor="file">browser files</label>
          {fileSrc ? " " + fileSrc.name : null}
        </ModalBody>
        <ModalBody>
          <FormGroup floating>
            <Input type="text" name="description" onChange={inputHandler} />
            <Label>File Description</Label>
          </FormGroup>
        </ModalBody>
        <ModalBody>
          <Button onClick={postUpdate}>Update</Button>
        </ModalBody>
      </Modal>
    </div>
  );
}
