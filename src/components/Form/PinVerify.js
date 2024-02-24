import { useState } from "react";
import React from 'react';

function PinVerify() {
  const [pin, setPin] = useState(() => 0);

  function numHandler(event) {
    let pattern = /[^0-9]/;
    if (event.key.match(pattern) || event.target.value.length >= 6) {
      event.preventDefault();
    }
  }

  function routeChange() {
    pin.length === 6
      ? (window.location.href += `/Form/${pin}`)
      : alert("Please enter a 6 digit pin");
  }

  function pinChangeHandler(event) {
    setPin(event.target.value);
  }

  return (
    <div id="mainForm">
      <div className="quizBox">
        <input
          type="number"
          className="faintShadow"
          name="pinCheck"
          id="pinCheck"
          placeholder="Enter Exam Pin"
          onKeyPress={(event) => numHandler(event)}
          onChange={(event) => pinChangeHandler(event)}
        />
      </div>
      <div className="sub_btn">
        <input
          className="sub_btn_actual faintShadow hov"
          type="button"
          value="Submit"
          onClick={() => routeChange()}
        />
      </div>
    </div>
  );
}

export default PinVerify;
