# Whiteboard App

## Introduction

The Whiteboard App is a web-based application built with Next.js that allows users to draw on a whiteboard, save their drawings, and collaborate in real-time. The app integrates user authentication using NextAuth.js with Google OAuth and stores drawing data in a Prisma-managed database.

## Features

-    Save and load drawings
-    User authentication with Google OAuth
-    Responsive design

## Tech Stack

- Next.js
- React
- Prisma
- NextAuth.js
- TypeScript

## Setup and Installation

Prerequisites

- Node.js (version 14 or later)
- PostgreSQL (or any other supported Prisma database)

## Steps

    Clone the Repository

```sh
git clone https://github.com/your-username/whiteboard-app.git
cd whiteboard-app
```

Install Dependencies

```sh
npm install
```

Set Up Environment Variables
Create a .env file in the root directory and add the following environment variables:

.env

```
DATABASE_URL=DATABASE_URL="file:./dev.db"
```

.env.local

```
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
NEXTAUTH_SECRET=random_string
```

Prisma Setup

Generate Prisma Client:

```sh
npx prisma generate
```

Run Prisma Migrations:

```sh
npx prisma migrate dev --name init
```

Run the Development Server

```sh
    npm run dev
```
    
Open http://localhost:3000 with your browser to see the app.

## Usage

Drawing on the Whiteboard

- Sign in using your Google account.
- Use the drawing tools to draw on the whiteboard.
- Click the "Save" button to save your drawing.

Checking Saved Drawings

After saving, a confirmation message will be displayed.
You can verify saved drawings by querying the database:

```sh
npx prisma studio
```

Use Prisma Studio to view and manage your drawings.

Error Handling

If an error occurs while saving the drawing, an error message will be displayed.
Check the console logs for detailed error information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.