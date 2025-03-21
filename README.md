# BVC Website

This is a React-based website for managing legal cases and finances for Beatriz Costa.

## Features

- Dashboard to display weekly deadlines and commitments.
- Case view with table and filters for efficient case management.
- Case creation/edit form for adding or updating case details.
- Financial page for generating detailed reports.

## Color Palette

- Dark Blue: `#242d4c`
- Navy Blue: `#050a30`
- Beige: `#c4c0b3`
- Light Beige: `#efece3`

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and fill it with the following content:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_secure_password
   DB_NAME=bvc.db
   DB_PATH=c:/Ful/Path/To/Database
   ```
   Replace `your_secure_password` with a secure password of your choice.
4. Run `npm start` to start the development server.

## Directory Structure

```
bvc_website/
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── .vscode/
│   └── launch.json          # VSCode launch configurations
├── public/
│   └── index.html           # HTML entry point
├── src/
│   ├── client/
│   │   ├── components/      # React components
│   │   ├── pages/           # React pages
│   │   │   ├── App.js       # Main app component
│   │   │   ├── CaseForm.js  # Case form page
│   │   │   ├── Cases.js     # Cases page
│   │   │   ├── Dashboard.js # Dashboard page
│   │   │   └── Finance.js   # Finance page
│   │   ├── styles/          # CSS styles
│   │   │   ├── global.css   # Global styles
│   │   │   └── CaseForm.module.css # Case form-specific styles
│   │   └── index.js         # React entry point
│   ├── server/
│   │   ├── database/        # Database-related files
│   │   │   ├── database.sql # SQL schema
│   │   │   ├── connection.js       # Database connection
│   │   │   ├── initializeDB.js     # Database initialization
│   │   │   └── testDB.js           # Database connection test
│   │   ├── routes.js        # API routes
│   │   └── server.js        # Express server
│   └── utils/
│       └── validation.js    # Validation utilities
├── README.md                # Project documentation
├── package.json             # Project metadata and scripts
└── src/index.js             # Main entry point
```
