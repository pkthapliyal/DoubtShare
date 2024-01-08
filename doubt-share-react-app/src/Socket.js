// socket.js
import { io } from 'socket.io-client';

// let socket;

// export const initializeSocket = () => {
//     if (!socket) {
//         socket = io('https://doubt-share-oacc.onrender.com');
//     }
//     return socket;
// };
let socket;
export const initializeSocket = () => {

    socket = io('https://doubt-share-oacc.onrender.com');
    return socket;
};

export default socket;
