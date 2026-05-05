# Language Analyzer Frontend

`Language Analyzer Frontend` is the client-side interface for the Marathi language correction platform. It provides a responsive chat-style user experience for submitting incorrect Marathi text, viewing AI-corrected output, managing user sessions, and accessing profile and history features through integration with the backend API.

This project highlights practical frontend engineering with real backend connectivity, authentication-aware flows, responsive UI behavior, and deployment-oriented integration. For recruiters, it demonstrates the ability to build not just a backend service, but a usable product interface around it.

## Project Highlights

- Built as a lightweight frontend using `HTML`, `CSS`, `JavaScript`, and `Tailwind CSS`.
- Provides a chat-inspired interface for Marathi sentence correction.
- Includes dedicated login and signup pages for user onboarding.
- Connects to a live backend API hosted on an AWS instance.
- Stores JWT tokens in browser `localStorage` for authenticated sessions.
- Includes profile and history views for a more complete product experience.
- Implements responsive layout behavior for desktop, tablet, and mobile screens.
- Uses a sidebar-based interaction pattern with chat, history, profile, and logout actions.

## What This Frontend Does

The frontend acts as the user-facing layer of the Language Analyzer platform.

Core responsibilities:

1. Allow users to create an account or log in.
2. Send Marathi text to the backend correction API.
3. Display corrected output in a conversational UI.
4. Fetch and show profile details for authenticated users.
5. Surface previous chat history through a sidebar-driven interaction flow.

This makes the project more than a static website. It is a real frontend integrated with a working backend system.

## Tech Stack

### Frontend
- `HTML5`
- `CSS3`
- `JavaScript`

### UI and Styling
- `Tailwind CSS` via CDN
- custom responsive CSS in `style.css`
- page-level styling embedded inside the HTML files

### Backend Integration
- REST API communication using browser `fetch`
- JWT-based session handling through `localStorage`
- hosted backend connection via a public AWS instance IP

## Project Structure

```text
language_analyzer_frontend/
|-- index.html          # Main chat application UI
|-- login.html          # Login page
|-- signup.html         # Signup page
|-- app.js              # Main application logic and API calls
|-- auth.js             # Authentication page logic
|-- style.css           # Shared responsive styling
|-- favicon.ico         # Application icon
|-- counter.js          # Vite starter file currently unused in core flow
|-- tailwind.config.js  # Present but currently empty
`-- README.md
```

## Page Overview

### `index.html`
This is the main application interface. It includes:

- a sidebar for navigation,
- a welcome screen,
- a chat area for user input and corrected responses,
- profile and history sections,
- responsive mobile sidebar handling,
- a polished dark-themed UI for the main user workflow.

### `login.html`
Provides the login experience for returning users:

- email and password input,
- error handling UI,
- redirect to the main application after successful authentication.

### `signup.html`
Provides the registration experience for new users:

- name, email, and password onboarding flow,
- OTP-related UI steps for email verification,
- redirect path into the main application after signup.

## JavaScript Logic Breakdown

### `app.js`
This file drives the main app behavior:

- checks authentication on page load,
- redirects unauthenticated users to `login.html`,
- sends user text to the backend `/analyze` endpoint,
- renders chat bubbles for both user input and AI-corrected responses,
- loads profile data from `/auth/profile`,
- manages chat resets and sidebar interactions,
- supports a history dropdown experience,
- handles logout by clearing the stored JWT token.

### `auth.js`
This file manages authentication-related frontend behavior:

- submits login requests to `/auth/login`,
- submits signup requests to `/auth/signup`,
- stores the JWT token after successful authentication,
- redirects authenticated users to `index.html`,
- displays loading states and inline error messages,
- includes OTP request and OTP verification calls for signup flow enhancement.

## Backend Integration

The frontend is currently configured to communicate with:

```text
http://72.60.202.62
```

This shows that the project is connected to a hosted backend rather than only a localhost development API.

The frontend uses the following backend routes:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/profile`
- `POST /analyze`
- `GET /history`
- `POST /auth/send-otp`
- `POST /auth/verify-otp`

From a portfolio standpoint, this is valuable because it demonstrates real frontend-to-backend integration and cloud-hosted API usage.

## User Flow

### Authentication Flow

1. A new user opens `signup.html` to create an account.
2. An existing user opens `login.html` to authenticate.
3. On successful login or signup, a JWT token is saved in `localStorage`.
4. The user is redirected to `index.html`.
5. Protected frontend actions use the stored token in API requests.

