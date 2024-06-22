import React, { useEffect, useState } from "react";
import "../sass/shareStyle.scss";
import "../sass/Login.scss";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [isPopUp, setIsPopUp] = useState(false);

  const navigate = useNavigate();
  // const { state } = useLocation();

  const navigateToPage = (pageUrl, stateData) => {
    navigate(pageUrl, { state: stateData });
  };

  useEffect(() => {}, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const userRef = collection(db, "users");
    const roleQuery = query(
      userRef,
      where("username", "==", email),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(roleQuery);
    if (querySnapshot.empty) {
      console.log("false");
    } else {
      querySnapshot.forEach((doc) => {
        navigateToPage("/homepage", {
          userId: doc.id,
          userName: email,
        });
      });
    }
  };

  const handleCreateAccount = async () => {
    await addDoc(collection(db, "users"), {
      username: createEmail,
      password: createPassword,
    });
    setIsPopUp(false);
    setCreateEmail("");
    setCreatePassword("");
  };

  return (
    <div className="container">
      <div className="login__container">
        <div className="icon__container">
          <div className="icon__text">ccSmartHouse</div>
        </div>
        <div className="login__content">
          <div className="headline">Login</div>
          <div className="form">
            <div className="form__item">
              <div className="item__lable">Email</div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form__item">
              <div className="item__lable">Password</div>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form__btn" onClick={handleLogin}>
              <div className="btn__text">login now</div>
            </div>
            <div className="sign__text" onClick={() => setIsPopUp(true)}>
              Create new account
            </div>
          </div>
        </div>
      </div>
      {isPopUp ? (
        <div className="sign__up_container">
          <div className="sign__up_content">
            <div className="sign__up_headline">Create new</div>
            <div className="sign__up_form">
              <div className="form__item">
                <div className="item__lable">Email</div>
                <input
                  type="email"
                  placeholder="Email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                />
              </div>
              <div className="form__item">
                <div className="item__lable">Password</div>
                <input
                  type="password"
                  placeholder="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                />
              </div>
              <div className="form__btn" onClick={handleCreateAccount}>
                <div className="btn__text">sign up now</div>
              </div>
            </div>
            <div className="sign__up_icon" onClick={() => setIsPopUp(false)}>
              <FaTimes />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
