import React, { useEffect } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function Login(props) {
  const styles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleLogin,
    });

    google.accounts.id.renderButton(document.getElementById("loginBtn"), {
      theme: "outline",
    });
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

  return (
    <Container component="main" style={styles}>
      <h1>Sign In</h1>
      <div id="loginBtn"></div>
    </Container>
  );
}
