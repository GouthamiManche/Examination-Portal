import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";

function ResultFetch() {
  let { pin } = useParams();
  let { email } = useParams();
  const [answers, setAnswers] = useState(() => []);
  const [selectedAnswers, setSelectedAnswers] = useState(() => []);
  const [score, setScore] = useState(0);
  const [studInfo, setStudInfo] = useState(() => []);
  const [click, setClick] = useState(false);

  useEffect(async () => {
    const getAnswers = async () => {
      const settersCollectionRef = collection(
        db,
        "Paper_Setters",
        pin.toString(),
        "Question_Papers_MCQ"
      );
      const docos = await getDocs(settersCollectionRef);
      const docosData = docos.docs.map((docs) => docs.data());
      setAnswers(docosData[1]["answer_answer"].map((doc) => doc));
    };

    const getSelectedAnswers = async () => {
      await getDoc(
        doc(db, "Paper_Setters", pin.toString(), "Responses", email)
      ).then((something) => {
        if (something.exists) {
          setSelectedAnswers(something.data()["selected_answers"]);
          setStudInfo(something.data()["stud_info"]);
        } else {
          alert("Please enter all details");
        }
      });
    };

    await getAnswers();
    await getSelectedAnswers();
  }, []);

  useEffect(() => {
    setScore(0);
    for (let i = 0; i < answers.length; i++) {
      if (
        parseInt(answers[i]["answer"]) ===
        parseInt(selectedAnswers[i]["selectedAnswer"])
      ) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  }, [selectedAnswers]);

  useEffect(() => {
    getAuth().onAuthStateChanged(function (user) {
      if (user) {
        setDoc(
          doc(db, "Users", user.uid, "Exams_Attempted", pin),
          {
            score: `${score}/${answers.length}`,
          },
          { merge: true }
        );
        setDoc(
          doc(db, "Paper_Setters", pin, "Responses", user.email),
          {
            score: `${score}/${answers.length}`,
          },
          { merge: true }
        );
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }, [score,answers]);

  return (
    <div id="mainForm">
      <p className="centeredP">Test Submitted Successfully</p>
      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Get Result"
          onClick={() => setClick(true)}
        />
      </div>

      {click && (
        <div className="mainForm">
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
                  <td>{studInfo["name"]}</td>
                  <td>{studInfo["class"]}</td>
                  <td>{studInfo["roll_no"]}</td>
                  <td>{studInfo["email"]}</td>
                  <td>
                    {score}/{answers.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultFetch;
