# Eventlify (React + Vite)

Eventlify is a modern event platform built with **React** and **Vite** that allows users to **create events**, **browse events**, and **enroll or buy tickets** using **Bank Transfer (Virtual Account)** or **Wallet** payments.  
The application uses **Axios** for API communication and **Tailwind CSS** for styling.

---

## Features

- Create and publish events
- Browse events and view event details
- Select tickets and enroll for events
- Bank Transfer payments (virtual account with expiry)
- Wallet payments (instant settlement)
- Payment confirmation and success flow
- Responsive UI with loading and error states

> This is the frontend application and requires a backend API for event management, payments, verification, and ticket issuance.

---

## Tech Stack

- React
- Vite
- Axios
- Tailwind CSS
- React Router

---

## Getting Started

### Clone the repository

```bash
git clone git@github.com:Boladek/smartdeals-event-app.git
cd events-app
```

### Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env.example` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Eventlify
VITE_ENV=development
```

Create your local `.env` file:

```bash
cp .env.example .env
```

> Only environment variables prefixed with `VITE_` are accessible in the app.

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linting (if configured)
```

---

## Project Structure

```text
src/
├─ components/
│  ├─ BaseButton/
│  ├─ Modal/
│  └─ Overlay/
├─ contexts/
│  ├─ AuthContext.jsx
│  └─ WebSocketContext.jsx
├─ helpers/
│  └─ functions.js
├─ hooks/
│  └─ EventsHooks.js
├─ pages/
│  ├─ Events/
│  │  ├─ EventsList.jsx
│  │  ├─ EventDetails.jsx
│  │  └─ CreateEvent.jsx
│  ├─ Payments/
│  │  ├─ EventPayment.jsx
│  │  ├─ PaymentCard.jsx
│  │  └─ BankTransferPaymentCard.jsx
│  └─ CreateEvent/
│     └─ SuccessPage.jsx
├─ services/
│  └─ httpService.js
├─ routes/
│  └─ AppRoutes.jsx
├─ index.css
└─ main.jsx
```

---

## Core Application Flow

### Event Creation
1. User enters event details
2. Event is created via backend API
3. User is redirected to the event page or confirmation screen

### Enrollment & Payment
1. User selects ticket and quantity
2. User chooses payment method:
   - Bank Transfer
   - Wallet
3. Payment is initiated
4. User completes payment
5. Payment is verified
6. Ticket enrollment is completed
7. Success page is displayed

---

## Transfer Payments (Virtual Account)

Transfer payments typically return:
- Bank name
- Account number
- Account name
- Assigned date
- Release date (expiry)
- Transaction reference

The UI displays:
- Transfer account details
- Amount, fees, and total
- Countdown to expiry
- Payment confirmation status

---

## Wallet Payments

Wallet payments are usually instant:
- Wallet payment is initiated
- Transaction is verified
- Ticket enrollment is completed
- User is redirected to success page

---

## Axios Configuration

Axios is used for all API communication.

Example setup (`src/services/httpService.js`):

```js
import axios from "axios";

const customAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

customAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default customAxios;
```

---

## Tailwind CSS

Ensure Tailwind CSS is correctly configured and included in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Deployment

### Build the app

```bash
npm run build
```

The production build will be generated in the `dist/` folder.

### Deploy

Deploy the `dist/` folder to any static hosting provider:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 / CloudFront

> Ensure your host serves `index.html` for all routes when using React Router.

---

## Troubleshooting

### App loads infinitely
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is correct
- Ensure Vite config uses `server.port`, not `server.host`

### Environment variables not working
- Restart dev server after updating `.env`
- Ensure variables start with `VITE_`

### Transfer expiry timer issues
- Confirm backend `releaseDate` format
- Ensure correct timezone handling
- Clamp negative countdown values to `0`

---

## Security Notes

Do not commit environment files.

Add this to `.gitignore`:

```gitignore
.env
.env.*
```

If `.env` was already committed:

```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
```

Rotate any exposed secrets immediately.

---

## License

Specify your license here (MIT, Apache-2.0, or Proprietary).
