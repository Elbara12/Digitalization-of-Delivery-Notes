const jsonwebtoken = require("jsonwebtoken");

function generateHS256JWT(storedContact, secret) {
  try {
    const payload={
        id: storedContact.id,
        email: storedContact.email,
        role: storedContact.role,
        emailstatus: storedContact.emailstatus,
        status: storedContact.status,
        iat: Math.floor(Date.now() / 1000) - 30, // Issued at time
    }
    return jsonwebtoken.sign(payload, secret, { algorithm: "HS256" });
  } catch (err) {
    console.error("Error generating JWT:", err);
    throw err;
  }
}

function generateHS256JWTexp(storedContact, secret) {
  try {
    const payload={
        id: storedContact.id,
        email: storedContact.email,
        role: storedContact.role,
        emailstatus: storedContact.emailstatus,
        status: storedContact.status,
        iat: Math.floor(Date.now() / 1000) - 30, // Issued at time
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expires in 24 hour
    }
    return jsonwebtoken.sign(payload, secret, { algorithm: "HS256" });
  } catch (err) {
    console.error("Error generating JWT:", err);
    throw err;
  }
}

module.exports = {
    generateHS256JWT,
    generateHS256JWTexp,
};