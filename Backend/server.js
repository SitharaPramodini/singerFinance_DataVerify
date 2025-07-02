const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const loginRoute = require("./routes/Login.js"); 

const app = express();
const PORT = 3000; // or your preferred port

app.use(bodyParser.json());
app.use(cookieParser());

// Use login router
app.use("/api", loginRoute); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
