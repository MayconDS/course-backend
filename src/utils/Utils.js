const User = require("../models/User");

class Utils {
  static generateVerificationCode(digit = 6) {
    let otp = "";
    for (let i = 0; i < digit; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  static maxVerificationCodeTime(minutes = 5) {
    return minutes * 60 * 1000;
  }
  static async allowAccessCourse(userId, courseId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log("Usuário não encontrado");
      }
      if (!user.purchasedCourses.includes(courseId)) {
        const userUpdated = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: { purchasedCourses: courseId },
          },
          { new: true } // Retorna o documento atualizado
        );
        return userUpdated;
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = Utils;
