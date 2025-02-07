# RoomReservation
## Overview
RoomReservation is a full-stack application for managing room reservations. For the purpose of this assignment, it is assumed that there is only one user. The user is allowed to create reservations for rooms that do not already have a conflicting reservation during the selected time. The user will also be able to manage rooms: they can edit existing rooms, delete rooms (along with their corresponding reservations since the room no longer exists), and add new rooms. Finally, the user will be able to view all their reservations, sorted by the start date. On this page, the user can cancel any of their reservations.


## The Project Consists of:

* A Vue 3 frontend located in the room-reservation-client folder.

* A Node.js backend located in the room-reservation-server folder.

* A MongoDB Atlas database.

Both the frontend and backend have been dockerized, and their respective Dockerfiles are included in the repository.

⚠️ Note: For the purpose of this technical interview, the MongoDB Atlas credentials have been provided inside the application. However, this is not considered best practice for security reasons.

## Folder Structure:

### room-reservation-client
#### &nbsp;&nbsp;&nbsp;&nbsp; Components - Contains all reusable components
#### &nbsp;&nbsp;&nbsp;&nbsp; Services - Provides services for retrieving data from the backend and sending it to the frontend
#### &nbsp;&nbsp;&nbsp;&nbsp; Views - Holds the main pages that users interact with when using the application
#### &nbsp;&nbsp;&nbsp;&nbsp; Router - Manages all URL routing within the application
#### &nbsp;&nbsp;&nbsp;&nbsp; Stores - Stores all Pinia state management used throughout the project


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

### room-reservation-server
#### &nbsp;&nbsp;&nbsp;&nbsp; Controller - Handles all incoming API requests from the client and calls services to process requests
#### &nbsp;&nbsp;&nbsp;&nbsp; Services - Handles all logic regarding the request the user has made on the front end
#### &nbsp;&nbsp;&nbsp;&nbsp; Repository - Handles primitive calls that will be made to the database ie. search, findByID, etc...
#### &nbsp;&nbsp;&nbsp;&nbsp; Model - Defines the structure and rules for the documents within the MongoDB colletions

## Installation Steps:
### Option 1: Use Dockers to run the application
#### Step 1: Run the Dockerfile on both the client/server folder to create your docker images.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

#### Building Docker Image for the server

```console
cd room-reservation-server
```
```console
docker build -t room-reservation-server . 
```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

#### Building Docker Image for the client

```console
cd room-reservation-client
```
```console
docker build -t room-reservation-vue-dev .
```

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

#### Step 2: Create a container from your Docker image (The Docker images should have been created from the previous command)

##### To create a container for the server run this command: 

```console
docker run -p 8080:8080 room-reservation-server
```

##### To create a container for the client run this command:  

```console
docker run -p 5173:5173 room-reservation-vue-dev
```

#### Step 3: Run the client:

##### Run the following URL on your browser:
```console
http://localhost:5173/
```



### Option 2: Run it locally by installing dependencies

#### Step 1: npm install for both the client and the server
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

```console
cd room-reservation-client
```

```console
npm i
```

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

```console
cd room-reservation-server
```

```console
npm i
```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

#### Step 2: Run the client and the server:

##### To run the server run this command: 
```console
npx nodemon server.js
```

##### To run the client run this command: 
```console
npm run dev
```

## The Application Should be Running on:
Frontend: http://localhost:5173

Backend: http://localhost:8080


## To Run Unit Tests:

Frontend:

```console
npm run test:unit
```

Backend: 

```console
npm test
```

## Technologies Used
Frontend: Vue 3, Vite, Pinia (State Management), Vitest (Unit Testing)

Backend: Node.js, Express, Jest (Unit Testing) 

Database: MongoDB Atlas

Containerization: Docker
