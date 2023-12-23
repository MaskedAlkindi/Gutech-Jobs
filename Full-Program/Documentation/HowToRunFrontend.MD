# HowToRunFrontend-Gutech Jobs

## Introduction
This guide will walk you through the process of setting up and running the frontend for the Gutech Jobs application. The frontend is built using React and was initialized with Create React App.

## Prerequisites
- Basic understanding of React and Node.js.
- Node.js and npm (Node Package Manager) installed.

## Initial Setup
1. **Navigate to Project Directory**:
   - Open a command prompt or terminal.
   - Change directory to the root of your frontend project: `cd Full-Program`.

2. **Install Dependencies**:
   - Run `npm install` to install all the necessary dependencies for the project as defined in the `package.json` file.

## Running the Application
1. **Start the Development Server**:
   - Execute `npm start` to run the app in development mode.
   - Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
   - The page will automatically reload if you make changes to the code.
   - You will see any lint errors in the console.

2. **Running Tests**:
   - Use `npm test` to launch the test runner in interactive watch mode.
   - More information on running tests can be found [here](https://facebook.github.io/create-react-app/docs/running-tests).

3. **Building for Production**:
   - Run `npm run build` to build the app for production to the `build` folder.
   - It correctly bundles React in production mode and optimizes the build for the best performance.
   - The build is minified, and filenames include hashes.
   - Your app is now ready to be deployed! Deployment information can be found [here](https://facebook.github.io/create-react-app/docs/deployment).

4. **Optional: Ejecting from Create React App**:
   - If you need to customize the configuration, you can run `npm run eject`.
   - This is a one-way operation and cannot be reversed.
   - It will copy all configuration files and transitive dependencies into your project, giving you full control over them.
