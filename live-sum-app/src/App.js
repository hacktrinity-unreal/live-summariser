import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home.js';
import LiveCase from './live-case.js';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-case" element={<LiveCase />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
