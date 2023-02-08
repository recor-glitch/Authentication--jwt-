import mongoose from "mongoose";

mongoose.set("strictQuery", true);

async function connectDb() {
  await mongoose
    .connect(process.env.MONGO_URL + "/tasks")
    .then(() => console.log("CONNECTED TO DB"))
    .catch((e) => console.log(e));
}

export default connectDb;
