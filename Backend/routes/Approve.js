const express = require("express");
const axios = require("axios");
const https = require("https");
const router = express.Router();

const pool = require("../dbPool"); // Your MySQL pool with promise support

router.post("/approveCustomer", async (req, res) => {
  const {
    customer_temp_id,
    temp_customer_name,
    temp_customer_nic,
    temp_customer_address,
    temp_customer_face_encoding,
  } = req.body;

  // Validate required fields
  if (
    !customer_temp_id ||
    !temp_customer_name ||
    !temp_customer_nic ||
    !temp_customer_address ||
    !temp_customer_face_encoding
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Prepare user data for API
  const nameParts = temp_customer_name.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";
  const loginName = `${firstName}${lastName}`.replace(/\s+/g, "");
  const email = `${firstName.toLowerCase()}@email.com`;
  const password = `${firstName}123`;
  const employeeCode = temp_customer_nic;

  // Create https agent to accept self-signed certs (for dev only!)
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  try {
    const clientId = "ncheck";
    const clientSecret = ""; 

    const tokenResponse = await axios.post(
      "https://192.168.8.120:8443/oauth/token",
      new URLSearchParams({
        grant_type: "password",
        username: "6KXZ3VZWEL72J93JBD5G", 
        password: "73BDEM126EQQ1M08K0YD",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        },
        httpsAgent,
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) throw new Error("No access token received");

    // 2. Post user data to biometric system
    await axios.post(
      "https://192.168.8.120:8443/api/ncheck/user",
      {
        employeeCode,
        firstName,
        lastName,
        loginName,
        password,
        email,
        status: 0,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        httpsAgent,
      }
    );

    // 3. Post biometric data
    await axios.post(
      `https://192.168.8.120:8443/api/ncheck/biometric?code=${employeeCode}`,
      [
        {
          modality: "face",
          image: temp_customer_face_encoding,
        },
      ],
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        httpsAgent,
      }
    );

    // 4. Insert customer record in DB
    const insertQuery = `
      INSERT INTO customer (customer_name, customer_nic, customer_address, submit_datetime)
      VALUES (?, ?, ?, NOW())
    `;
    await pool.query(insertQuery, [
      temp_customer_name,
      temp_customer_nic,
      temp_customer_address,
    ]);

    // 5. Delete temp customer record
    const deleteQuery = `DELETE FROM customer_temp WHERE customer_temp_id = ?`;
    await pool.query(deleteQuery, [customer_temp_id]);

    res.json({
      message:
        "Customer approved, biometric saved, and temporary record deleted successfully.",
    });
  } catch (error) {
    console.error("Approval process error:", error);

    res.status(500).json({
      message: "Approval process failed",
      error:
        error.response?.data ||
        error.message ||
        "Unknown error during approval process",
    });
  }
});

module.exports = router;
