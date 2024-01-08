import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    FormControl, Heading,
    FormLabel,
    Input,
    Select,
    Button,
    Link,
    VStack,
} from '@chakra-ui/react';


const TutorSign = () => {
    const SERVER_URL = "https://doubt-share-oacc.onrender.com";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
            // Handle form submission logic here
            console.log('Form Data:', formData);
            const response = await fetch(`${SERVER_URL}/login/tutor`, {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json(); // Parse the JSON in the response
                console.log('Success:', data);
                localStorage.setItem("token", data.token);
                localStorage.setItem("tutorId", data.tutorId)
                alert(data.message);

                setTimeout(() => {
                    navigate("/tutor/dashboard")
                }, 2000);

            } else {
                const data = await response.json(); // Parse the JSON in the response
                alert(data.message);
                throw new Error(`HTTP error! Status: ${response.status}`);

            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <VStack spacing={4} align="stretch" maxW={400} m={"auto"}>
            <form onSubmit={handleSubmit}>

                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </FormControl>

                <Button type="submit" colorScheme="blue" mt={4}>
                    Submit
                </Button>

                <br />

                <Link href="/tutor-register" color="blue.500" fontWeight="bold">
                    Don't have an account. Sign up here !!
                </Link>
            </form>
        </VStack>
    )
}

export default TutorSign;
