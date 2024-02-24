import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Stater } from "../services/firebaseConfig";
import React from 'react'

function Home() {
  const [user, setUser] = useState(false);
  const funct = new Stater();

  useEffect(() => {
    getAuth().onAuthStateChanged(function (user) {
      if (user) {
        // console.log(user);
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);

  useEffect(() => {}, [user]);

  return (
    <div className="mainForm heroBack faintShadow">
      <img
        className="hero"
        src={require("../images/pngwing.com (1).png")}
        alt="Hero Image"
      ></img>
      <div className="heroTextBox midShadow centeredP">
        <ul>
          <li>
            <h1 className="heroText">Exams Made Simpler</h1>
          </li>
          <li>
            <p className="sideKickText">
              With Examinator, the process of giving and taking exams feels
              seamless!
            </p>
          </li>
          <li>
            <p className="sideKickText">
              {user === true
                ? "Create your first exam below"
                : "Login below to start exploring"}
            </p>
          </li>
          <li>
            <input
              type="button"
              value={user === true ? "Create Exam" : "Login"}
              className="sub_btn_actual hov heroBtn"
              onClick={
                user === true
                  ? () => (window.location = "/FormMaker")
                  : () => funct.signInWithGoogle()
              }
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
