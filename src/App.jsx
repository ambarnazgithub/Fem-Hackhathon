import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Signup } from "./pages";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./Config"; 

function App() {
  const [user, setUser] = useState("no-user");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  if (user === "no-user") 
    return <h1>Loading...</h1>;
  if (process.env.NODE_ENV !== "production") {
    console.warn = (message) => {
      if (!message.includes('Support for defaultProps will be removed')) {
        console.info(message);
      }
    };
  }
  
  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/Login" />} />
      <Route path="/Login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/Signup" element={!user ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
