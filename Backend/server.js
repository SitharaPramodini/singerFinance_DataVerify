const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const loginRoute = require("./routes/Login.js"); 
const approveRoute = require("./routes/Approve.js"); 

const app = express();

app.use(cors({
  origin: 'http://localhost:5175', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON & URL-encoded bodies with larger limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());

// Routes
app.use("/api", loginRoute); 
app.use("/api/approve", approveRoute); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
