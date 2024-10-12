import React,{ useState }  from 'react';
import './index.css'; // Import the CSS file

function LiveCase({title, description}) {
    return (
        <div>
            <CaseTitles title={title} description={description}/>
            <KeyMomentContainer />
            <AIExpert />
        </div>
    );
}

function CaseTitles({title, description}) {
    return (
        <div className="case-title-container">
            <h1 className="case-title-text">
                {title}
            </h1>
            <p className="case-title-subtitle">
                {description}
            </p>
        </div>
    );
}

function KeyMoment(title, text, timestamp) {
    return (
        <>
            <div className="sub-container">
                <h1 className="key-moment-title">{title}</h1>
                <p className="key-moment-text">{text}</p>
                <i className="key-moment-timestamp">{timestamp}</i>
            </div>
            <br></br>
        </>
    );
}

function KeyMomentContainer() {
    let keyMoments = [];

    for (let i = 0; i < 10; i++) {
        keyMoments.push(new KeyMoment("Title", "Description", "Timestamp"))
    }

    return (
        <div className = "container key-moment-container">
            {keyMoments}
        </div>
    );
}

function AIExpert(){
    const [showOpinionAI, setShowOpinionAI] = useState(false)
    const handleButtonClick = () => {
        setShowOpinionAI(true); // Toggle the state
    };
    return (
        <div className="container ai-expert-container">
            <div className="general-sub-container"> 
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
        <div className="sub-container">
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
    )
}

export default LiveCase;
