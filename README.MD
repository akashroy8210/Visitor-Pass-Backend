# VISITOR PASS

# Backend Visitor Pass

## Description
-item 1 User verification /role basis ("Admin", "Employee", "Security")
-item 2 User Verification /visitors 
-item 3 Employee approved visitors
-item 4 Security check-in/check-out detils 
-item 5 Visitor create request for approval 
-item 6 Employee view visitor details/send confirmation email to visitor/Give Scheduled time for visit
-item 7 Visitor check-in/check-out details
-item 8 Admin view all details of visitors/employee/security/logs  Details

## Technologies Used

### Core Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose

### Features and Libraries

- JWT (JSON Web Tokens) for authentication
- Nodemailer for sending emails
- bcrypt for password hashing
- cloudinary for image upload and storage
- multer for handling file uploads
- pdfkit for generating PDF reports
- validator for input validation
  
### supporting technologies

- dotenv for environment variable management
- cors for handling Cross-Origin Resource Sharing

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
    cd visitor-pass-backend
    ```
3. Install dependencies:
4. ```bash
    npm install
    ```
5. Create a `.env` file in the root directory and add the following environment variables:
   ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
   ```
6. Start the server:
   ```bash
    npm start
    ```
## Create Project from basic
1. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```
2. Install necessary dependencies:
   ```bash
   npm install express mongoose jsonwebtoken bcrypt nodemailer multer cloudinary pdfkit validator dotenv cors
   ```
3. Create the following folder structure:
   ```
   -index.js/
   -config/
     -db.js
     -cloudinary.js
    -models/
        -User.js
        -visitors.js
        -Appointment.js
        -Passes.js
        -Check Logs.js
        -otp.js
    -routes/
        -auth.js
        -visitors.js
        -appointments.js
        -passes.js
        -checklogs.js
    -controllers/
        -authController.js
        -visitorController.js
        -appointmentController.js
        -passController.js
        -checkLogController.js
    -middleware/
        -authMiddleware.js
        -roleMiddleware.js
    -utils/
        -emailService.js
        -pdfGenerator.js
    ```
4. Set up the Express server in `index.js`.
5. connect the MongoDB database using Mongoose in `config/db.js`.
6. Implement authentication and authorization logic in `controllers/authController.js` and `middleware/authMiddleware.js`.
7. Create routes for handling visitor management, appointments, passes, and check logs in the respective route files.
8. Implement the business logic for each feature in the corresponding controller files.
9. Use utility functions for sending emails and generating PDFs as needed.
10. Test the API endpoints using tools like Postman or Thunder Client.
11. 


