require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
app.use(cors());
const { initializeTutorSocket } = require('./helpers/handleDoubt');

// ["http://localhost:3000",
// new socket server
const io = new Server(server, {
    cors: {
        origin: "https://doubt-share-rouge.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
})

initializeTutorSocket(io); // Initialize tutor socket


//  All middleware route
const { dbConnection } = require("./config/db");
const { studentRoute } = require("./routes/student.route");
const { tutorRoute } = require("./routes/tutor.route");
const { TutorAvailablity } = require("./models/tutor.model");
const { cronFunction, tutorValue } = require("./helpers/handleCron");
const { queryRoute } = require("./routes/query.route");
const { conversationRoute } = require("./routes/conversation");
const PORT = process.env.PORT || 3300;

// Starting the CRON Function here 

cronFunction.start();


app.use(express.json());

// Router Middleware
app.use("/", studentRoute);
app.use("/", tutorRoute);
app.use("/", queryRoute);
app.use("/", conversationRoute)


app.get('/', (req, res) => {
    res.send("Hello Welcome to Hompage. This is help API.")
});



// io listening
// io.on('connection', (socket) => {
//     // console.log(`Socket connected: ${socket.id}`);

//     // // Ping the user
//     // socket.on("message", (data) => {
//     //     console.log(data)

//     //     // Broadcast to everyone 
//     //     // socket.broadcast().emit("event", data) 
//     //     // socket.to("room").emit("event", data)  // to room
//     // })


//     // // Tutor Available 
//     socket.on("tutorConnected", (data) => {
//         console.log("Tutor Conencted.... TuTor")
//     })

//     // //  Tutor Latest Ping Time
//     socket.on("ping", async (data) => {
//         const { tutorId, lastPingTime } = data;
//         // Updating in DB 
//         try {
//             await TutorAvailablity.findOneAndUpdate(
//                 { tutorId }, { $set: { lastPingTime: lastPingTime } },
//                 { upsert: true, new: true }
//             )

//             console.log('Last Ping Time Updated', lastPingTime)

//         } catch (error) {
//             console.error("Error updating Last Ping Time", error)
//         }

//         // HEre send the available tutor 
//         let availableTutor = tutorValue();
//         // console.log("availableTutor", availableTutor);
//         socket.broadcast.emit("allAvailableTutor", { availableTutor: availableTutor });

//     })


//     socket.on("studentConnect", (data) => {
//         console.log('Student connected', data)
//     })

//     socket.on("disconnectCustom", (data) => {
//         const { tutorId } = data;
//         console.log(tutorId)
//         console.log("Disconenct")
//         TutorAvailablity.deleteOne({ tutorId })
//             .then(() => console.log("TutorId Removed"))
//             .catch((err) => console.error("Error while Disconnecting: ", err))
//     })





//     socket.on("disconnect", () => {
//         console.log("Disconnected")
//     })

// });


server.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    try {
        await dbConnection;
        console.log("DB Connected")

    } catch (error) {
        console.error({ error: error.message })
    }
});
