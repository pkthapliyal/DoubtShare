import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar';
import { useNavigate } from "react-router-dom";
import { Heading, Table, Tbody, Tr, Td, Th, Thead, Button } from '@chakra-ui/react';


const AllQueries = () => {
    const [queries, setQueries] = useState([]);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch('https://doubt-share-oacc.onrender.com/allQuery', {
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

            console.log(data.queries)

            setQueries(data.queries);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();

    }, []);

    const handleViewChat = (conversationId) => {

        navigate(`/view-chat/${conversationId}`)
    }


    return (
        <div>
            <NavBar />
            <Heading>All Queries Details</Heading>

            {queries.length && (
                <Table variant="striped" colorScheme="teal" w={"90%"} m={"auto"}>
                    <Thead>
                        <Tr>
                            <Th>Tutor ID</Th>
                            <Th>Subject Type</Th>
                            <Th>Status</Th>
                            <Th>Timestamp</Th>
                            <Th>View</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {queries.map((query) => (
                            <Tr key={query._id}>
                                <Td>{query.tutorId}</Td>
                                <Td>{query.subjectType.join(', ')}</Td>
                                <Td>{query.status}</Td>
                                <Td>{new Date(query.timeStamp).toLocaleString()}</Td>

                                <Td><Button colorScheme='teal' variant='solid'
                                    isDisabled={query.status === "reject" ? true : false}
                                    onClick={() => handleViewChat(query._id)} >
                                    View History
                                </Button>
                                </Td >
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

            )}



        </div>
    )
}

export default AllQueries
