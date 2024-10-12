// const App = () => {
    
//     return(<h1>temp</h1>);
// }

// export default App;
import { BrowserRouter as  useNavigate } from 'react-router-dom';
//import React,{ useState }  from 'react';
import './index.css'; // Import the CSS file
import court1 from './court1.jpg';
import court2 from './court2.jpg';
import court3 from './court3.jpg';
import court4 from './court4.jpg';
import court5 from './court5.jpg';

// List of cases (static data for now)
const cases = [
    { id: 1, title: 'Brendan', thumbnail: court1, description: 'Brendan and his troubles with minor consequences.', live: true, rank: 5 },
    { id: 2, title: 'AI committed fraud', thumbnail: court2,description: 'AI finally showed its true colours, follow it live !', live: false, rank:4},
    { id: 3, title: 'The President is a criminal', thumbnail: court3, description: 'Everyone knew it already, he will face serious charges.', live: false, rank:4 },
    { id: 4, title: 'Pollution Scandal', thumbnail: court4, description: 'Big Corporation faces greenhouse gas emission charges', live: false, rank: 4},
    { id: 5, title: 'GDPR Violation', thumbnail: court5, description: 'University Lecturer has copyrighted images in his slides.', live: false, rank: 4 }
];

// The Home Page
function Home (){
    return (
        <div className="wholeBody">
        <div className="headerCase">
                <h1>Law Lounge</h1> {/* Main header for the cases */}
            </div>
        <div className="case-list">
            {cases.map((singleCase) => (
                <Case 
                    key={singleCase.id}
                    id={singleCase.id}
                    title={singleCase.title}
                    thumbnail={singleCase.thumbnail}
                    description = {singleCase.description}
                    live={singleCase.live}
                />
            ))}
        </div>
        </div>
    )
}

// Each thumbnail + info of a case
function Case({id, title, thumbnail, description, live}){
    
    // somehow navigate ?
   
    return (
        <div className="case"  >
            <img src={thumbnail}  className="case-thumbnail" />
            <h2>{title}</h2>
            <div className= 'desc'>{description}</div>
            <div className='status'>{live? 'Live':'Upcoming'}</div>
        </div>
    )
}
export default Home;