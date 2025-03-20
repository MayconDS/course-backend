const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      default: "student",
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    recoveryPassword: {
      type: {
        code: String,
        date: Date,
      },
      default: {},
    },
    changeEmail: {
      type: {
        code: String,
        date: Date,
      },
      default: {},
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// Também pode configurar para toObject
UserSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        this.password = hashedPassword;
        next();
      }
    });
  }
});
UserSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const passwordModified = update.$set && update.$set.password;

  if (passwordModified) {
    bcrypt.hash(update.$set.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      update.$set.password = hashedPassword;
      next();
    });
  } else {
    return next();
  }
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};
module.exports = mongoose.model("User", UserSchema);
