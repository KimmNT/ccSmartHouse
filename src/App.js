import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import DetailPage from "./components/DetailPage";
import LoginPage from "./components/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage />} />
        <Route path="/homepage" index element={<HomePage />} />
        <Route path="/detail" index element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
