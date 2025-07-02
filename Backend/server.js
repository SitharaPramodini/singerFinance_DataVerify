const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const loginRoute = require("./routes/Login.js"); 

const cors = require('cors');

const app = express();
// Configure CORS
app.use(cors({
  origin: 'http://localhost:5175', 
  credentials: true, // Important: This allows cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = 3000; // or your preferred port

app.use(bodyParser.json());
app.use(cookieParser());

// Use login router
app.use("/api", loginRoute); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
