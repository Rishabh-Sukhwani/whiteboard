// src/app/layout.tsx
"use client";

import { SessionProvider } from 'next-auth/react';
import './globals.css'; // Import your global styles if you have any

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
