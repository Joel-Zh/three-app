import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Route ,Link, Routes} from "react-router-dom";

import Home from "./pages/home";
import Detail from "./pages/detail";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="detail" element={<Detail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
