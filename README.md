# Doctor Appointment Platform

This is a doctor appointment booking platform built with Next.js and Prisma.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Installation

1.  Clone the repo
    ```sh
    https://github.com/Thrishu/Doctor-Appointment-Platform.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Setup your .env file
    ```sh
    cp .env.example .env
    ```
4.  Run prisma migrations
    ```sh
    npx prisma db push
    ```

## Usage

To run the app in the development mode:
```sh
npm run dev
```

To build the app for production:
```sh
npm run build
```

To run the app in production mode:
```sh
npm run start
```

## Dependencies

- @clerk/nextjs
- @clerk/themes
- @hookform/resolvers
- @prisma/client
- @radix-ui/react-alert-dialog
- @radix-ui/react-dialog
- @radix-ui/react-label
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @vonage/auth
- @vonage/client-sdk-video
- @vonage/server-sdk
- @vonage/video
- class-variance-authority
- clsx
- date-fns
- lucide-react
- next
- next-themes
- opentok
- react
- react-dom
- react-hook-form
- react-spinners
- sonner
- tailwind-merge
- zod

## Dev Dependencies

- @eslint/eslintrc
- @tailwindcss/postcss
- autoprefixer
- eslint
- eslint-config-next
- postcss
- prisma
- tailwindcss
- tw-animate-css
