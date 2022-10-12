import { useState } from "react";
import { Alert } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register(props) {
  const [wrongPass, setWrongPass] = useState(false);
  let [register, setRegistration] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function setRegistrationInfo(e) {
    const { name, value } = e.target;
    setRegistration((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  let navigate = useNavigate();
  async function authenticate(e) {
    e.preventDefault();
    if (register.password !== register.confirmPassword) setWrongPass(true);
    else {
      setWrongPass(false);
      let response = await axios
        .post("/register", {
          email: register.email,
          password: register.password,
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            let path = "/upload";
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: register.email
              })
            );
            props.logIn();
            navigate(path);
          }
        });
    }
  }

  return (
    <div>
      <div class="log-form">
        <h2>Register account</h2>
        <form className="form" onSubmit={authenticate}>
          <input
            type="email"
            name="email"
            onChange={setRegistrationInfo}
            placeholder="email"
          />
          <input
            type="password"
            name="password"
            onChange={setRegistrationInfo}
            placeholder="password"
          />
          <input
            type="password"
            name="confirmPassword"
            onChange={setRegistrationInfo}
            placeholder="password"
          />
          {wrongPass ? (
            <Alert color="danger">Passwords do not match!</Alert>
          ) : null}
          <button type="submit" class="btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
