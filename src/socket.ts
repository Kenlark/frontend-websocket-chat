import { io } from "socket.io-client";

// Création de la connexion socket vers le serveur
// Utilise le nom d'hôte actuel avec le port 3000
export const socket = io(`${window.location.hostname}:3000`);
