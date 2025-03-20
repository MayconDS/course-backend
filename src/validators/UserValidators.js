const { body, header } = require("express-validator");
const jwt = require("jsonwebtoken");
const getEnvironmentVariables = require("../environments/environment");

class UserValidators {
  static signup() {
    return [
      body("name", "name is required").isString(),
      body("email", "email is required").isEmail(),
      body("password", "password is required").isString(),
    ];
  }
  static login() {
    return [
      body("email", "email is required").isEmail(),
      body("password", "password is required").isString(),
    ];
  }
  static update() {
    return [body("name", "name is required").isString()];
  }
  static forgotPassword() {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email,
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error('No User Registered with such Email');
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }
  static verifyPassword() {
    return [
      header("Authorization", "Authorization is required").custom(
        (authorization, { req }) => {
          if (!authorization) {
            throw new Error("Authorization is missing!");
          }

          const token = authorization.split(" ")[1];

          try {
            const decoded = jwt.verify(
              token,
              getEnvironmentVariables().jwt_secret_key
            );
            const nowInSeconds = Math.floor(Date.now() / 1000);

            if (decoded.exp > nowInSeconds) {
              req.payload = {
                ...req.payload,
                token: decoded,
              };
              return true;
            }
          } catch (e) {
            throw new Error("Token invalid or expired!");
          }
        }
      ),
    ];
  }
  static resetPassword() {
    return [
      header("Authorization", "Authorization is required").custom(
        (authorization, { req }) => {
          if (!authorization) {
            throw new Error("Authorization is missing!");
          }

          const token = authorization.split(" ")[1];

          try {
            const decoded = jwt.verify(
              token,
              getEnvironmentVariables().jwt_secret_key
            );
            const nowInSeconds = Math.floor(Date.now() / 1000);

            if (decoded.exp > nowInSeconds) {
              req.payload = {
                ...req.payload,
                token: decoded,
              };
              return true;
            }
          } catch (e) {
            throw new Error("Token invalid or expired!");
          }
        }
      ),
    ];
  }
  static updatePassword() {
    return [
      header("Authorization", "Authorization is required").custom(
        (authorization, { req }) => {
          if (!authorization) {
            throw new Error("Authorization is missing!");
          }

          const token = authorization.split(" ")[1];

          try {
            const decoded = jwt.verify(
              token,
              getEnvironmentVariables().jwt_secret_key
            );
            const nowInSeconds = Math.floor(Date.now() / 1000);

            if (decoded.exp > nowInSeconds) {
              req.payload = {
                ...req.payload,
                token: decoded,
              };
              return true;
            }
          } catch (e) {
            throw new Error("Token invalid or expired!");
          }
        }
      ),
    ];
  }
}

module.exports = UserValidators;
