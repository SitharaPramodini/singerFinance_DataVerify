import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Success from "./components/Success";
import Login from "./pages/Login";
import DataConfirm from "./pages/DataConfirm";

function App() {

  return (
    <BrowserRouter>
      {/* <BottomMenu /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DataConfirm />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
