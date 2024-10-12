import React, { useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import "./index.css";

const NEW_SUMMARY = "NEW_SUMMARY";
const NEW_ANALYSIS = "NEW_ANALYSIS";

function LiveCase() {
  const [summaries, setSummaries] = React.useState([]);
  const [analyses, setAnalyses] = React.useState([]);

  React.useEffect(() => {
    const socket = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("join", { room: "123" });
    });

    socket.on("response", (message) => {
      console.log("Message received:", message);
      const { type, data } = message;
      switch (type) {
        case NEW_SUMMARY:
          setSummaries((previous) => [data, ...previous]);
          break;
        case NEW_ANALYSIS:
          setAnalyses((previous) => [data, ...previous]);
          break;
        default:
          console.log("No matching type: " + type);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  return (
    <div>
      <CaseTitles title={title} description={description} />
      <KeyMomentContainer summaries={summaries} />
      <AIExpert />
    </div>
  );
}

function CaseTitles({ title, description, guiltyOdds = 1, notGuiltyOdds = 1 }) {
  return (
    <>
      <div className="case-title-container">
        <div className="not-buttons">
          <h1 className="case-title-text">{title}</h1>
          <p className="case-title-description">{description}</p>
        </div>
      </div>
      <div className="double-buttons">
        <button className="green-button">
          Not Guilty<br></br> Odds: {notGuiltyOdds}
        </button>
        <button className="red-button">
          Guilty<br></br> Odds: {guiltyOdds}
        </button>
      </div>
    </>
  );
}

function KeyMoment({ title, text, timestamp }) {
  return (
    <>
      <div className="key-moment">
      <i className="key-moment-timestamp">{timestamp}</i>
        <p className="key-moment-text">{text}</p>
        
      </div>
      
      <br></br>
      <hr></hr>
    </>
  );
}

function KeyMomentContainer({ summaries }) {
  console.log(summaries);
  return (
    <div className="container key-moment-container">
      {summaries.map((summary) => {
        console.log(summary);
        return (
          <KeyMoment
            title=""
            text={summary.content}
            timestamp={summary.timestamp}
            key={summary.timestamp}
          />
        );
      })}
    </div>
  );
}

function AIExpert() {
  const [showOpinionAI, setShowOpinionAI] = useState(false);
  const handleButtonClick = () => {
    setShowOpinionAI(true); // Toggle the state
  };
  return (
    <div className="container ai-expert-container">
      <div className="general-sub-container">
        <h1>AI Expert</h1>
        {showOpinionAI && <OpinionAI />}
      </div>

      <button onClick={handleButtonClick} className="opinion-button">
        Give AI opinion
      </button>
    </div>
  );
}

function OpinionAI() {
  return (
    <div className="sub-container">
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
    </div>
  );
}

export default LiveCase;
