## Introduction

Welcome to DoubtShare! Our platform is designed to help students promptly address their academic questions in real-time. This documentation provides a detailed guide, giving you an overview of the application, highlighting its unique features, robust technology, and offering easy-to-follow instructions for setup and use.

---

## Features

# Student and Tutor Authentication
- Users can log in and sign up as either a tutor or a student.

# Real-time Doubt Request
- Students can submit doubt requests to available tutors. Tutors have the option to cancel or accept the doubt request.

# Doubt Solving
- Upon acceptance by a tutor, both the tutor and the student join a private room to have a conversation and address the doubt.

# Doubt History
- Students can track their doubt history.

# Doubt History Conversation Records
- Students can review their doubt history and access records of all previous conversations.




---

## Tech Stack

- Backend: Node.js, Express , Scoket.io
- Frontend: React, ChakraUI
- Database: MongoDB


---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running
- React development environment set up

### Installation

1. Clone the repository:
      git clone https://github.com/pkthapliyal/DoubtShare/.git


## Running the Application

1. *Navigate to the project directory:*
    ```sh
    cd DoubtShare
    

2. Install backend dependencies:
        cd Backend
    npm install
    

3. Install frontend dependencies:
        cd frontend
    npm install
    

4. Run the backend server:
        cd Backend
    npm run server
    

5. Run the frontend:
        cd doubt-share-react-app
    npm start
    

The application is accessible at [http://localhost:3000](http://localhost:3000).

---

## Application Structure

### Backend
- Engineered with Node.js and Express to ensure a robust foundation.
- Manages user authentication, doubt request processing, and WebSocket communication.
  - index.js.js: Serves as the primary entry point for the Express application.
  - routes/: API routes dedicated to user authentication and doubt handling.
  - models/: Defines MongoDB data models for users and doubt requests.
  - helpers/: Incorporates utility functions for enhanced efficiency.

### Frontend
- Crafted using React, ChakraUI to provide a responsive and intuitive user interface.
- Collaborates seamlessly with the backend through API calls and WebSocket communication.
  - src/: Encompasses React components, styles, and services.
  - components/: Hosts reusable React components for a streamlined design.


# API Endpoints Documentation

- **POST /api/register/student:** Facilitates secure student registration.
- **POST /api/login/student:** Ensures a seamless student login experience.
- **POST /api/register/tutor:** Facilitates secure tutor registration.
- **POST /api/login/tutor:** Ensures a seamless tutor login experience.
- **GET /api/allqueries/:** Retrieves detailed information for all queries.
- **GET /api/conversation/:conversationId:** Retrieves a conversation by its conversationId.


# Socket.IO Events Documentation

- `tutorConnected`: Notifies when a tutor connects to the server.

- `requestQuery`: Propagates a doubt request from a student to available tutors.

- `acceptQuery`: Manages a tutor's response to accepting a doubt request.

- `sendMessage`: Enables communication through instant messaging between tutors and students.

- `rejectQuery`: Handles the rejection of a doubt request by a tutor.

- `updateStatusQuery`: Updates the status of an automatically rejected query.

- `ping`: Sends a ping signal from a tutor to indicate availability.

- `studentConnect`: Notifies when a student connects to the server.


---

## Usage

### Student Overview
 1. Authentication

- Log in or register as a student using secure credentials.

 2. Doubt Submission

- Students can request help from tutors based on matching subject types.

 3. Tutor Response

- Wait patiently for responses from available tutors. If there's no response within 60 seconds, cancel the request and receive an alert.

 4. Engagement

- Easily chat with a tutor who has accepted your request. This creates a dedicated space for effective communication and learning.


### Tutor Interaction
# Features Overview

 1. Authentication

- Log in or register as a tutor, ensuring the security of your credentials for a professional experience.

 2. Real-Time Notifications

- Receive targeted notifications for doubt requests that align with your area of expertise.

 3. Prompt Evaluation

- Evaluate and respond promptly to incoming doubt requests by either accepting or rejecting, maintaining a proactive stance.

 4. Effective Communication

- Upon acceptance, initiate a chat interface to effectively address the student's query, providing a comprehensive and enriching learning experience.


