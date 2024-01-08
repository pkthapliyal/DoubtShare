import React, { useState, useEffect } from 'react';
import { Input, Button, Box, Avatar, Flex, VStack } from "@chakra-ui/react";
import { initializeSocket } from '../../Socket';
import { useParams } from "react-router-dom";
import TutorNavBar from '../TutorNavBar';

const TutorChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [role, setRole] = useState("tutor");
    const { roomName, conversationId } = useParams();
    let tutorId = localStorage.getItem("tutorId");


    let socket = initializeSocket();
    useEffect(() => {

        // Join the room
        socket.emit("joinRoom", roomName);


        // Listen for incoming messages
        socket.on("receiveMessage", (data) => {

            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up the socket listener when the component unmounts
        return () => {
            socket.off("receiveMessage");
        };
    }, [roomName, socket]);  // Only re-run the effect when roomName changes

    const sendMessage = () => {

        socket.emit("sendMessage", { roomName, message: newMessage, role, timeStamp: new Date(), conversationId });

        let message = { roomName, message: newMessage, role }

        // Optionally, update the local state immediately
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
    };

    return (
        <>
            <TutorNavBar />

            <Box
                maxW={800} m="auto" display="flex" flexDirection="column" mt={2} borderRadius='lg' height="90vh"
                borderWidth="1px"

                my={2}
                boxShadow="md"
                zIndex={1}
                bg="white"
                p={4}
            >

                <VStack spacing={4} overflowY="auto" flex="1">
                    {messages.map((msg, index) => (
                        <Flex
                            key={index}
                            marginRight={msg.role === "tutor" ? "-10px" : "10px"}
                        >
                            {msg.role === "tutor" && (
                                <Avatar name="Tutor" size="sm"
                                    src="https://imgs.search.brave.com/T6ZHk_8I3qwlssOsx-Q__zzNy8VGHFO2WnbYo5PLBrQ/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYnVzaW5lc3Nt/YW4tYXZhdGFyLWNh/cnRvb24tY2hhcmFj/dGVyLXByb2ZpbGVf/MTg1OTEtNTA1ODUu/anBnP3NpemU9NjI2/JmV4dD1qcGc" />

                            )}
                            <Box p={2} borderWidth="1px" borderRadius="md">
                                {msg.role === "tutor" ? "Tutor" : "Student"}: {msg.message}
                            </Box>
                            {msg.role === "student" && (
                                <Avatar name="Student" size="sm"
                                    src="https://imgs.search.brave.com/suvHXQlpXSsgze_V7ZEQnUSBpPf93OfMiSaBjQ9X2eI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8xMy80OC95/b3VuZy1zdHVkZW50/LWF2YXRhci12ZWN0/b3ItMjU5ODEzNDgu/anBn" />

                            )}
                        </Flex>
                    ))}
                </VStack>

                <Box p={4} borderTop="1px solid #e0e0e0" bg="white">
                    <Input
                        placeholder="Type your message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />

                    <Button onClick={sendMessage} colorScheme="teal" mt={4}>
                        Send Message
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default TutorChat;
