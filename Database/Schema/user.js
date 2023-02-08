import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.String,
    unique: true,
    required: true,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
