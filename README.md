# InterviewAce

InterviewAce is a frontend placement preparation web app for students.  
It helps users practice Aptitude, Coding, and HR Interview questions in one place, with login/register flow and a progress dashboard.

## Live Project Goal

Build confidence for campus placements through:
- Quick aptitude quiz practice
- Beginner-friendly coding question review
- Random HR interview question practice
- Personal progress tracking

## Features

- User Registration and Login
- Session-based access control (public pages: Login, Register)
- Aptitude Quiz:
  - 5 MCQ questions
  - 15-second timer per question
  - instant feedback
  - final score
- Coding Practice:
  - 5 beginner coding questions
  - reveal/hide answer option
- HR Interview Practice:
  - random interview questions
  - motivational quotes
- Dashboard:
  - aptitude score display
  - progress bar
  - section completion status (Aptitude, Coding, Interview)
- Dark Mode toggle
- Fully responsive UI

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- LocalStorage for data persistence

## Project Pages

- Home: index.html
- Register: register.html
- Login: login.html
- Aptitude: aptitude.html
- Coding: coding.html
- Interview: interview.html
- Dashboard: dashboard.html

## Project Structure

- index.html - landing page and navigation
- register.html - account creation
- login.html - user login
- aptitude.html - quiz module
- coding.html - coding practice module
- interview.html - HR question module
- dashboard.html - progress and score view
- style.css - full styling (theme, animations, layout)
- script.js - application logic and localStorage handling

## How to Run

1. Download or clone this repository.
2. Open the project folder.
3. Open login.html in a browser to start with authentication.
4. Register a new account and continue using the app.

## Data Storage (Local)

This project uses browser LocalStorage for:
- user accounts
- auth session token
- dark mode preference
- aptitude score per user
- section completion status per user

No backend or database is used.

## Future Improvements

- Add backend authentication and secure password hashing
- Store user data in a database
- Add more quiz and coding questions
- Add interview answer tips and scoring
- Add charts and analytics in dashboard

## Author

Kirubhakaran
