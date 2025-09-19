# Forum Information Academy MERN Stack Project

## Overview
This project is a web application for the Forum Information Academy, built using the MERN stack (MongoDB, Express, React, Node.js). It provides a platform for users to explore courses, apply for programs, and access various resources related to information technology education.

## Project Structure
The project is organized into two main directories: `client` and `server`.

### Client
The `client` directory contains the React application, which is responsible for the front-end user interface.

- **public/**: Contains static files such as HTML, CSS, JavaScript, images, and videos.
- **src/**: Contains the React components, pages, context providers, and utility functions.
- **package.json**: Lists the dependencies and scripts for the client-side application.
- **README.md**: Documentation specific to the client-side application.

### Server
The `server` directory contains the Node.js and Express backend, which handles API requests and database interactions.

- **config/**: Contains configuration files, including database connection settings.
- **controllers/**: Contains business logic for handling requests related to users, courses, applications, and news.
- **middleware/**: Contains middleware functions for authentication and error handling.
- **models/**: Contains Mongoose models for the application's data structures.
- **routes/**: Contains route definitions for handling API requests.
- **server.js**: The entry point for the server application.
- **package.json**: Lists the dependencies and scripts for the server-side application.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running, or access to a MongoDB database.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd forum-academy-mern
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd ../server
   npm install
   ```

### Running the Application
1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Features
- User authentication for students and faculty.
- Course catalog with detailed information.
- Application form for prospective students.
- News and events section to keep users updated.
- Testimonials from students.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
