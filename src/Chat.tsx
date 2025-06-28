import { useEffect, useState } from "react";
import { socket } from "./socket";

import "./styles/chat.css";

interface Message {
  user: string;
  message: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>("");
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { user, message: input });
      setInput("");
    }
  };

  if (!user) {
    return (
      <div>
        <h1>Entrez votre pseudo :</h1>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && setUser(input);
          }}
        />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h2>Chat - Connecté en tant que {user}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Votre message"
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}
