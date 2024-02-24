import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "scenic-sphere-339705.firebaseapp.com",
  projectId: "scenic-sphere-339705",
  storageBucket: "scenic-sphere-339705.appspot.com",
  messagingSenderId: "11120779697",
  appId: "1:11120779697:web:5d5d36c72d8e97732ddd90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export function Stater() {
  const [authState, setAuthState] = useState();

  useEffect(() => {
    document.querySelector(".sign").innerHTML = "Loading...";
    getAuth().onAuthStateChanged((user) => {
      let some = document.querySelectorAll('[class*="logged"]');
      if (user) {
        document.querySelector(".sign").style.display = "none";
        for (let i = 0; i < some.length; i++) {
          // some[i].classList.remove("displayNoner");
          // some[i].classList.add("displayUnsetter");
          some[i].style.display = "unset";
        }
        document.querySelector("#displayName").innerHTML = user.displayName;
        //console.log(user.displayName);
      } else {
        document.querySelector(".sign").style.display = "";
        for (let i = 0; i < some.length; i++) {
          some[i].style.display = "none";
        }
        document.querySelector(".sign").innerHTML = `<a>Login</a>`;
      }
    });
    // document.querySelector(".sign").innerHTML = authState;
  }, [authState]);

  this.signInWithGoogle = () => {
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        setAuthState();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  this.signOutWithGoogle = () => {
    getAuth()
      .signOut()
      .then(() => {
        setAuthState();
        window.location = "/";
      })
      .catch((e) => console.log(e));
  };
}

export default db;
