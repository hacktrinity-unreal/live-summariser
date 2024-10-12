import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home.js';
import LiveCase from './live-case.js';

function App() {
  const caseTitle = "Brendan Case title"; 
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-case" element={<LiveCase title={caseTitle} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
