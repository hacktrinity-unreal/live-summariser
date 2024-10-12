import React, { useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import "./index.css";

const NEW_SUMMARY = "NEW_SUMMARY";
const NEW_OPINION = "NEW_OPINION";

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

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
        case NEW_OPINION:
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
      <AIExpert analyses={analyses} />
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
        <i className="key-moment-timestamp">{timeAgo(timestamp)}</i>
        <p className="key-moment-text">{text}</p>
      </div>

      <br></br>
      <hr></hr>
    </>
  );
}

function KeyMomentContainer({ summaries }) {
  return (
    <div className="container key-moment-container">
      {summaries.map((summary) => (
        <KeyMoment
          title=""
          text={summary.content}
          timestamp={summary.timestamp}
          key={summary.timestamp}
        />
      ))}
    </div>
  );
}

function AIExpert({ analyses }) {
  const [showOpinionAI, setShowOpinionAI] = useState(false);

  const handleButtonClick = () => {
    analyses && setShowOpinionAI(true);
  };

  console.log(analyses);

  return (
    <div className="container ai-expert-container">
      <div className="general-sub-container">
        <h1>AI Expert</h1>
        {showOpinionAI && <OpinionAI analysis={analyses.at(0)} />}
      </div>

      <button onClick={handleButtonClick} className="opinion-button">
        Give AI opinion
      </button>
    </div>
  );
}

function OpinionAI({ analysis }) {
  console.log(analysis);
  return (
    <div className="sub-container">
      <p>{analysis.content}</p>
    </div>
  );
}

export default LiveCase;
