# Green Cycle - Waste Management System

Green Cycle is a smart waste management platform designed for scheduling, tracking, and organizing garbage collection and recycling services effectively.

## Features
- **User Authentication**: Secure Login & Registration system using PHP and MySQL.
- **Service Requests**: Users can request residential, commercial, or hazardous waste collection effortlessly via interactive modals.
- **Request Tracking**: Real-time tracking of generated waste collection requests via unique Tracking IDs.
- **Collection Schedules**: View and schedule upcoming or past collection dates dynamically.
- **Live Interactions**: Asynchronous `fetch` calls prevent page reloads and handle dynamic forms.
- **Contact Form**: Built-in system to leave inquiries or messages.

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS via fetch API), FontAwesome
- **Backend**: PHP 
- **Database**: MySQL (via XAMPP)

## Setup Instructions
1. Ensure [XAMPP](https://www.apachefriends.org/index.html) is installed on your system.
2. Place this project folder inside your `xampp/htdocs` directory (e.g., `d:/xampp/htdocs/project`).
3. Open the **XAMPP Control Panel** and start both **Apache** and **MySQL**.
4. Set up the database:
   - Run the provided setup script by navigating to `http://localhost/project/setup_db.php` in your browser.
   - This will automatically create the `greencycle` database along with the essential tables (`users`, `requests`, `schedules`, `contacts`).
5. Once DB setup is complete, navigate to `http://localhost/project/` to access the main application.

## Core API Endpoints
- `login.php` & `register.php`: Handles user sessions and authorization routines.
- `request.php`: Handles creation (POST) and status fetching (GET) of waste collection queries.
- `schedule.php`: Fetches globally generated schedules or adds new scheduling parameters.
- `contact.php`: Stores form queries into the site's database securely.