### Text Correction Flow

1. The user types an incorrect Marathi sentence into the input box.
2. The frontend sends the request to the backend `/analyze` API.
3. The backend returns corrected text.
4. The corrected output is displayed as an AI-style chat response.

### Profile and History Flow

1. The user opens the sidebar.
2. The user can switch to profile or history views.
3. The frontend requests profile or previous conversation data from the backend.
4. Results are rendered inside the interface without leaving the app.

## UI and UX Features

The frontend is intentionally designed to feel more like a usable product than a plain form-based demo.

Notable interface choices:

- dark theme for a modern app-like experience,
- animated chat bubbles and welcome-state transitions,
- copy-to-clipboard action for corrected responses,
- collapsible sidebar for navigation,
- mobile overlay and slide-in sidebar behavior,
- responsive typography and spacing adjustments across screen sizes.

These choices improve the presentation value of the project during demos and interviews.

## Responsive Design

The application includes responsive behavior for different screen sizes:

- mobile-friendly login and signup containers,
- mobile sidebar open/close interactions,
- adaptive chat bubble widths,
- resized header and input areas for smaller devices,
- tablet and desktop layout adjustments for improved readability.

This is useful for showing that the project was built with real users and multiple device sizes in mind.

## AWS Deployment Positioning

One of the strongest portfolio points in this frontend is that it is already wired to a live backend hosted on an AWS instance.

Recruiter-facing value:

- frontend integrated with a cloud-hosted backend,
- practical knowledge of calling a public API from a deployed interface,
- understanding of how frontend and backend pieces connect outside local development,
- experience working with production-style base URLs rather than only localhost testing.

Together with the backend project, this helps present the work as a complete deployed application rather than an isolated code sample.

## Local Development Setup

Because this project is a static frontend, setup is simple.

### 1. Open the project folder

```bash
cd language_analyzer_frontend
```

### 2. Serve it locally

You can use a simple static server. For example:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

This matches the backend CORS configuration that already allows `http://localhost:5500`.

## Important Implementation Notes

A few integration details are worth knowing when presenting or extending this project:

- the frontend stores authentication tokens in `localStorage`,
- the API base URL is currently hardcoded in JavaScript,
- `tailwind.config.js` is present but currently empty because Tailwind is loaded through CDN,
- the signup page includes OTP-related frontend logic, which expects matching backend endpoints,
- the chat request currently sends a fixed `user_id` value in the request body.

These are normal areas for future refinement and also give you good talking points in interviews about what you would improve next.

## Why This Project Stands Out

This frontend is a strong portfolio project because it demonstrates:

- frontend development using clean HTML, CSS, and JavaScript,
- real API integration with an authenticated backend,
- responsive product-style UI design,
- cloud-connected application behavior through an AWS-hosted backend,
- multi-page application flow with login, signup, chat, history, and profile views.

Instead of being only a landing page or visual mockup, it represents a working product interface.

## Suggested Future Enhancements

# Language Analyzer Frontend

This is the frontend for my Marathi language correction project. I built it as a simple chat-style interface where users can sign up, log in, submit Marathi text, and view corrected output from the backend API.

## Project Highlights

- Built as a lightweight frontend using `HTML`, `CSS`, `JavaScript`, and `Tailwind CSS`.
- Provides a chat-inspired interface for Marathi sentence correction.
- Includes dedicated login and signup pages for user onboarding.
- Connects to a live backend API hosted on an AWS instance.
- Stores JWT tokens in browser `localStorage` for authenticated sessions.
- Includes profile and history views for a more complete product experience.
- Implements responsive layout behavior for desktop, tablet, and mobile screens.
- Uses a sidebar-based interaction pattern with chat, history, profile, and logout actions.

## What This Frontend Does

The frontend acts as the user-facing layer of the Language Analyzer platform.

Core responsibilities:

1. Allow users to create an account or log in.
2. Send Marathi text to the backend correction API.
3. Display corrected output in a conversational UI.
4. Fetch and show profile details for authenticated users.
5. Surface previous chat history through a sidebar-driven interaction flow.

## Tech Stack

### Frontend
- `HTML5`
- `CSS3`
- `JavaScript`

### UI and Styling
- `Tailwind CSS` via CDN
- custom responsive CSS in `style.css`
- page-level styling embedded inside the HTML files

