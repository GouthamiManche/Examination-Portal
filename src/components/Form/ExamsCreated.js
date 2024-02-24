import React from 'react';
import {
  collection,
  //getDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";

function ExamsCreated() {
  const [createdExams, setCreatedExams] = useState(() => []);
  const [examPins, setExamPins] = useState(() => []);
  const [status, setStatus] = useState(() => []);

  useEffect(() => {
    examSetter();
  }, []);

  useEffect(() => {
  }, [status]);

  function examSetter() {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const some = await getDocs(
          collection(db, "Users", user.uid, "Exams_Created")
        );
        some.docs.length !==0
          ? some.docs.map((doc) => {
              let somo = doc.data();
              setCreatedExams((prevCreatedExams) => [
                ...prevCreatedExams,
                somo,
              ]);
              setExamPins((prevExamPins) => [...prevExamPins, doc.id]);
              setStatus((prevStatus) => [...prevStatus, somo["status"]]);
            })
          : setCreatedExams(["Empty"]);
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }

  async function checkResponses(index) {
    window.location = `ExamsCreated/DisplayResponses/${examPins[index]}`;
  }

  async function handleResponseStatus(soloStatus, index) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        if (soloStatus === "active") {
          if (
            window.confirm("Are you sure you want to stop responses ?") === true
          ) {
            await setDoc(
              doc(
                db,
                "Paper_Setters",
                examPins[index],
                "Question_Papers_MCQ",
                createdExams[index]["quiz_title"]
              ),
              {
                status: "inactive",
              },
              { merge: true }
            );

            await setDoc(
              doc(db, "Users", user.uid, "Exams_Created", examPins[index]),
              { status: "inactive" },
              { merge: true }
            );

            let stat = [...status];
            stat[index] = "inactive";
            setStatus(stat);
          }
        } else if (soloStatus === "inactive") {
          if (
            window.confirm("Are you sure you want to resume responses ?") ===
            true
          ) {
            await setDoc(
              doc(
                db,
                "Paper_Setters",
                examPins[index],
                "Question_Papers_MCQ",
                createdExams[index]["quiz_title"]
              ),
              {
                status: "active",
              },
              { merge: true }
            );

            await setDoc(
              doc(db, "Users", user.uid, "Exams_Created", examPins[index]),
              { status: "active" },
              { merge: true }
            );

            let stat = [...status];
            stat[index] = "active";
            setStatus(stat);
          }
        }
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }

  return (
    <div>
      {createdExams.length != 0 ? (
        createdExams[0] != "Empty" ? (
          createdExams.map((exam, index) => (
            <div className="mainForm" key={uuid()}>
              <p className="leftMargin">Exam Title: {exam["quiz_title"]}</p>
              <p className="leftMargin">Pin: {examPins[index]}</p>
              <input
                type="button"
                value="Check Responses"
                className="sub_btn_actual hov"
                onClick={() => checkResponses(index)}
              />
              <input
                type="button"
                value={
                  status[index] === "active"
                    ? "Stop Responses"
                    : "Resume Responses"
                }
                className="sub_btn_actual hov respo"
                onClick={() => handleResponseStatus(status[index], index)}
              />
            </div>
          ))
        ) : (
          <div className="mainForm">
            <p className="centeredP">No Exams Created Yet!</p>
          </div>
        )
      ) : (
        <div className="mainForm">
          <p className="centeredP">Loading...</p>
        </div>
      )}
      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Back"
          onClick={() => window.history.back()}
        />
      </div>
    </div>
  );
}

export default ExamsCreated;
