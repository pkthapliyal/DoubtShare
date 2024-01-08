import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, Heading, Th, Td, TableCaption, Button } from "@chakra-ui/react";
import RequestModal from './RequestModal';
import { useNavigate } from "react-router-dom";

function generateRandomString() {
    const timestampPart = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    const uniqueString = timestampPart + randomPart;
    return uniqueString;
}




const TutorTable = (props) => {
    const { socket, studentDetails, tutorData } = props;
    const [selectedTutor, setSelectedTutor] = useState({});
    const [isRequesting, setIsRequesting] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [isRejeted, setIsRejected] = useState(false)


    const navigate = useNavigate();

    // Requesting
    const requestQuery = (tutor) => {
        setSelectedTutor(tutor);
        setIsRequesting(true);

        function haveCommonElements(arr1, arr2) {
            return arr1.some(item => arr2.includes(item));
        }

        if (tutor.garde == studentDetails.grade && haveCommonElements(tutor.subjectType, studentDetails.subjectType) && tutor.language == studentDetails.language) {
            const tutorId = tutor._id;
            console.log("Requesiting")
            // Example usage
            const uniqueKey = generateRandomString();

            const query = { tutorId, studentId: studentDetails._id, status: "pending", timeStamp: new Date(), uniqueKey, subjectType: studentDetails.subjectType, studentName: studentDetails.name }
            // Emit the requestQuery event with tutorId
            socket.emit("requestQuery", query);

            const id = setTimeout(() => {
                alert("No one is accepting the request.");
                socket.emit("updateStatusQuery", { ...query, status: "rejected", timeStamp: new Date() })

                setIsRequesting(false);
            }, 60000);
            // we'll make this only valid for 1 minut
            setTimeoutId(id);
        }
        else {
            alert("Selected tutor doesn't matches your subjects or language !!");
            setIsRequesting(false);
        }
    };

    useEffect(() => {
        const handleRequestAccepted = (data) => {
            console.log("chatId", data)
            // Update the button text
            setIsRequesting(false);

            clearTimeout(timeoutId);
            // Koin the room here
            const roomName = `${data.tutorId}-${data.studentId}`;
            // socket.emit("joinRoom", roomName);
            if (data.studentId === studentDetails._id) {
                navigate(`/student-chat/${roomName}/${data.conversationId}`)
            }

        };

        // Listen for the requestAccepted event
        socket.on("acceptQuery", handleRequestAccepted);


        // // Listen to request reject 
        socket.on("rejectQuery", (data) => {
            // console.log('Rejected Query', data)
            // console.log(studentDetails)
            const { studentId } = data;
            if (studentDetails._id === studentId) {
                setIsRequesting(false);
                alert("Request has been Rejected !!")
                return
                // console.log("Rejected Query", data)
            }

        })

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("requestAccepted", handleRequestAccepted);
        };
    }, [timeoutId])



    return (
        <div>
            <div>
                <Heading>Tutor Data</Heading>
                <Table variant='striped' colorScheme='teal'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Grade</Th>
                            <Th>Language</Th>
                            <Th>SubjectType</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tutorData.map((tutor, index) => (
                            <Tr key={index}>
                                <Td>{tutor.name}</Td>
                                <Td>{tutor.grade}</Td>
                                <Td>{tutor.language}</Td>
                                <Td>{tutor.subjectType}</Td>
                                <Td>
                                    <Button colorScheme="teal" size="sm"
                                        onClick={() => requestQuery(tutor)}
                                        isDisabled={isRequesting}                                                                         >
                                        {isRequesting ? 'Requesting...' : 'Request Query'}
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </div>
        </div>
    );
}

export default TutorTable;
