import React, { useState } from "react";
import { io } from "socket.io-client";
import "./index.css";

function LiveCase({ title }) {
  React.useEffect(() => {
    const socket = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.current.emit("join", { room: "123" });
    });

    socket.on("response", (data) => {
      console.log("Message received:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  return (
    <div>
      <CaseTitle title={title} />
      <KeyMomentContainer />
      <AIExpert />
    </div>
  );
}

function CaseTitle({ title }) {
  return (
    <div className="case-title-container">
      <h1 className="case-title-text">{title}</h1>
    </div>
  );
}

function KeyMoment(title, text, timestamp) {
  return (
    <>
      <div className="key-moment">
        <h1 className="key-moment-title">{title}</h1>
        <p className="key-moment-text">{text}</p>
        <i className="key-moment-timestamp">{timestamp}</i>
      </div>
      <br></br>
    </>
  );
}

function KeyMomentContainer() {
  let keyMoments = [
    new KeyMoment("Title", "Text", "Timestamp"),
    new KeyMoment("Title2", "Text2", "Timestamp2"),
  ];

  return <div className="sub-container key-moment-container">{keyMoments}</div>;
}

function AIExpert() {
  const [showOpinionAI, setShowOpinionAI] = useState(false);
  const handleButtonClick = () => {
    setShowOpinionAI(true); // Toggle the state
  };
  return (
    <div className="sub-container ai-expert-container">
      <div className="opinion-container">
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
    <div className="general-container">
      <p>This should be the opinion of the AI expert</p>
    </div>
  );
}

export default LiveCase;
