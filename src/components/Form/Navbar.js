import React, { useEffect } from "react";
import { Stater } from "../../services/firebaseConfig";

const Navbar = () => {
  const funct = new Stater();

  function selectOptionClickHandler(index) {
    switch (index) {
      case 1:
        window.location = `/ExamsAttempted`;
        break;
      case 2:
        window.location = `/ExamsCreated`;
        break;
      case 3:
        funct.signOutWithGoogle();
        break;
    }
  }

  useEffect(() => {
    activeHighlighter();
  }, [document.URL]);

  function activeHighlighter() {
    let some = document.querySelectorAll(".NavLink > a");
    for (let i = 0; i < some.length; i++) {
      if (window.location.href === some[i].href) {
        some[i].classList.add("active");
      } else {
        some[i].classList.remove("active");
      }
    }
  }

  return (
    <>
      <div className="Nav faintShadow">
        <ul className="navUl">
          <li className="NavLink">
            <a href="/">Home</a>
          </li>
          <li className="NavLink logged">
            <a href="/FormMaker">Create Exam</a>
          </li>
          <li className="NavLink logged">
            <a href="/pinverify">Start Exam</a>
          </li>
          <li className="sign" onClick={() => funct.signInWithGoogle()}></li>
        </ul>
        <select
          className="profile logged"
          value="DEFAULT"
          readOnly
          onChange={(change) =>
            selectOptionClickHandler(change.currentTarget.selectedIndex)
          }
        >
          <option
            className="logOptions"
            id="displayName"
            value="DEFAULT"
          ></option>
          <option
            className="logOptions"
            id="previousExams"
            value="previousExams"
            onClick={() => (window.location = `/ExamsAttempted`)}
          >
            Exams Attempted
          </option>
          <option
            className="logOptions"
            id="conductedExams"
            value="conductedExams"
            onClick={() => (window.location = `/ExamsCreated`)}
          >
            Exams Created
          </option>
          <option
            className="logOptions"
            id="select"
            value="Logout"
            onClick={() => funct.signOutWithGoogle()}
          >
            Logout
          </option>
        </select>
      </div>
    </>
  );
};

export default Navbar;
