# **Mongo Demo API**

A simple **Node.js + Express + MongoDB + Mongoose** API for user authentication and post management.
Includes secure password hashing (bcrypt), JWT authentication, environment variables, and CRUD operations.

---

## **Features**

- User signup (with hashed passwords)
- User login (JWT authentication)
- User update & delete
- Create, read, update, delete posts
- MongoDB + Mongoose models
- Environment variables using `.env`
- Docker-ready MongoDB configuration

---

## **Installation**

### 1. Install dependencies

```
npm install
```

### 2. Install dev dependencies

```
npm install -D typescript @types/node @types/express
```

### 3. Build TypeScript

```
npm run build
```

---

## **Environment Variables**

Create a `.env` file in the project root and refer to the .env.example file for required variables:

## **Tech Used**

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **TypeScript**
- **bcryptjs**
- **jsonwebtoken**
- **multer**

---

## **Scripts**

```
npm start      // start server with nodemon
npm run build  // compile TypeScript to /build
```
