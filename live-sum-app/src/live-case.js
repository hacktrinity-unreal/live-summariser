import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ReactMarkdown from "react-markdown";
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

async function fetchOdds() {
  try {
    const response = await fetch("http://0.0.0.0:8080/get_returns");
    const data = await response.json();
    const { guilty, not_guilty } = data;
    return { guiltyOdds: guilty, notGuiltyOdds: not_guilty };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { guiltyOdds: null, notGuiltyOdds: null };
  }
}

function CaseTitles({ title, description }) {
  const [guiltyOdds, setGuiltyOdds] = useState(0.0);
  const [notGuiltyOdds, setNotGuiltyOdds] = useState(0.0);

  useEffect(() => {
    const getOdds = async () => {
      try {
        const { guiltyOdds, notGuiltyOdds } = await fetchOdds();
        setGuiltyOdds(guiltyOdds);
        setNotGuiltyOdds(notGuiltyOdds);
      } catch (error) {
        console.error("Error fetching odds:", error);
      }
    };

    getOdds();
  }, []);

  return (
    <>
      <div className="case-title-container">
        <div>
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

function KeyMoment({ text, timestamp }) {
  return (
    <>
      <div className="key-moment">
        <i className="key-moment-timestamp">{timeAgo(timestamp)}</i>
        <p className="key-moment-text">
          <ReactMarkdown>{text}</ReactMarkdown>
        </p>
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
          text={summary.content}
          timestamp={summary.timestamp}
          key={summary.timestamp}
        />
      ))}
    </div>
  );
}

function AIExpert({ analyses }) {
  const [index, setIndex] = React.useState(0);
  const [showOpinionAI, setShowOpinionAI] = useState(false);

  const handleButtonClick = () => {
    setShowOpinionAI(true);
    setIndex(0);
  };

  React.useEffect(() => {
    setIndex((previous) => previous + 1);
  }, [analyses]);

  return (
    <div className=" ai-expert-container">
      <div className="general-sub-container">
        {analyses && showOpinionAI && (
          <OpinionAI content={analyses[index].content} />
        )}
      </div>

      <button
        onClick={handleButtonClick}
        className="opinion-button-ai"
        disabled={!analyses.length}
      >
        Give AI opinion
      </button>
    </div>
  );
}

function OpinionAI({ content }) {
  return (
    <div className="sub-container">
      <p>
        <ReactMarkdown>{content}</ReactMarkdown>
      </p>
    </div>
  );
}

export default LiveCase;
