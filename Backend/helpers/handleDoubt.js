const { Conversation } = require("../models/conversation.model");
const DoubtQuery = require("../models/doubt.model");
const { TutorAvailablity } = require("../models/tutor.model");
const { tutorValue } = require("./handleCron");



// Creating the socket with TutorId or studentId, Room Sockets

const tutorSockets = new Map();

const studentSockets = new Map();

const roomSockets = new Map();

const initializeTutorSocket = (io) => {
    io.on('connection', (socket) => {

        // Tutor Connected 
        socket.on("tutorConnected", (data) => {

            tutorSockets.set(data.tutorId, socket.id);
            // console.log("Tutor Conencted.... Tutor")

        })


        // Request
        socket.on('requestQuery', async (data) => {
            const { tutorId } = data;
            // Handle the requestQuery event
            console.log('Received requestQuery event from student:', data);
            const query = await DoubtQuery({ ...data, status: "pending" })
            await query.save();

            // Getting the socket by tutorID
            const tutorSocket = tutorSockets.get(tutorId);
            console.log('Tutor Socket', tutorSocket);

            socket.to(tutorSocket).emit("requestQuery", data);

            // Sent event to the Tutor 
            // socket.broadcast.emit('requestQuery', { ...data });

            // Emit a response back to the student or perform other actions from  Tutor
            socket.emit('queryResponse', { message: 'Query received!' });
        });

        //  ACcept 
        socket.on('acceptQuery', async (data) => {
            const { tutorId, studentId, uniqueKey } = data;
            // Emit the  Reject query to specific Student
            const studentSocket = studentSockets.get(String(studentId));

            // Update in Db 
            try {
                const updatedQuery = await DoubtQuery.findOneAndUpdate(
                    { uniqueKey: uniqueKey },
                    { ...data, status: "accept" },
                    { new: true }
                );

                // create a new conversation now for this query ;
                const newConversation = new Conversation({ _id: updatedQuery._id })
                await newConversation.save();

                socket.broadcast.emit("acceptQuery", { ...data, status: "accept", conversationId: newConversation._id })
                // socket.to(studentSocket).emit("acceptQuery", data); 

                socket.emit("getConversationId", { tutorId, conversationId: newConversation._id })

                // Creating a new Room to join
                const roomName = `${tutorId}-${studentId}`;
                socket.join(roomName);
                // io.to(studentSocket).join(roomName);

            } catch (error) {
                console.log("Error in automatic updating : ", error)
            }

        });


        //  the TUtor Socket Join
        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            console.log(`Tutor joined room: ${roomName}`);
        });

        //  student joining
        socket.on('registerStudent', (data) => {
            const { studentId, roomName } = data;
            roomSockets.set(studentId, socket.id);
            socket.join(roomName);
            console.log(`Student joined room: ${roomName}`);
        });

        //  tutor and student messagesing 
        socket.on('sendMessage', async (data) => {
            const { roomName, message, role, conversationId, timeStamp } = data;
            io.to(roomName).emit('receiveMessage', data);
            console.log("Data message ", data)
            try {

                await Conversation.updateOne(
                    { _id: conversationId },
                    { $push: { messages: { message, role, timeStamp } } }
                )

            } catch (error) {
                console.log("Error while updatinh Conversation")
            }


        });


        // Rejecting
        socket.on('rejectQuery', async (data) => {
            const { tutorId, studentId, uniqueKey } = data;
            // Emit the  Reject query to specific Student

            const studentSocket = studentSockets.get(String(studentId));
            console.log('Query Rejected', studentSocket);

            // socket.emit("rejectQuery", data);
            socket.broadcast.emit("rejectQuery", data)

            console.log(uniqueKey)

            // Update th Query IN DB
            await DoubtQuery.updateOne({ uniqueKey: uniqueKey }, { ...data, status: "reject" })
        });

        // Update the automatically rejected query on Automatically rejection
        socket.on("updateStatusQuery", async (data) => {

            const { studentId, uniqueKey } = data;
            try {
                await DoubtQuery.updateOne({ uniqueKey: uniqueKey }, { data })
            } catch (error) {
                console.log("Error in automatic updating : ", error)
            }
        })



        // //  Tutor Latest Ping Time
        socket.on("ping", async (data) => {
            const { tutorId, lastPingTime } = data;

            // Updating in DB 
            try {
                await TutorAvailablity.findOneAndUpdate(
                    { tutorId }, { $set: { lastPingTime: lastPingTime } },
                    { upsert: true, new: true }
                )
                // console.log('Last Ping Time Updated', lastPingTime)

            } catch (error) {
                console.error("Error updating Last Ping Time", error)
            }

            // HEre send the available tutor 
            let availableTutor = tutorValue();
            // console.log("availableTutor", availableTutor);
            socket.broadcast.emit("allAvailableTutor", { availableTutor: availableTutor });

        })


        socket.on("studentConnect", (data) => {
            console.log('Student connected', data)
            studentSockets.set(data.studentId, socket.id);
        })


        socket.on("disconnect", () => {

            let tutorIdToDelete;

            tutorSockets.forEach((existingSocketId, tutorId) => {
                if (existingSocketId === socket.id) {
                    console.log(`Removing Tutor ${tutorId} from the map`);
                    tutorIdToDelete = tutorId;
                    tutorSockets.delete(tutorId);
                }
            });
            console.log("Disconnected !!");
            TutorAvailablity.deleteOne({ tutorIdToDelete })
                .then(() => console.log("TutorId Removed"))
                .catch((err) => console.error("Error while Disconnecting: ", err))


        })

    });
};



module.exports = { initializeTutorSocket };
