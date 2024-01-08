import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar';
import { useParams } from "react-router-dom";

import { VStack, Text, HStack } from "@chakra-ui/react";


const ViewChat = () => {

    const { conversationId } = useParams();
    const [conversation, setConversation] = useState([]);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {
            const response = await fetch(`https://doubt-share-oacc.onrender.com/conversation/${conversationId}`, {
                method: "GET", mode: "cors",
                headers: {
                    "Authorization": token
                }
            });

            if (!response.ok) {
                console.error("Error while fetching all queries");
                alert("Something went wrong")
            }
            const data = await response.json();

            console.log(data)

            setConversation(data);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();

    }, []);

    return (
        <div>
            <NavBar />

            {conversation && (
                <VStack
                    spacing={4}
                    align="start"
                    maxW="80%"
                    m="auto"
                    bg="#fff"
                    overflowY="auto" // Make the VStack scrollable
                    maxH="300px" // Set a maximum height for the scrollable VStack
                >
                    {conversation.map((message) => (
                        <HStack key={message._id} align="start" >
                            <Text fontSize="md">
                                <strong>{message.role}  : </strong>
                                {message.message} -
                            </Text>
                            <Text fontSize="8px" mt={2} >{new Date(message.timeStamp).toLocaleTimeString()}</Text>
                        </HStack>
                    ))}
                </VStack>
            )}



        </div>
    )
}

export default ViewChat
