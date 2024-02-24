import { useParams } from "react-router-dom";
import React from 'react';

function DisplayPin() {
  let { pin } = useParams();

  return (
    <div id="mainForm">
      <p className="centeredP">Test Created Successfully</p>
      <p className="centeredP" id="examPin">
        Your Exam Pin is&nbsp;<span> {pin}</span>{" "}
      </p>

      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Copy To Clipboard"
          onClick={() => {
            navigator.clipboard.writeText(pin);
            alert("Copied Successfully");
          }}
        />
      </div>
    </div>
  );
}

export default DisplayPin;
