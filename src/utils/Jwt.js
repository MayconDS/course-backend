const jwt = require("jsonwebtoken");
const getEnvironmentVariables = require("../environments/environment");

class Jwt {
  static verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("User is not authorized."));
          else resolve(decoded);
        }
      );
    });
  }
  static generateToken(payload, expires_in = "30d") {
    return jwt.sign(
      {
        email: payload.email,
        id: payload.id,
        role: payload.role,
      },
      getEnvironmentVariables().jwt_secret_key,
      {
        expiresIn: expires_in,
      }
    );
  }
}

module.exports = Jwt;
