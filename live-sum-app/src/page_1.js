import React,{ useState }  from 'react';

import './index.css'; // Import the CSS file
// function PageComponent(){
//     <Key></Key>
//     <AiExpert></AiExpert>
// }
function AIExpert(){
    const [showOpinionAI, setShowOpinionAI] = useState(false)
    const handleButtonClick = () => {
        setShowOpinionAI(true); // Toggle the state
    };
    return (
        <div className="ai-expert-container">
            <div className="opinion-container"> 
                <h1>AI Expert</h1>
                {showOpinionAI && <OpinionAI />}
            </div>
            
            <button onClick={handleButtonClick} className='opinion-button'>
            Give AI opinion
            </button>
        </div>
    )
}
function OpinionAI(){
    return (
        <div className="opinion-ai-box">
            
            <p>This should be the opinion of the AI expert</p>
        </div>
    )
}


export default AIExpert;