# Next.js User Authentication System

A modern, secure user authentication system built with Next.js and Clerk, featuring email verification, password reset, and profile management.

![Next.js User Authentication](https://img.shields.io/badge/Next.js-User%20Authentication-rose)

## Features

- **Secure Authentication**: Complete authentication flow with sign-up, sign-in, and sign-out
- **Email Verification**: Email verification using both code and link methods
- **Password Management**: Password reset and recovery functionality
- **Profile Management**: User profile editing and management
- **Multiple Email Addresses**: Support for adding and managing multiple email addresses
- **Primary Email Selection**: Ability to change primary email address
- **Protected Routes**: Server-side and client-side route protection
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **Clerk**: Authentication and user management
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and handling
- **Yup**: Schema validation

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Clerk account (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/user-auth-nextjs.git
   cd user-auth-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Clerk API keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/profile
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
user-auth-nextjs/
├── app/                    # Next.js app directory
│   ├── component/          # Reusable components
│   ├── profile/            # Profile pages
│   ├── sign-in/            # Sign-in pages
│   ├── sign-up/            # Sign-up pages
│   ├── page.js             # Home page
│   └── layout.js           # Root layout
├── middleware.ts           # Authentication middleware
├── public/                 # Static assets
├── .env.local              # Environment variables (create this)
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
└── tailwind.config.js      # Tailwind CSS configuration
```

## Authentication Flow

1. **Sign Up**: Users create an account with email and password
2. **Email Verification**: Users verify their email address
3. **Sign In**: Users sign in with verified credentials
4. **Profile Management**: Users can update their profile information
5. **Email Management**: Users can add additional email addresses and change their primary email
6. **Password Reset**: Users can reset their password if forgotten

## Deployment

This application can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)