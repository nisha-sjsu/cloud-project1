import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Upload from "./pages/Upload"
import { useEffect, useState } from "react";
import Gallery from './pages/Gallery';
import Register from "./pages/Register";

function App() {

  const [userLogged, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("userLogged"))
  );

  useEffect(() => {
    localStorage.setItem("userLogged", JSON.stringify(userLogged));
  }, [userLogged]);

  const logIn = () => setUserLogged(true);
  const logOut = () => setUserLogged(false);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login logIn={logIn} />} />
          <Route exact path='/register' element={<Register logIn={logIn} />} />
          <Route exact path='/upload' element={userLogged ? <Upload /> : <Login logIn={logIn} logOut={logOut} />} />
          <Route exact path='/gallery' element={userLogged ? <Gallery /> : <Login logIn={logIn} logOut={logOut} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
