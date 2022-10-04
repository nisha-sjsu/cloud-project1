import { useState } from "react";
import Alert from "../components/Alert";

const ImageAfterUpload = ({ url, fileSrc }) => {
  const imgUrl = url;

  const onClick = () => {
    navigator.clipboard.writeText(imgUrl);
    setCopyAlert(true);
  };

  const [copyAlert, setCopyAlert] = useState(false);

  return (
    <div className="after-image-contaner">
      {url !== undefined ? (
        <>
          <span className="material-icons sucess-icon">check_circle</span>
          <p className="sucess-text">uploaded successfully!</p>
          {fileSrc!=null && fileSrc.type.split('/')[0] != 'image'? null : <img src={imgUrl} width="100%" alt="image" className="img" />}
          <div className="url-contant">
            <input
              type="url"
              name="copyImage"
              className="image-url"
              readOnly
              value={imgUrl}
              onClick={onClick}
            />
            {copyAlert ? <Alert /> : null}
          </div>
        </>
      ) : (
        <>
          <span class="material-icons error-icon">error</span>
          <p className="error-text">something went wrong please try again!!!</p>
          <a className="try-btn" href="/">
            Try Again!
          </a>
        </>
      )}
    </div>
  );
};
export default ImageAfterUpload;
