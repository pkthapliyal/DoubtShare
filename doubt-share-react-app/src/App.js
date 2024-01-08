import './App.css';
// import io from "socket.io-client";
import { useEffect } from "react";


import AllRoutes from './components/pages/AllRoutes';
// import io from "socket.io-client";
// const socket = io("https://doubt-share-oacc.onrender.com");

function App() {

  // useEffect(() => {
  //   socket.emit("message", { message: "Hellooo" });

  // }, []);

  return (

    <div className="App">
      <AllRoutes />
    </div>

  );
}

export default App;
