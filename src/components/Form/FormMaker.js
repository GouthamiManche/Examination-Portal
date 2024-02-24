import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';

function FormMaker() {
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState([
    { id: uuid(), question: "", answer: null },
  ]);
  const [optionList, setOptionList] = useState([
    [
      { id: uuid(), option: "", optionNo: 1 },
      { id: uuid(), option: "", optionNo: 2 },
    ],
  ]);

  useEffect(() => {}, [optionList]);

  function numHandler(event, index) {
    let pattern = new RegExp("[^0-" + optionList[index].length + "]");
    if (event.key.match(pattern) || event.target.value.length >= 1) {
      event.preventDefault();
    }
  }

  function handleAddQuest() {
    // console.log(list);
    // console.log(Math.floor(100000 + Math.random() * 999999));
    let values = [...optionList];
    values.push([
      { id: uuid(), option: "", optionNo: 1 },
      { id: uuid(), option: "", optionNo: 2 },
    ]);
    setOptionList(values);
    setList([...list, { id: uuid(), question: "", answer: null }]);
  }

  function handleRemoveQuest(index) {
    let values = [...list];
    let valuess = values.filter((item, itemIndex) => itemIndex !== index);
    let optValues = [...optionList];
    //console.log(optValues);
    optValues.splice(index, 1);
    //console.log(optValues);
    setOptionList(optValues);
    setList(valuess);
  }

  function handleAddOpt(index, ind) {
    let values = [...optionList];
    values[index].push({
      id: uuid(),
      option: "",
      optionNo: ind,
    });
    setOptionList(values);
  }

  function handleRemoveOpt(i, ii) {
    let values = [...optionList];
    //console.log(values);
    values[i].splice(ii, 1);
    //console.log(values);
    setOptionList(values);
  }

  function questChangeHandler(event, i, where) {
    let values = [...list];
    values[i][where] = event.target.value;
    setList(values);
    // console.log(list);
  }

  function optionChangeHandler(event, i, ii) {
    let values = [...optionList];
    values[i][ii]["option"] = event.target.value;
    setOptionList(values);
    // console.log(optionList);
  }

  function validator() {
    //Function to validate all the input fields of the page
    let options = true; //Boolean value for options
    let questions = true; //Boolean value for questions
    optionList.map((option) => {
      //Mapping through the useState optionList that gets updated onchange of any option input field
      option.map((opt) => {
        if (opt["option"] === "") {
          //Checking if option input field contains an empty string
          questions = false;
        }
      });
    });
    list.map((lis) => {
      //Mapping through the useState optionList that gets updated onchange of any question input field
      if (
        lis["answer"] === "" || //Checking if answer input field contains an empty string
        lis["answer"] === null || //Checking if answer input field contains null
        lis["question"] == "" //Checking if question input field contains an empty string
      ) {
        options = false;
      }
    });
    return options && questions; //Will return true ONLY when both options and questions boolean values are true
  }

  async function setQuestionPaper(examPin, quizTitle, question_question) {
    //examPin: Randomly generated exam pin
    //quizTitle: User input title of quiz
    //question_question: Array of user input questions
    await setDoc(
      //Firestore document path for setting question paper
      doc(
        db,
        "Paper_Setters",
        examPin.toString(),
        "Question_Papers_MCQ",
        quizTitle
      ),
      //Data format for setting question paper
      {
        question_question: question_question,
        creator: getAuth().currentUser.email,
        status: "active",
      }

    );
  }

  async function setAnswerSheet(examPin, quizTitle, answer_answer) {
    //examPin: Randomly generated exam pin
    //quizTitle: User input title of quiz
    //answer_answer: Array of user input answer keys
    await setDoc(
      //Firestore document path for setting answer key
      doc(
        db,
        "Paper_Setters",
        examPin.toString(),
        "Question_Papers_MCQ",
        quizTitle + "_answerSheet"
      ),
      //Data format for setting answer key
      { answer_answer: answer_answer }
    );
  }

  async function setResponseStatus(examPin, quizTitle) {
    //examPin: Randomly generated exam pin
    //quizTitle: User input title of quiz
    await setDoc(
      //Firestore document path for setting Response Status
      doc(
        db,
        "Users",
        getAuth().currentUser.uid,
        "Exams_Created",
        examPin.toString()
      ),
      //Data format for setting Status
      {
        quiz_title: quizTitle,
        status: "active",
      },
      { merge: true }
    );
  }

  async function onSubmit() {
    let val = validator();
    if (val) {
      let question_question = [];
      let answer_answer = [];
      for (let i = 0; i < list.length; i++) {
        question_question.push({
          question: list[i]["question"],
          options: [],
        });
        answer_answer.push({
          answer: list[i]["answer"],
        });
        for (let j = 0; j < optionList[i].length; j++) {
          // console.log(optionList[i][j]["optionNo"]);
          question_question[i]["options"].push({
            optionNo: optionList[i][j]["optionNo"],
            option: optionList[i][j]["option"],
          });
        }
      }
      //Randomly generated exam pin
      let examPin = Math.floor(100000 + Math.random() * 900000);
      await setQuestionPaper(examPin, quizTitle, question_question);
      await setAnswerSheet(examPin, quizTitle, answer_answer);
      await setResponseStatus(examPin, quizTitle);
      window.location.href += `/DisplayPin/${examPin}`;
    } else {
      alert("Please fill all the textfields to proceed");
    }
  }
  //alert("Test Created Successfully");


  function resetForm() {
    if (window.confirm("Are you sure you want to clear the form ?") == true) {
      document.getElementById("quiz_title").value = "";
      setList([{ id: uuid(), question: "", answer: null }]);
      setOptionList([
        [
          { id: uuid(), option: "", optionNo: 1 },
          { id: uuid(), option: "", optionNo: 2 },
        ],
      ]);
    }
  }

  return (
    <div id="mainForm">
      <div className="quizBox">
        <input
          type="text"
          className="faintShadow"
          name="quiz_title"
          id="quiz_title"
          placeholder="Quiz Title"
          onChange={(event) => setQuizTitle(event.target.value)}
        />
      </div>
      {list.map((soloList, index) => (
        <div key={soloList.id} id="questionnaire">
          <ul>
            <li className="dlt_li">
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                className="questionBox faintShadow"
                onChange={(event) =>
                  questChangeHandler(event, index, "question")
                }
              />
              {list.length > 1 && index !== 0 && (
                <button className="dlt_btn">
                  <img
                    className="dlt_img faintShadow"
                    src={require("../../images/trash_bin-100_copy.jpg")}
                    alt="Delete"
                    onClick={() => handleRemoveQuest(index)}
                  />
                </button>
              )}
            </li>

            {optionList[index].map((soloOption, ind) => (
              <li key={soloOption.id} className="dlt_li">
                <input
                  type="text"
                  className="optionBox faintShadow"
                  placeholder={`Option ${ind + 1}`}
                  onChange={(event) => optionChangeHandler(event, index, ind)}
                />
                {optionList[index].length > 2 && ind !== 0 && ind !== 1 && (
                  <button className="dlt_btn opt">
                    <img
                      className="dlt_img opt faintShadow"
                      src={require("../../images/trash_bin-100_copy.jpg")}
                      alt="Delete"
                      onClick={() => handleRemoveOpt(index, ind)}
                    />
                  </button>
                )}
              </li>
            ))}

            <li>
              <input
                type="number"
                onKeyPress={(event) => numHandler(event, index)}
                min="1"
                className="optionBox faintShadow"
                max={optionList[index].length}
                maxLength="1"
                placeholder={`Correct Option`}
                onChange={(event) => questChangeHandler(event, index, "answer")}
              />
            </li>
            <li>
              {optionList[index].length < 6 && (
                <input
                  className="sub_btn_actual hov"
                  type="button"
                  value="Add Option"
                  onClick={() =>
                    handleAddOpt(index, optionList[index].length + 1)
                  }
                />
              )}
            </li>
            {list.length - 1 === index && (
              <input
                className="sub_btn_actual hov"
                type="button"
                value="Add Question"
                onClick={() => handleAddQuest()}
              />
            )}
          </ul>
        </div>
      ))}
      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Submit"
          onClick={() => onSubmit()}
        />
        <input
          className="sub_btn_actual hov"
          type="reset"
          value="Clear"
          onClick={() => resetForm()}
        />
      </div>
    </div>
  );
}

export default FormMaker;
