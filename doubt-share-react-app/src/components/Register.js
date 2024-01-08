import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FormControl, Heading,
    FormLabel,
    Input,
    Select, ButtonGroup,
    Button,
    Stack, Link,
    VStack,
} from '@chakra-ui/react';




const Register = () => {

    const SERVER_URL = "https://doubt-share-oacc.onrender.com";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        grade: '',
        language: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Handle form submission logic here
            console.log('Form Data:', formData);
            const response = await fetch(`${SERVER_URL}/register/student`, {
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
                alert(data.message);

                setTimeout(() => {
                    navigate("/student-login")
                }, 3000);

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
                    <FormLabel>Name</FormLabel>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </FormControl>

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

                <FormControl isRequired>
                    <FormLabel>Grade</FormLabel>
                    <Select
                        id="grade"
                        name="grade"
                        placeholder="Select grade"
                        value={formData.grade}
                        onChange={handleChange}
                    >
                        {/* Populate the grade options dynamically */}
                        {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                            <option key={grade} value={grade}>
                                {grade}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Language</FormLabel>
                    <Select
                        id="language"
                        name="language"
                        placeholder="Select language"
                        value={formData.language}
                        onChange={handleChange}
                    >
                        {/* Populate the language options dynamically */}
                        {['Hindi', 'English'].map((language) => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" mt={4}>
                    Submit
                </Button>
                <br />
                <Link href="/student-login" color="blue.500" fontWeight="bold">
                    Already have and account. Sign in here !!
                </Link>
            </form>
        </VStack>
    )
}

export default Register
    ;
