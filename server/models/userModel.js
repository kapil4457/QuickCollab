const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  isGoogleLogin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  previousPasswords: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: String,
    required: false,
    default: new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    required: false,
    default: new Date().toISOString(),
  },
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  ],
  seenMessageIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  // accounts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Account",
  //   },
  // ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTTokens = function () {
  return jwt.sign({ id: this._id }, "nadfvcnsdcsvsdjvjsd", {
    expiresIn: "30d",
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.previousPasswordCheck = async function (updatedPassword) {
  for (pre of this.previousPasswords) {
    const temp = await bcrypt.compare(updatedPassword, pre);
    if (temp == true) return true;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
