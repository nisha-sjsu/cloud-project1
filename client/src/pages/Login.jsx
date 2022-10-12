import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Alert } from "reactstrap";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default function Login(props) {
  const styles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const [wrongPass, setWrongPass] = useState(false);

  useEffect(() => {
    /* global google */
    setTimeout(() => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleLogin,
        });
  
        google.accounts.id.renderButton(document.getElementById("loginBtn"), {
          theme: "outline",
        });
      }
    }, 500);
  }, []);
  let navigate = useNavigate();

  function handleLogin(response) {
    let path = "/upload";
    localStorage.setItem(
      "user",
      JSON.stringify(jwt_decode(response.credential))
    );
    props.logIn();
    navigate(path);
  }

  let [login, setLogin] = useState({
    email: "",
    password: "",
  });

  function setLoginInfo(e) {
    const { name, value } = e.target;
    setLogin((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function authenticate(e) {
    e.preventDefault();
    let response = await axios
      .post("/login", {
        email: login.email,
        password: login.password,
      })
      .then((res) => {
        if (res.status == 200 && res.data.length != 0) {
          setWrongPass(false);
          let path = "/upload";
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: login.email,
            })
          );
          props.logIn();
          navigate(path);
        } else setWrongPass(true);
      });
  }
  console.log("console")

  return (
    <Container component="main" style={styles}>
      <h1>Sign In</h1>
      <div id="loginBtn"></div>
      <div class="log-form">
        <h2>Login to your account</h2>
        <form className="form" onSubmit={authenticate}>
          <input
            type="email"
            name="email"
            onChange={setLoginInfo}
            placeholder="email"
          />
          <input
            type="password"
            name="password"
            onChange={setLoginInfo}
            placeholder="password"
          />
          {wrongPass ? <Alert color="danger">Account not found!</Alert> : null}
          <button type="submit" class="btn">
            Login
          </button>
          <a class="forgot" href="/register">
            New User? Register
          </a>
        </form>
      </div>
    </Container>
  );
}
