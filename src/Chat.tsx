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
  const [input, setInput] = useState<string>("");

  // Configuration des écouteurs d'événements socket
  useEffect(() => {
    socket.on("chatHistory", (history: Message[]) => {
      setMessages(history);
    });

    // Écoute l'événement 'newMessage' pour recevoir les nouveaux messages
    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Fonction de nettoyage : supprime les écouteurs d'événements
    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
    };
  }, []); // Tableau de dépendances vide = effet exécuté une seule fois au montage

  // Fonction pour envoyer un message
  const sendMessage = () => {
    // Vérifie que le message n'est pas vide (après suppression des espaces)
    if (input.trim()) {
      // Émet l'événement 'sendMessage' vers le serveur avec les données du message
      socket.emit("sendMessage", { user, message: input });
      // Vide le champ de saisie après envoi
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
            // Valide le pseudo quand l'utilisateur appuie sur Entrée
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
          <div key={msg._id || index}>
            <strong>{msg.user}</strong>: {msg.message}
            {/* Affichage de l'horodatage si disponible */}
            {msg.timestamp && (
              <span>({new Date(msg.timestamp).toLocaleTimeString()})</span>
            )}
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
