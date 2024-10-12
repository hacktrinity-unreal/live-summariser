import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';
// import Page_1 from './page_1.js';
import AIExpert from './page_1';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/page_1" element={<Page_1 />} /> */}
          <Route path="/ai_expert" element ={<AIExpert/>}/> 
        </Routes>
    </BrowserRouter>
  );
}

export default App;
