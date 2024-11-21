import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { EditPage } from "./pages/EditPage";
import { DisplayPage } from "./pages/DisplayPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit-blog" element={<EditPage />} />
        <Route path="/display-blog" element={<DisplayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
