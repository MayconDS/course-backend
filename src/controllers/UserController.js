const User = require("../models/User");
const Jwt = require("../utils/Jwt");
const NodeMailer = require("../utils/NodeMailer");
const Utils = require("../utils/Utils");

class UserController {
  static async signup(req, res, next) {
    const { email, password, name } = req.body;
    try {
      const user = await new User({
        email,
        password,
        name,
      }).save();

      res.status(200).json({
        user,
      });
    } catch (e) {
      next(e);
    }
  }
  static async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        return res.status(422).json({ error: "Email ou senha incorretos!" });
      }
      user.isCorrectPassword(password, function (err, same) {
        if (!same) {
          res.status(422).json({ error: "Email ou senha incorretos!" });
        } else {
          res.status(200).json({
            user,
            token: Jwt.generateToken({
              email: user.email,
              id: user._id,
              role: user.role,
            }),
          });
        }
      });
    } catch (e) {
      next(e);
    }
  }
  static async load(req, res, next) {
    const { id } = req.user;
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found!");
      }
      res.status(200).json({
        user,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    const { id } = req.user;
    const { name } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            name: name,
          },
        },
        { new: true }
      );
      if (!user) {
        throw new Error("User not found!");
      }
      res.status(200).json({ user });
    } catch (e) {
      next(e);
    }
  }
  static async updatePassword(req, res, next) {
    const { id } = req.user;
    const { currentPassword, confirmPassword, newPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.isCorrectPassword(currentPassword, async function (err, same) {
        if (!same) {
          res.status(422).json({ error: "password wrong" });
        } else {
          const userUpdated = await User.findOneAndUpdate(
            {
              _id: id,
            },
            {
              $set: {
                password: newPassword,
              },
            },
            { new: true }
          );
          res.status(200).json({ user: userUpdated });
        }
      });
    } catch (e) {
      next(e);
    }
  }
  static async sendChangeEmailCode(req, res, next) {
    const { email, password } = req.body;
    const change_email_code = Utils.generateVerificationCode();
    try {
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        return res.status(422).json({ error: "Email ou senha incorretos!" });
      }
      user.isCorrectPassword(password, async function (err, same) {
        if (same) {
          await User.findOneAndUpdate(
            {
              email: email,
            },
            {
              $set: {
                "changeEmail.code": change_email_code,
                "changeEmail.date":
                  Date.now() + Utils.maxVerificationCodeTime(10),
              },
            }
          );

          NodeMailer.sendEmail({
            to: email,
            subject: "CODIGO",
            html: `
              Your otp code is ${change_email_code}
            `,
          });
          return res.status(200).json({
            message: "Código enviado",
          });
        } else {
          res.status(422).json({ error: "Email ou senha incorretos!" });
        }
      });
    } catch (e) {
      next(e);
    }
  }
  static async updateEmail(req, res, next) {
    const { id } = req.user;
    const { newEmail, otp } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found!");
      }

      const date_now = new Date().getTime();
      const otp_date = user.changeEmail.date.getTime();
      if (date_now > otp_date) {
        res.status(422).json({
          error: "OTP expired!",
        });
      } else if (otp !== user.changeEmail.code) {
        res.status(422).json({
          error: "OTP invalid!",
        });
      } else {
        const userUpdated = await User.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: {
              email: newEmail,
              changeEmail: {},
            },
          }
        );
        return res.status(200).json({
          user: userUpdated,
        });
      }
    } catch (e) {
      next(e);
    }
  }
  static async forgotPassword(req, res, next) {
    const { email } = req.body;
    const reset_password_code = Utils.generateVerificationCode();
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          $set: {
            "recoveryPassword.code": reset_password_code,
            "recoveryPassword.date":
              Date.now() + Utils.maxVerificationCodeTime(10),
          },
        }
      );
      if (!user) {
        res.status(200).json({
          error: "Email ou senha incorretos!",
        });
      }
      res.status(200).json({
        success: true,
        security_token: Jwt.generateToken(
          {
            email: email,
            id: user._id,
          },
          "10m"
        ),
      });
      NodeMailer.sendEmail({
        to: email,
        subject: "CODIGO DE RECUPERAÇÃO DE SENHA",
        html: `
          Your otp code is ${reset_password_code}
        `,
      });
    } catch (e) {
      next(e);
    }
  }
  static async verifyPassword(req, res, next) {
    const { email } = req.user.token;

    const { otp } = req.body;

    try {
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        throw new Error("User not found!");
      }

      const date_now = new Date().getTime();
      const otp_date = user.recoveryPassword.date.getTime();
      if (date_now > otp_date) {
        res.status(422).json({
          message: "OTP expired!",
        });
      } else if (otp !== user.recoveryPassword.code) {
        res.status(422).json({
          message: "OTP invalid!",
        });
      } else {
        res.status(200).json({
          success: true,
        });
      }
    } catch (e) {
      next(e);
    }
  }
  static async resetPassword(req, res, next) {
    const { email } = req.user.token;
    const { newPassword } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          $set: {
            password: newPassword,
            recoveryPassword: {},
          },
        }
      );
      if (!user) {
        throw new Error("User not found!");
      }
      res.status(200).json({
        success: true,
      });
    } catch (e) {
      next(e);
    }
  }
  static async delete(req, res, next) {
    const { id } = req.user;

    try {
      const user = await User.findOneAndDelete(
        {
          _id: id,
        },
        {
          $set: {
            status: "deleted",
          },
        }
      );

      if (!user) {
        throw new Error("User not found!");
      }
      return res.status(200).json({
        deleted: "successful",
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;
