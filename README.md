# University Portal - Academic & Hostel Service Automation

A comprehensive, full-stack MERN application designed to automate and streamline the academic and administrative workflows of a university. This platform provides dedicated portals for Students, Faculty, and Administrators, reducing manual work and improving efficiency.

This project was developed as a part of the curriculum, demonstrating proficiency in modern web technologies, database management, and secure authentication practices.
## Table of Contents
About The Project
✨ Features
🛠️ Tech Stack
🏗️ System Architecture
🗃️ Database Schema
🚀 Getting Started
    ---------->Prerequisites
    ---------->Local Setup
▶️ Usage
📜 License
📧 Contact

## About The Project

The academic section at the university currently manages critical tasks—including course registrations, grade submissions, transcript generation, and hostel service requests—through heavily **manual, paper-based workflows**. This leads to significant inefficiencies, administrative delays, and a high potential for human error.

This project, **Automation of the Academic & Hostel Sections**, is a full-stack web-based solution designed to **digitize and automate** these core administrative functions.

### Core Goals

* **Minimizing Manual Effort:** Eliminate dependency on paper records for student data, course enrollment, and document requests.
* **Enhancing Accuracy:** Implement real-time digital systems for grade upload, attendance tracking, and record updates.
* **Seamless Digital Experience:** Provide secure, role-based access for Administrators, Faculty, and Students.
* **Hostel Service Digitization:** Centralize and automate the entire workflow for hostel service requests (mess, room transfer, complaints, and leave applications).

---
## ✨ Features
This application is built with role-based access control (RBAC), ensuring that Administrators, Faculty, and Students have unique dashboards and access only to the features relevant to their tasks.

__A. Administrator Features (Central Control)__
The Admin section provides holistic management over all core university resources and student services.

1. __User Management:__ Centralized view of all Faculty, Students, and other Admins for CRUD operations (Create, Delete, Modify accounts).

2. __Course Management:__ Ability to add, delete, and modify course details, credits, and department assignments.

3. __Timetable Management:__ Features to view, create, and upload new departmental timetables.

4. __Hostel Request Handling:__ Centralized module to review, filter, and process all student-submitted hostel requests (Mess, Room Transfer, Complaints).

5. __Action:__ Approve/Reject pending requests and add administrative notes.

__B. Faculty Features (Academic Operations)__
Faculty tools focus on course delivery, grading, and student monitoring.

1. __Profile Management:__ Ability to edit/update personal profile and contact information.

2. __Course Roster:__ View and manage assigned courses and monitor student enrollment lists.

3. __Assignment Portal:__ Create, upload, and view assignments for specific courses and set deadlines.

4. __Attendance Tracking:__ Feature to update and submit class attendance records in real-time.

5. __Grade Submission:__ Secure module for uploading and submitting student grades at the end of a term.

__C. Student Features (Academic and Services)__
The student portal provides access to personal academic records and hostel services.

1. __Profile & Settings:__ Ability to update/edit personal and contact details.

2. __Course Management:__ View enrolled courses and register for new courses during the enrollment window.

3. __Academic Progress:__ Centralized view for all academic records:

4. __Assignments:__ View submitted assignments, grades, and feedback.

5. __Attendance:__ Check individual course attendance summaries and shortage alerts.

6. __Grades:__ View official grades and academic history.

7. __Achievements:__ Module to view and manage recorded student achievements and certifications.

8. __Requests & Leave:__ Submit and track the status of leave applications.

9. __Hostel Service Requests:__ Submit various service requests:

10. __Mess:__ Update/change monthly mess subscription plan.

11. __Room Transfer:__ Submit a room transfer request.

12. __Complaint:__ Register complaints regarding infrastructure, gym, or sports facilities.

13. __Resource Hub:__ Access and download shared academic resources and files (e.g., syllabi, notes).

## 🛠️ Tech Stack
This project is built using a modern, scalable architecture designed for high availability and concurrent user access.

| Area | Technology | Purpose |
|---------|---------------|------------|
| Server Runtime | Node.js | Backend execution environment. |
| Web Framework | Express.js | Minimal and flexible framework for building RESTful APIs. |
| Database | MongoDB (Atlas) | Document-based NoSQL database for flexible data modeling (Student Records, Courses, Requests). |
| ODM (Abstraction) | Mongoose | Provides schema-based data modeling and interaction with MongoDB. |
| Authentication | JSON Web Tokens (JWT) |  Secure, stateless, token-based authentication (integrated with RBAC). |
| Frontend UI | HTML5 / Vanilla JavaScript |  Core structure and client-side logic for dynamic dashboard features |
| Styling | Tailwind CSS | Utility-first framework for rapid, responsive styling (KGF dark/gold theme). |
| Security | CORS | Middleware used to secure cross-origin resource sharing between frontend and backend. |

## 🏗️ System Architecture

The application employs a standard 3-tier architecture to separate the user interface, business logic, and data storage. The system is designed to handle multiple concurrent users across the three primary roles securely and efficiently.

### System Flowchart

The following flowchart illustrates the operational path for data and requests across the system's roles and core modules:



### Architecture Breakdown

* **Client Layer (Frontend):** Handles presentation and user interaction (HTML/Tailwind CSS). It communicates solely with the API layer via asynchronous JavaScript calls.
* **API Layer (Backend):** Built with Node.js/Express. It acts as the central hub, handling:
    * Authentication and Authorization (JWT and RBAC).
    * Business Logic processing (e.g., validating course registration rules, processing hostel requests).
    * Data routing to and from the MongoDB database.
