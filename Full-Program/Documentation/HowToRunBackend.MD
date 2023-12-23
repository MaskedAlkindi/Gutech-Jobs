# HowToRunBackend-Gutech Jobs

## Introduction
This document provides a comprehensive guide on setting up the backend for the Gutech Jobs application. It covers the steps to create a MySQL database, configure the server, and set up Firebase integration.

## Prerequisites
- Basic knowledge of MySQL, Node.js, and Firebase.
- MySQL Database Management System installed.
- Node.js installed.

## Step 1: Setting up the MySQL Database
1. **Locate the SQL Script**: Find the `MySQL.txt` file in the `Full-program/Documentation` directory. This file contains SQL scripts to create the necessary database and tables.
2. **Execute the SQL Script**: Open your MySQL database management system and execute the script from `MySQL.txt`. This will create the database with all the required tables and columns.
3. **Gather Database Credentials**: After the database setup, make sure to note down the database credentials: host, user, and name. These will be used in the `.env` file.

## Step 2: Configuring the Node.js Server
1. **Access the Server File**: Navigate to `full-program/src/backend` and find the `server.js` file. This file contains the Node.js endpoints for the application.
2. **Environment Variables Setup**:
   - Rename `.env.example` to `.env`.
   - Fill in the environment variables in the `.env` file:
     - `JWT_SECRET=`
     - `SENDGRID_API_KEY=`
     - `SENDER_EMAIL=`
     - `DB_HOST=` (your MySQL host)
     - `DB_USER=` (your MySQL user)
     - `DB_PASSWORD=` (your MySQL password)
     - `DB_NAME=` (your MySQL database name)
3. **Generating JWT Secret**:
   - Open the command prompt.
   - Use a suitable method to generate a secure JWT secret, like using Node.js: `require('crypto').randomBytes(64).toString('hex')`.
   - Copy and paste the generated secret into the `JWT_SECRET` field in the `.env` file.
4. **Node.js Installation**: If you haven't installed Node.js, download and install it from [the official Node.js website](https://nodejs.org/).

## Step 3: Setting Up Firebase
1. **Locate Firebase Configuration**: Go to `full-program/src/firebase` and open the `firebase.js` file.
2. **Create a Firebase Project**:
   - Visit the [Firebase Console](https://console.firebase.google.com/).
   - Create a new Firebase project.
   - Once created, navigate to the project settings to find your project's configuration details.
3. **Configure Firebase in the Application**:
   - Replace the placeholders in `firebaseConfig` within `firebase.js` with your Firebase project details:
     ```javascript
     const firebaseConfig = {
       apiKey: "your_api_key",
       authDomain: "your_auth_domain",
       projectId: "your_project_id",
       storageBucket: "your_storage_bucket",
       messagingSenderId: "your_messaging_sender_id",
       appId: "your_app_id",
       measurementId: "your_measurement_id"
     };
     ```
   - Save the changes to `firebase.js`.

## Step 4: Running the Server
1. **Run the Server**:
   - Open a command prompt or terminal in the `full-program/src/backend` directory.
   - Run the command `node server.js`.
   - This will start the Node.js server using the configurations specified in the `server.js` file and `.env` file.

## Conclusion
After completing these steps, your backend should be correctly set up and configured for the Gutech Jobs application. Ensure that all the environment variables are correctly filled in and that the server and Firebase are correctly configured. The application's backend is now ready to be used.