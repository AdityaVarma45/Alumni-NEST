# AlumniNest 🎓

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

A mentorship networking platform that connects **students with alumni mentors** for career guidance, industry insights, and opportunities.

AlumniNest enables students to discover mentors based on their **skills and interests**, send mentorship requests, and communicate with alumni through **real-time chat**.

🔗 Live: https://alumni-nest.onrender.com

Try the platform and explore the mentorship features.


<img width="1920" height="1080" alt="Screenshot (141)" src="https://github.com/user-attachments/assets/8ef58b17-04fa-4485-877d-8e9bfcd69a9e" />


---

## Problem It Solves

Students often struggle to connect with experienced alumni for career advice, networking, and opportunities.

**AlumniNest bridges this gap** by creating a platform where students can discover alumni mentors, request mentorship, and build meaningful professional relationships.

---

## Key Features

- 🎓 Mentor discovery based on shared skills and interests  
- 🤝 Mentorship request and offer system between students and alumni  
- 💬 Real-time chat using Socket.io after mentorship acceptance  
- 📢 Opportunity sharing for internships, jobs, and referrals  
- 🔔 Notification system for mentorship updates and new opportunities  
- 👤 Customizable user profiles with skills and interests  
- 🔐 Secure authentication using JWT-based login system  
- 🔑 Password protection using bcrypt hashing  
- 🛡️ Role-based access control for students and alumni  
- 📱 Responsive UI supporting both desktop and mobile devices

---

# Features

## Mentor Discovery

Students receive **alumni recommendations** based on their skills and interests, helping them connect with relevant mentors.

<img width="1920" height="1080" alt="Screenshot (140)" src="https://github.com/user-attachments/assets/5525b69b-84fd-4962-b0b6-dcee179b4d75" />


---

## Mentorship Requests & Offers

Students can send **mentorship requests**, while alumni can **offer mentorship** to students they wish to guide.

<img width="1920" height="1080" alt="Screenshot (97)" src="https://github.com/user-attachments/assets/0accded9-b467-4a25-9ba3-7b6792115d73" />

<img width="1920" height="1080" alt="Screenshot (98)" src="https://github.com/user-attachments/assets/f6df5f77-9d53-4ffc-8a22-a778584d06ba" />

<img width="1920" height="1080" alt="Screenshot (85)" src="https://github.com/user-attachments/assets/df1903e7-5cad-4045-b3bf-60a2dd76875b" />

---

## Real-Time Chat

Once mentorship is accepted, users can communicate using **real-time messaging powered by Socket.io**.

<img width="1920" height="1080" alt="Screenshot (82)" src="https://github.com/user-attachments/assets/39ac565b-f1b8-4263-a132-4b36262212dc" />

<img width="1920" height="1080" alt="Screenshot (86)" src="https://github.com/user-attachments/assets/66354347-4ce6-4747-abb7-309f2197722a" />

---

## Opportunity Sharing

Alumni can share **internships, job openings, and referrals** with students through the platform.

<img width="1920" height="1080" alt="Screenshot (77)" src="https://github.com/user-attachments/assets/87ce9c35-0b95-4511-9b19-31214de50333" />

<img width="1920" height="1080" alt="Screenshot (80)" src="https://github.com/user-attachments/assets/1e5f1a11-00e7-4286-9b2a-a8d15dbbc3f3" />

---

## Notifications

Users receive notifications for important events such as:

- Mentorship requests  
- Mentorship responses  
- New opportunities  
- Chat messages  

<img width="1920" height="1080" alt="Screenshot (88)" src="https://github.com/user-attachments/assets/f3b8bc82-aa5e-477c-9bca-b87dfd2cdbec" />

---

## Profile Customization

Users can enhance their profiles by adding:

- Skills  
- Interests  

These details are used to **improve mentor recommendations**.

<img width="1920" height="1080" alt="Screenshot (78)" src="https://github.com/user-attachments/assets/2e42a80b-6a22-46d0-8276-a6c0eb1293fa" />

---

# Module Structure

<img width="1920" height="1080" alt="Screenshot (91)" src="https://github.com/user-attachments/assets/ac16d867-92c0-4625-b400-8d256ed91d58" />

<img width="1920" height="1080" alt="Screenshot (90)" src="https://github.com/user-attachments/assets/0b9e0f2a-070a-4965-86d2-f0cd3594a636" />

---

# Project Structure

```
alumninest
│
├── client
│   ├── components
│   ├── pages
│   └── context
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── middleware
```

---

# Tech Stack

## Frontend

- React  
- React Router  
- Tailwind CSS  
- Lucide Icons  

## Backend

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

## Real-Time Communication

- Socket.io  

## Authentication

- JWT (JSON Web Tokens)

---

# Architecture Overview

The platform follows a **client–server architecture**.

- The **frontend** handles UI rendering and API communication.
- The **backend** manages authentication, mentorship logic, chat messaging, and notifications.

### Core Modules

- User Management  
- Mentorship System  
- Opportunity Sharing  
- Real-Time Chat  
- Notification System  

---

# Future Improvements

- Video mentorship sessions  
- Advanced recommendation algorithm  
- University-based alumni grouping  
- Profile verification system  
- File sharing in chat  

---

# License

This project is shared publicly for learning and portfolio purposes.

You’re welcome to explore the code and take inspiration, but please avoid copying or reusing it directly for your own projects.

If you’d like to use any part of it, feel free to reach out for permission.

© 2026 Mahesh Aditya Varma

---

# Author

**Mahesh Aditya Varma**
