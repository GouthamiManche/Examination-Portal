import "./App.css";
import Form from "./components/Form/Form";
import FormMaker from "./components/Form/FormMaker";
import PinVerify from "./components/Form/PinVerify";
import Navbar from "./components/Form/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResultFetch from "./components/Form/ResultFetch";
import DisplayPin from "./components/Form/DisplayPin";
import ExamsCreated from "./components/Form/ExamsCreated";
import ExamsAttempted from "./components/Form/ExamsAttempted";
import DisplayResponses from "./components/Form/DisplayResponses";
import Home from "./pages/Home";
import About from "./pages/About";
import React from 'react';
function App() {
  window.onscroll = function () {
    // console.log(window.scrollY);
    if (window.scrollY > 20) {
      document.querySelector(".Nav").classList.add("whiteBg", "faintShadow");
    } else {
      document.querySelector(".Nav").classList.remove("whiteBg", "faintShadow");
    }
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/pinverify" element={<PinVerify />}></Route>
          <Route path="/pinverify/Form/:pin" element={<Form />}></Route>
          <Route path="/FormMaker" element={<FormMaker />}></Route>
          <Route
            path="/FormMaker/DisplayPin/:pin"
            element={<DisplayPin />}
          ></Route>
          <Route
            path="/pinverify/Form/:pin/ResultFetch/:email"
            element={<ResultFetch />}
          ></Route>
          <Route path="/ExamsCreated" element={<ExamsCreated />}></Route>
          <Route path="/ExamsAttempted" element={<ExamsAttempted />}></Route>
          <Route
            path="/ExamsCreated/DisplayResponses/:pin"
            element={<DisplayResponses />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
