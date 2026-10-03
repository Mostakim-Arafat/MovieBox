# MovieBox

A modern streaming and movie discovery platform built with Next.js, tailored for browsing movies, TV shows, subscription plans, and admin content management.

## Overview

MovieBox is a full-stack OTT-style web application that combines a cinematic landing experience with a content catalog, user authentication, AI-powered discovery, admin tools, and payment flows. It is designed as a showcase for a production-ready streaming app with a strong front-end UI and a robust backend architecture.

## Features

- Movie and TV browsing experience with curated landing pages
- AI-powered movie search using Gemini for natural-language recommendations
- User authentication with email/password and Google OAuth
- MongoDB-backed user and catalog data management
- Admin dashboard for analytics, users, trending content, and quick actions
- Movie upload and media processing via Mux
- Subscription/payment flow using SSLCommerz
- Responsive layout built with Next.js and Tailwind CSS
- Clean component-based UI with reusable sections and modern design tokens

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Better Auth
- Google Gemini AI
- Mux Video
- SSLCommerz payment integration
- ESLint

## Project Structure

```bash
moviebox/
├── public/
│   └── tvshows.json
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── movies/
│   │   ├── tvshows/
│   │   ├── login/
│   │   ├── register/
│   │   ├── payment/
│   │   └── page.tsx
│   ├── Components/
│   │   ├── AI/
│   │   ├── Admin/
│   │   └── Homepage/
│   ├── lib/
│   │   ├── AI/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── mongo.ts
│   │   └── utils.ts
│   └── UI/
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── README.md
└── .env.example (create this locally)
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root of the project and add the following values:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# MongoDB
MONGO_URL=mongodb://127.0.0.1:27017/Moviebox

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI / Gemini
GEMINI_API_KEY=your_gemini_api_key

# Mux
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# Payments
SSL_COMMERZ_STORE_ID=your_ssl_store_id
SSL_COMMERZ_STORE_PASSWORD=your_ssl_store_password
```

> If you are using a different deployment host, update `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_APP_URL` accordingly.

### 3. Run the app

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev     # Start the development server
npm run build   # Build the project for production
npm run start   # Start the production server
npm run lint    # Run ESLint checks
```

## Key App Areas

### Public storefront
The home page includes a cinematic hero section, trending content, FAQ, pricing plans, and AI-assisted discovery.

### Search and recommendations
The AI-powered search interface allows users to search by mood, theme, genre, or descriptive prompts and returns matching movies.

### Authentication
Sessions and user accounts are managed through Better Auth with Google social login and email/password sign-in support.

### Admin panel
The admin UI includes quick actions, user stats, trending data, and monitoring views for managing public content and subscriptions.

### Payment flow
The app includes a subscription and checkout flow integrated with SSLCommerz for transaction processing.

### Media processing
The Mux integration enables external video ingestion and playback asset creation for uploaded or hosted content.

## Notes

- This project is designed for local development and deployment with environment-defined secrets.
- MongoDB is required for auth and data persistence.
- AI features depend on a valid Gemini API key.
- Payment integration requires valid SSLCommerz sandbox or production credentials.

## License

This project currently does not include a license file. If you plan to distribute or deploy it publicly, add an appropriate license before release.

## Contributing

Contributions are welcome. If you want to improve the project, feel free to fork the repository, create a new branch, and submit a pull request with your changes.

## Contact

For questions or support, reach out to the project maintainer or review the app routes and components in the source tree for implementation details.
