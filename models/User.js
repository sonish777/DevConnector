const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: {
      validator: (val) => {
        return validator.isEmail(val);
      },
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    select: false,
  },
  avatar: {
    type: String,
    default: "default.jpg",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.select("-password");
//   next();
// });

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  // console.log(this);
  if (await bcrypt.compare(candidatePassword, this.password)) {
    return true;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
