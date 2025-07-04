import { useEffect, useState } from "react";
import { socket } from "./socket";

import "./styles/chat.css";

interface Message {
  _id?: string; // Identifiant unique du message (optionnel)
  user: string; // Nom de l'utilisateur qui a envoyé le message
  message: string; // Contenu du message
  timestamp?: string; // Horodatage du message (optionnel)
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [messageInput, setMessageInput] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Configuration des écouteurs d'événements socket
  useEffect(() => {
    socket.on("chatHistory", (history: Message[]) => {
      setMessages(history);
    });

    // Écoute l'événement 'newMessage' pour recevoir les nouveaux messages
    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("adminStatus", (status: boolean) => {
      setIsAdmin(status);
    });

    // Fonction de nettoyage : supprime les écouteurs d'événements
    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("adminStatus");
    };
  }, []); // Tableau de dépendances vide = effet exécuté une seule fois au montage

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (messageInput.trim()) {
      // Émet l'événement 'sendMessage' vers le serveur avec les données du message
      socket.emit("sendMessage", { user, message: messageInput });
      // Vide le champ de saisie après envoi
      setMessageInput("");
    }
  };

  if (!user) {
    return (
      <div>
        <h1>Entrez votre pseudo :</h1>
        <input
          value={userInput}
          placeholder="Votre pseudo"
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setUser(userInput);
              setUserInput("");
            }
          }}
        />
        <button
          onClick={() => {
            setUser(userInput);
            setUserInput("");
          }}
        >
          Valider
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h2>Chat - Connecté en tant que {user}</h2>
      {isAdmin && <p>Vous êtes connecté en tant qu'administrateur.</p>}

      {/* Affichage de l'historique des messages */}

      <div>
        {messages.map((msg, index) => (
          <div key={msg._id || index} className="message">
            <strong className="message-user">{msg.user}</strong>
            <span className="message-content">: {msg.message}</span>
            {msg.timestamp && (
              <span className="timestamp">
                ({new Date(msg.timestamp).getDate()}-
                {new Date(msg.timestamp).getMonth() + 1}-
                {new Date(msg.timestamp).getFullYear().toPrecision(4)})
                <span className="timestamp-hours">
                  {new Date(msg.timestamp)
                    .getHours()
                    .toString()
                    .padStart(2, "0")}
                  :
                  {new Date(msg.timestamp)
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}
                </span>
              </span>
            )}
          </div>
        ))}
      </div>

      <input
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Votre message"
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}
