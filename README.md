# Quizlogy Services
## Description
Backend services for Quizlogy project.

## Installation
1. Clone the repository
2. Run `npm install`
3. create .env file and add the following variables
```env
# example .env file
PORT=3000
JWT_SECRET=anime

DATABASE_URL="mysql://root:@localhost:3306/quizlogy"
BASE_URL="http://localhost:3000"
CDN_URL="http://localhost:3000"
```
4. Run `npm run setup` to create the database and tables
5. Run `npm run dev` to start the server

## API Documentation
Using Hoppscotch to test the API
