// const App = () => {
    
//     return(<h1>temp</h1>);
// }

// export default App;
import {useNavigate } from 'react-router-dom';
//import React,{ useState }  from 'react';
import './index.css'; // Import the CSS file
import court1 from './court1.jpg';
import court2 from './court2.jpg';
import court3 from './court3.jpg';
import court4 from './court4.jpg';
import court5 from './court5.jpg';

// List of cases (static data for now)
const cases = [
    { id: 1, title: 'Murder trial of O. J. Simpson', thumbnail: court1, description: 'The O.J. Simpson trial centers on the former NFL star, accused of the 1994 murders of his ex-wife, Nicole Brown Simpson, and her friend Ronald Goldman. ', live: true, rank: 5 },
    { id: 2, title: 'AI committed fraud', thumbnail: court2,description: 'AI finally showed its true colours, follow it live !', live: false, rank:4},
    { id: 3, title: 'The President is a criminal', thumbnail: court3, description: 'Everyone knew it already, he will face serious charges.', live: false, rank:4 },
    { id: 4, title: 'Pollution Scandal', thumbnail: court4, description: 'Big Corporation faces greenhouse gas emission charges', live: false, rank: 4},
    { id: 5, title: 'GDPR Violation', thumbnail: court5, description: 'University Lecturer has copyrighted images in his slides.', live: false, rank: 4 }
];

// function to get max id 
// Example usage:
//const maxIds = getIdsOfMaxRank(cases);
function getMaxRankId(cases) {
    if (!cases.length) {
        return null; // Return null if the array is empty
    }

    // Initialize maxRank and maxId
    let maxRank = cases[0].rank;
    let maxId = cases[0].id;

    // Iterate through the cases to find the max rank and corresponding id
    for (const singleCase of cases) {
        if (singleCase.rank > maxRank) {
            maxRank = singleCase.rank;
            maxId = singleCase.id;
        }
    }

    return maxId; // Return the ID of the element with the maximum rank
}



// return the other 4 ids
//const nonMaxIds = getNonMaxRankIds(cases);
function getNonMaxRankIds(cases) {
    if (!cases.length) {
        return []; // Return an empty array if the array is empty
    }

    // Step 1: Find the maximum rank
    let maxRank = Math.max(...cases.map(singleCase => singleCase.rank));

    // Step 2: Filter out cases that do not have the maximum rank
    const nonMaxCases = cases.filter(singleCase => singleCase.rank < maxRank);

    // Step 3: Extract IDs from the filtered cases
    const nonMaxIds = nonMaxCases.map(singleCase => singleCase.id);

    // Step 4: Return up to 4 IDs
    return nonMaxIds.slice(0, 4);
}
// The Home Page
function Home (){
    const maxId = getMaxRankId(cases);
    const nonMaxIds = getNonMaxRankIds(cases);

    // Get first two non-max cases for the left
    const leftCases = nonMaxIds.slice(0, 2).map(id => cases.find(singleCase => singleCase.id === id));
    // Get the max case for the middle
    const centerCase = cases.find(singleCase => singleCase.id === maxId);
    // Get last two non-max cases for the right
    const rightCases = nonMaxIds.slice(2, 4).map(id => cases.find(singleCase => singleCase.id === id));

    return (
        <div className="wholeBody">
            <div className="headerCase">
                <h1>Law Lounge</h1>
            </div>
            <div className="case-list">
                {/* Left Cases */}
                <div className="case-column left">
                    {leftCases.map(singleCase => (
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
                {/* Center Case */}
                <div className="case-column center" >
                    <Case 
                        key={centerCase.id}
                        id={centerCase.id}
                        title={centerCase.title}
                        thumbnail={centerCase.thumbnail}
                        description = {centerCase.description}
                        live={centerCase.live}
                    />
                </div>
                {/* Right Cases */}
                <div className="case-column right">
                    {rightCases.map(singleCase => (
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
        </div>
    );
}

// Each thumbnail + info of a case
function Case({id, title, thumbnail, description, live}){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/live-case?id=${id}&title=${title}&description=${description}`);
    };
   
    return (
        <div className="case" onClick={handleClick}  >
            <img src={thumbnail}  className="case-thumbnail" alt ={title}/>
            <h2>{title}</h2>
            <div className= 'desc'>{description}</div>
            <div className='status'>{live? 'Live':'Upcoming'}</div>
        </div>
    )
}
export default Home;
