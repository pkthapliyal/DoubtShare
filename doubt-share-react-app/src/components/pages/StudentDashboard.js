import React, { useState, useEffect } from 'react'
import { Heading } from "@chakra-ui/react"
import { initializeSocket } from '../../Socket'
import TutorTable from '../TutorTable';
import NoTutorAlert from '../NoTutorAlert';
import NavBar from '../NavBar';


const StudentDashboard = () => {

    const SERVER_URL = "https://doubt-share-oacc.onrender.com"
    let socket = initializeSocket();
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token");

    const studentDetails = JSON.parse(localStorage.getItem("studentDetails"));

    // State for all tutor 
    const [tutorData, setTutorData] = useState([]);

    // Student Details



    // Fetch function to get student details by studentId
    // const fetchStudent = async () => {
    //     try {
    //         const response = fetch(`${SERVER_URL}/student/${studentId}`, {
    //             mode: "cors",
    //             method: "GET",
    //             headers: {
    //                 "Authorization": token
    //             }

    //         });
    //         console.log(response)
    //         const studentData = await response.json();
    //         console.log(studentData)

    //         // if (!response.ok) {
    //         //     throw new Error(`Failed to fetch student details. Status: ${response.status}`);
    //         // }

    //         // const studentData = await response.json();
    //         // console.log(studentData)
    //         // setstudentDetails(studentData);
    //     } catch (error) {
    //         console.error('Error fetching student details:', error.message);
    //         // throw error; // Rethrow the error to handle it further if needed
    //     }
    // };

    useEffect(() => {

        // fetchStudent();
        socket.emit("studentConnect", { message: "Student Conenct", studentId: studentId })

        // Getting all Available user Polling
        const pollingFunction = setInterval(() => {
            socket.on("allAvailableTutor", (data) => {

                setTutorData(data.availableTutor)

            })

        }, 3000)

        if (socket.connected) {
            socket.disconnect();
        }

        // return () => {
        //     // Disconnect the socket when the component unmounts
        //     clearInterval(pollingFunction)
        //     socket.disconnect();
        //     socket = null;
        // };

        return () => {
            // Disconnect the socket when the component unmounts
            socket.off("allAvailableTutor", pollingFunction);
            socket.disconnect();
            // socket = null;
        };

    }, []);



    return (
        <div>
            <NavBar />

            {tutorData.length ? <TutorTable tutorData={tutorData} socket={socket} studentDetails={studentDetails} /> : <NoTutorAlert />}


        </div>
    )
}

export default StudentDashboard;
