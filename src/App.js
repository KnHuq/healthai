import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableBarAnalysis from "./components/tableBarAnalysis";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableBarAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
