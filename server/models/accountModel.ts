import mongoose from "mongoose";

interface accountSchemaProps {
  userId: String;
  type: String;
  provider: String;
  providerAccountId: String;
  refresh_token: String;
  access_token: String;
  expires_at: Number;
  token_type: String;
  scope: String;
  id_token: String;
  session_state: String;
}
const accountSchema = new mongoose.Schema<accountSchemaProps>({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerAccountId: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: false,
  },
  access_token: {
    type: String,
    required: false,
  },
  expires_at: {
    type: Number,
    required: false,
  },
  token_type: {
    type: String,
    required: false,
  },
  scope: {
    type: String,
    required: false,
  },
  id_token: {
    type: String,
    required: false,
  },
  session_state: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Account", accountSchema);
