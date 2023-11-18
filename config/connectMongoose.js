const mongoose = require("mongoose");

const mongooseDBConnect = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.URI_MONGOOSE);
    if (connectDB.connection.readyState === 1) {
      console.log("connect mongoose success fully");
    } else {
      console.log("fail connect mongoose");
    }
  } catch (error) {
    console.log("DB connect fail : ", error);
    throw error;
  }
};

module.exports = mongooseDBConnect;
