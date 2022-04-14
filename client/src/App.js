import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreatePost from "./Pages/CreatePost";
import Home from "./Pages/Home";
import Post from "./Pages/Post";
import Login from "./Pages/Login";
import PageNotFound from "./Pages/PageNotFound";
import Registration from "./Pages/Registration";
import Profile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setAuthState({
      username: "", id: 0, status: false
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/Login">Login</Link>
                  <Link to="/Registration">Registration</Link>
                </>
              ) : (
                <>
                <Link to="/"> Home </Link>
                <Link to="/CreatePost">CraetePost</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username}</h1>
              {authState.status && <button onClick={logout}> Logout</button>}
              )
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;