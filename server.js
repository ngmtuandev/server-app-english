const express = require("express");
const mongooseDBConnect = require("./config/connectMongoose");
const cors = require("cors");
require("dotenv").config();
const initRoute = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 8888;
app.use(express.json()); // đọc hiểu data từ client gửi lên theo kiểu json
app.use(express.urlencoded({ extended: true })); // đọc đc data theo kiểu urlencode : aray, object
// const connectMongoose = async () => {
//   await mongoose
//     .connect(process.env.URI_MONGOOSE)
//     .then(() => {
//       console.log("connect success fully");
//     })
//     .catch((err) => console.log(err));
// };
// connectMongoose();

mongooseDBConnect();
initRoute(app);
// app.use("/", (req, res) => {
//   res.send("server on");
// });

app.listen(PORT, () => {
  console.log("server run port", PORT);
});
