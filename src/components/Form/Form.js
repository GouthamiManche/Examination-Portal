import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams } from "react-router-dom";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";

function Form() {
  const [questions, setQuestions] = useState(() => []);
  // const [options, setOptions] = useState(() => [{}]);
  const [title, setTitle] = useState();
  const [selectedList, setSelectedList] = useState(() => [{}]);
  const [studInfo, setStudInfo] = useState(() => {});
  const [status, setStatus] = useState(() => "");

  let { pin } = useParams();

  useEffect(() => {
    async function f() {
      // console.log(Object.keys(selectedList[0]).length);
      if (Object.keys(selectedList[0]).length !== 0) {
        // console.log(studInfo);
        await setDoc(
          doc(
            db,
            "Paper_Setters",
            pin.toString(),
            "Responses",
            studInfo["email"]
          ),
          {
            stud_info: studInfo,
            selected_answers: selectedList,
          }
        );
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin),
              {
                quiz_title: title,
                name: studInfo["name"],
                class: studInfo["class"],
                roll_no: studInfo["roll_no"],
                email_id: studInfo["email"],
              },
              { merge: true }
            );
          } else {
            console.log("Something Went Wrong!");
          }
        });

        window.location.href += `/ResultFetch/${studInfo["email"]}`;
      } else {
        //console.log("Jhol");
      }

      const attemptPromise = new Promise((res, rej) => {
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            const check = await getDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin)
            );
            // console.log(check.data());
            if (check.data() === undefined) {
              //console.log("Not Attempted");
              res(false);
            } else {
              //console.log("Already Attempted");
              res(true);
            }
          }
        });
      });

      async function attemptChecker() {
        let some = await Promise.resolve(attemptPromise);
        //console.log(some);
        return some;
      }

      // async function statusChecker() {

      // }

      const getQuestions = async () => {
        //function to get Question Paper
        const settersCollectionRef = collection(
          //Path to Question Papers Collection
          db,
          "Paper_Setters",
          pin.toString(),
          "Question_Papers_MCQ"
        );
        const docos = await getDocs(settersCollectionRef); //Getting all documents inside Question Papers Collection
        if (Object.keys(docos.docs).length !== 0) {
          //checks whether the Question Papers collection is empty
          // console.log(await attemptChecker());
          if ((await attemptChecker()) === true) {
            //calls attemptChecker() which checks if the user has already attempted the exam
            setQuestions("Already Attempted");
          } else {
            const docosData = docos.docs.map((docs, index) => {
              if (index === 0) {
                //checks index === 0 because the question paper always gets stored as the first document in the Question Papers collection
                setTitle(docs.id); //sets Quiz Title
              }
              return docs.data(); //returns question paper
            });
            setQuestions(docosData[0]["question_question"].map((doc) => doc)); //sets question paper
            setStatus(docosData[0]["status"]); //sets status already attempted or appearing for the first time
          }
        } else {
          setQuestions("Incorrect Pin"); //if Question Papers collection is empty
        }
      };

      getQuestions();
    }
    f();
  }, [selectedList, pin, studInfo]);

  useEffect(() => {
    //console.log(questions.length);
  }, [questions]);

  function onSubmit() {
    // setSelectedList([]);
    let count = 0;
    //console.log("Submitted");
    let infoBool = false;

    if (
      document.getElementById("studName").value !== "" &&
      document.getElementById("studRollNo").value !== "" &&
      document.getElementById("studClass").value !== ""
    ) {
      infoBool = true;
    }
    // console.log(count);

    for (let i = 0; i < questions.length; i++) {
      if (
        document.querySelector(
          `input[name="${i + 1}. ${questions[i].question}"]:checked`
        ) != null
      ) {
        count++;
        //console.log(count + " = " + questions.length);
        if (count === questions.length && infoBool) {
          let tempSelectedList = [];
          questions.map((q, cnt) =>
            tempSelectedList.push({
              selectedAnswer: document.querySelector(
                `input[name="${cnt + 1}. ${questions[cnt].question}"]:checked`
              ).value,
            })
          );
          setSelectedList(tempSelectedList);
          setStudInfo({
            name: document.getElementById("studName").value,
            email: getAuth().currentUser.email,
            roll_no: document.getElementById("studRollNo").value,
            class: document.getElementById("studClass").value,
          });
        } else {
          // handle incomplete response
          //alert("Incomplete");
        }
      }
      if (i === questions.length - 1) {
        if (!infoBool && count < questions.length) {
          alert("Please Enter Student Details and Attempt All Questions");
        } else if (count < questions.length) {
          alert("Please Attempt All Questions");
        } else if (!infoBool) {
          alert("Please Enter Student Details");
        }
      }
    }
  }

  return (
    <form id="mainForm">
      {questions.length !== 0 ? (
        questions !== "Incorrect Pin" ? (
          questions !== "Already Attempted" ? (
            status !== "inactive" ? (
              <div>
                <div className="quizBox">
                  <p id="quiz_title" className="faintShadow">
                    {title}
                  </p>
                </div>
                <ul className="stu_info">
                  <li>
                    Name:{" "}
                    <input
                      type="text"
                      id="studName"
                      className="studInfo faintShadow"
                      placeholder="Enter Name"
                    ></input>
                  </li>
                  <li>
                    Roll No:{" "}
                    <input
                      type="text"
                      id="studRollNo"
                      className="studInfo faintShadow"
                      placeholder="Enter Roll Number"
                    ></input>
                  </li>
                  <li>
                    Class:{" "}
                    <input
                      type="text"
                      id="studClass"
                      className="studInfo faintShadow"
                      placeholder="Enter Class"
                    ></input>
                  </li>
                </ul>
                {questions.map((question, questionIndex) => {
                  // console.log(question);
                  return (
                    <div key={uuid()}>
                      <p className="questionP">
                        {" "}
                        {questionIndex + 1}. {question.question}
                      </p>
                      {question.options.map((option, optionIndex) => {
                        // console.log(option);
                        // return <p key={uuid()}>{option["option"]}</p>;
                        return (
                          <div key={uuid()}>
                            <li key={uuid()} className="radioButtonsLi">
                              <input
                                key={uuid()}
                                id={
                                  questionIndex.toString() +
                                  optionIndex.toString()
                                }
                                type="radio"
                                className="radioInput"
                                value={optionIndex + 1}
                                name={`${questionIndex + 1}. ${
                                  question.question
                                }`}
                              />

                              <label
                                className="radioLabel faintShadow hov"
                                htmlFor={
                                  questionIndex.toString() +
                                  optionIndex.toString()
                                }
                              >
                                {option["option"]}
                              </label>
                            </li>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <div className="sub_btn">
                  <input
                    className="sub_btn_actual hov"
                    type="button"
                    value="Submit"
                    onClick={() => onSubmit()}
                  />
                </div>
              </div>
            ) : (
              <p className="centeredP">Creator has closed the responses!</p>
            )
          ) : (
            <p className="centeredP">You have already attempted this exam!</p>
          )
        ) : (
          <p className="centeredP">Incorrect Pin</p>
        )
      ) : (
        <p className="centeredP">Loading...</p>
      )}
    </form>
  );
}

export default Form;
