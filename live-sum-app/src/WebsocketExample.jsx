import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current.emit("join", { room: "123" });
    });

    socketRef.current.on("response", (data) => {
      console.log("Message received:", data);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socketRef.current.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Example</h1>
    </div>
  );
};

export default App;
