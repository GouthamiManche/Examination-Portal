import { collection, getDocs } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import React from 'react';

function ExamsAttempted() {
  const [examAttempts, setExamAttempts] = useState(() => []);

  useEffect(() => {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const some = await getDocs(
          collection(db, "Users", user.uid, "Exams_Attempted")
        );
        some.docs.length !== 0
          ? some.docs.map((doc) => {
              setExamAttempts((prevExamAttempts) => [
                ...prevExamAttempts,
                doc.data(),
              ]);
            })
          : setExamAttempts(["Empty"]);
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }, []);

  useEffect(() => {
  }, [examAttempts]);

  return (
    <div>
      {examAttempts.length !== 0 ? (
        examAttempts[0] !== "Empty" ? (
          examAttempts.map((attempt) => {
            return (
              <div className="mainForm" key={uuid()}>
                <div className="centeredP">
                  <table className="responsesTable">
                    <tbody>
                      <tr className="thRow">
                        <th>Exam Title</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Roll No</th>
                        <th>Email</th>
                        <th>Score</th>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr className="tdRow">
                        <td>{attempt["quiz_title"]}</td>
                        <td>{attempt["name"]}</td>
                        <td>{attempt["class"]}</td>
                        <td>{attempt["roll_no"]}</td>
                        <td>{attempt["email_id"]}</td>
                        <td>{attempt["score"]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="mainForm">
              <p className="centeredP">No Exams Attempted Yet!</p>
            </div>
          </>
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

export default ExamsAttempted;
