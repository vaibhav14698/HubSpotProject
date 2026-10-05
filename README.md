# HubSpot Project

This project is a Node.js-based HubSpot integration application designed to connect with the HubSpot CRM platform and manage CRM-related functionality through HubSpot APIs. The application uses Express.js for the backend, Pug for server-side views, and environment variables for securely managing configuration and API credentials. The project provides a structured foundation for working with HubSpot CRM records and can be extended with additional features such as contact management, company management, deals, authentication, and other HubSpot API integrations.

## Technologies Used

- Node.js
- Express.js
- Pug
- HubSpot API
- HTML/CSS
- JavaScript

## Project Structure

- `index.js` – Main application entry point
- `views/` – Pug templates and UI pages
- `package.json` – Project dependencies and scripts
- `.gitignore` – Files excluded from Git tracking
- `.env` – Local environment configuration (not committed to GitHub)

## Setup

Clone the repository, install the required dependencies, configure the required HubSpot environment variables in a local `.env` file, and start the application.

```bash
npm install
npm start
