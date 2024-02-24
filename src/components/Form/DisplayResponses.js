import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';

function DisplayResponses() {
  let { pin } = useParams();
  const [studInfo, setStudInfo] = useState(() => []);
  const [score, setScore] = useState(() => []);
  useEffect(() => {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const some = await getDocs(
          collection(db, "Paper_Setters", pin, "Responses")
        );
        const somesome = some.docs.map((doc) => doc.data());
        somesome.length !== 0
          ? somesome.map((some) => {
              setScore((prevScore) => [...prevScore, some["score"]]);
              setStudInfo((prevStudInfo) => [
                ...prevStudInfo,
                some["stud_info"],
              ]);
              return some;
            })
          : setStudInfo(["Empty"]);
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }, [pin]);

  useEffect(() => {
    // console.log(score);
    // console.log(studInfo);
  }, [studInfo, score]);

  return (
    <div>
      {studInfo.length !== 0 ? (
        studInfo[0] !== "Empty" ? (
          studInfo.map((stu, index) => {
            // console.log(studInfo[0]);
            return (
              <div className="mainForm" key={uuid()}>
                <p className="leftMargin">Student Information :</p>
                <div className="centeredP">
                  <table className="responsesTable">
                    <tbody>
                      <tr className="thRow">
                        <th>Name</th>
                        <th>Class</th>
                        <th>Roll No</th>
                        <th>Email</th>
                        <th>Score</th>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr className="tdRow">
                        <td>{stu["name"]}</td>
                        <td>{stu["class"]}</td>
                        <td>{stu["roll_no"]}</td>
                        <td>{stu["email"]}</td>
                        <td>{score[index]}</td>
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
              <p className="centeredP">No Responses Yet!</p>
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

export default DisplayResponses;
