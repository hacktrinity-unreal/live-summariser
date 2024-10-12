import './App.css';
import Home from './home.js';
import Page_1 from './page_1.js';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page_1" element={<Page_1 />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
