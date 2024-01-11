import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface userSchemaProps {
  name: String;
  email: String;
  emailVerified: Date;
  profileImage: String;
  password: String;
  createdAt: String;
  updatedAt: String;
  conversations: Array<mongoose.Schema.Types.ObjectId>;
  seenMessageIds: Array<mongoose.Schema.Types.ObjectId>;
  accounts: Array<mongoose.Schema.Types.ObjectId>;
  messages: Array<mongoose.Schema.Types.ObjectId>;
}
const userSchema = new mongoose.Schema<userSchemaProps>({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    required: true,
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
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
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

module.exports = mongoose.model("User", userSchema);