### Backend Integration
- REST API communication using browser `fetch`
- JWT-based session handling through `localStorage`
- hosted backend connection via a public AWS instance IP

## Project Structure

```text
language_analyzer_frontend/
|-- index.html          # Main chat application UI
|-- login.html          # Login page
|-- signup.html         # Signup page
|-- app.js              # Main application logic and API calls
|-- auth.js             # Authentication page logic
|-- style.css           # Shared responsive styling
|-- favicon.ico         # Application icon
|-- counter.js          # Extra file currently unused in the main flow
|-- tailwind.config.js  # Present but currently empty
`-- README.md
```

## Page Overview

### `index.html`
This is the main application interface. It includes:

- a sidebar for navigation,
- a welcome screen,
- a chat area for user input and corrected responses,
- profile and history sections,
- responsive mobile sidebar handling,
- a polished dark-themed UI for the main user workflow.

### `login.html`
Provides the login experience for returning users:

- email and password input,
- error handling UI,
- redirect to the main application after successful authentication.

### `signup.html`
Provides the registration experience for new users:

- name, email, and password onboarding flow,
- OTP-related UI steps for email verification,
- redirect path into the main application after signup.

## JavaScript Logic Breakdown

### `app.js`
This file drives the main app behavior:

- checks authentication on page load,
- redirects unauthenticated users to `login.html`,
- sends user text to the backend `/analyze` endpoint,
- renders chat bubbles for both user input and AI-corrected responses,
- loads profile data from `/auth/profile`,
- manages chat resets and sidebar interactions,
- supports a history dropdown experience,
- handles logout by clearing the stored JWT token.

### `auth.js`
This file manages authentication-related frontend behavior:

- submits login requests to `/auth/login`,
- submits signup requests to `/auth/signup`,
- stores the JWT token after successful authentication,
- redirects authenticated users to `index.html`,
- displays loading states and inline error messages,
- includes OTP request and OTP verification calls for signup flow enhancement.

## Backend Integration

The frontend is currently configured to communicate with:

```text
http://72.60.202.62
```

The frontend uses the following backend routes:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/profile`
- `POST /analyze`
- `GET /history`
- `POST /auth/send-otp`
- `POST /auth/verify-otp`

## User Flow

### Authentication Flow

1. A new user opens `signup.html` to create an account.
2. An existing user opens `login.html` to authenticate.
3. On successful login or signup, a JWT token is saved in `localStorage`.
4. The user is redirected to `index.html`.
5. Protected frontend actions use the stored token in API requests.

### Text Correction Flow

1. The user types an incorrect Marathi sentence into the input box.
2. The frontend sends the request to the backend `/analyze` API.
3. The backend returns corrected text.
4. The corrected output is displayed as an AI-style chat response.

### Profile and History Flow

1. The user opens the sidebar.
2. The user can switch to profile or history views.
3. The frontend requests profile or previous conversation data from the backend.
4. Results are rendered inside the interface without leaving the app.

## UI and UX Features

Notable interface choices:

- dark theme for a modern app-like experience,
- animated chat bubbles and welcome-state transitions,
- copy-to-clipboard action for corrected responses,
- collapsible sidebar for navigation,
- mobile overlay and slide-in sidebar behavior,
- responsive typography and spacing adjustments across screen sizes.

## Responsive Design

The application includes responsive behavior for different screen sizes:

- mobile-friendly login and signup containers,
- mobile sidebar open/close interactions,
- adaptive chat bubble widths,
- resized header and input areas for smaller devices,
- tablet and desktop layout adjustments for improved readability.

## Deployment

- frontend integrated with a cloud-hosted backend,
- practical knowledge of calling a public API from a deployed interface,
- understanding of how frontend and backend pieces connect outside local development,
- experience working with production-style base URLs rather than only localhost testing.

## Local Development Setup

Because this project is a static frontend, setup is simple.

### 1. Open the project folder

```bash
cd language_analyzer_frontend
```

### 2. Serve it locally

You can use a simple static server. For example:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

This matches the backend CORS configuration that already allows `http://localhost:5500`.

## Important Implementation Notes

A few integration details are worth knowing when presenting or extending this project:

- the frontend stores authentication tokens in `localStorage`,
- the API base URL is currently hardcoded in JavaScript,
- `tailwind.config.js` is present but currently empty because Tailwind is loaded through CDN,
- the signup page includes OTP-related frontend logic, which expects matching backend endpoints,
- the chat request currently sends a fixed `user_id` value in the request body.