* **Data Layer (MongoDB):** Stores all application data, including user records, course definitions, academic progress (grades, attendance), and pending hostel requests.

---

## 🗃️ Database Schema (Key Collections)

The MongoDB database utilizes several key collections to manage the complexity of academic and hostel services data. Relationships (references) are used extensively to connect users to their courses, grades, and requests.

| Collection Name | Purpose | Key Data Fields / Relationships |
| :--- | :--- | :--- |
| **Users** | Stores accounts for all roles (Admin, Faculty, Student). | `fullName`, `email`, `role`, `department`, `password`, `isBlocked` |
| **Courses** | Defines all available courses. | `courseCode`, `courseName`, `credits`, `department`, `faculty (ref: User)` |
| **Timetables** | Stores timetable image/URL data. | `department`, `year`, `section`, `imageUrl` |
| **AcademicRecords** | Stores individual student academic progress. | `student (ref: User)`, `course (ref: Course)`, `grade`, `attendance (%)` |
| **Assignments** | Stores faculty assignments and student submissions. | `course (ref: Course)`, `faculty (ref: User)`, `dueDate`, `submissionFile`, `grade` |
| **HostelRequests** | Central collection for all automated service requests. | `student (ref: User)`, `type` (Mess/Room/Complaint/Leave), `status` (Pending/Approved), `details` (JSON object) |

---
## 🚀 Getting Started
Follow these steps to set up your environment, connect to MongoDB Atlas, and run the full-stack application locally.

__Prerequisites__
You must have the following software installed on your development machine:

1. __Node.js & npm (Node Package Manager):__ Download the latest LTS version.

2. __MongoDB Atlas Account:__ A free-tier account for cloud database hosting.

3. __Git:__ For cloning the repository.

4. __Code Editor:__ VS Code is recommended.

__A. Database Setup (MongoDB Atlas)__
This guides you from a fresh account to obtaining the crucial connection string.

1. __Create a Cluster:__ Log in to MongoDB Atlas and create a new free-tier cluster.

2. __Network Access (IP Whitelist):__ 

1. 1. Navigate to the Network Access tab under Security.

1. 2. Click ADD IP ADDRESS and select "Allow Access from Anywhere" (0.0.0.0/0).

1. 2. 1. (Note: This is for development convenience. For production, add only your specific public IP address.)

1. __Database User:__

1. 1. Navigate to the Database Access tab.

1. 2. Click ADD NEW DATABASE USER. Create a user with a strong password (you will need this password shortly). Grant the user Read and Write to any database.

1. __Get Connection String:__

1. 1. Go back to the Database view (Overview).

1. 2. Click CONNECT on your cluster.

1. 3. Select "Drivers".

1. 4. Copy the connection string URL provided. It will look like this:
2. mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myDatabase?retryWrites=true&w=majority
 
__B. Local Setup (Backend)__

1. git clone https://github.com/Manoj0011290/IITGCS_14061453--Automation-of-the-Academic-Section-Hostel-Services-at-your-University
1. cd [YOUR_PROJECT_FOLDER]/backend

1. __Install Dependencies:__
2. npm install

1. __Create Environment File:__
2. In the root of your backend folder, create a new file named .env

1. __Configure Environment Variables:__
2. Paste the following structure into your .env file, replacing the placeholders with your actual values:
3. --- Server Configuration ---
PORT=5000

1. --- Database Configuration ---
Replace <username> and <password> with your Atlas Database User credentials
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/university_db?retryWrites=true&w=majority"

1. --- Security/Authentication ---
JWT_SECRET="A_VERY_LONG_AND_RANDOM_STRING_FOR_JWT_SIGNING"

1. __Start the Server:__
2. npm start 
#The server will run and connect to the database.

## ▶️ Usage
The frontend is a single-page application built with HTML and Vanilla JavaScript. It communicates with the backend API running on http://localhost:5000.

__Running the Frontend Dashboard__
1. __Use a Local Development Server (Recommended):__
To avoid CORS (Cross-Origin Resource Sharing) issues that commonly occur when a browser tries to load data from http://localhost:5000, it is best to serve your frontend files via a local server.

2. 1.  __VS Code Live Server:__ If you are using VS Code, right-click your admin.html file and select "Open with Live Server." This will open the file at an address like http://127.0.0.1:5500.

1. __Access the Dashboard:__
Open the file in your browser: http://127.0.0.1:5500/admin.html (or the address provided by your local server).

__Authentication and Access__
The dashboard requires a valid JSON Web Token (JWT) to authorize API requests.

1. __Login:__ Access your login page (e.g., login.html) and submit administrator credentials to the backend login endpoint (/api/auth/login).

2. __Store Token:__ Upon successful login, the backend will return a JWT. This token must be saved in the browser's Local Storage under the key authToken.

1. Example: localStorage.setItem('authToken', 'YOUR_RETRIEVED_JWT_TOKEN');

1. __Full Access:__ Once the authToken is present in local storage, the admin.html dashboard will successfully load the user list, courses, and hostel requests by including the token in the Authorization: Bearer <token> header for every API call.

__Initial User Creation__
If this is the first time running the system, you may need to use a simple script or a tool like Postman to hit your backend's initial /api/auth/register endpoint to create the first Admin user.

## 📜 License

This project is licensed under the **MIT License**. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided you include the original copyright and permission notice.

## 📧 Contact

__Manoj Gowda B S__ – manojgowda6964@gmail.com

__Project Link:__
https://github.com/Manoj0011290/IITGCS_14061453--Automation-of-the-Academic-Section-Hostel-Services-at-your-University

---





