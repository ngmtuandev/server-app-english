const User = require("../model/user.js");
const asyncHandler = require("express-async-handler"); // không cần try-cath gì tự bắt lỗi
const bcrypt = require("bcrypt");
const createAccessToken = require("../middeware/jwt.js");
const refreshToken = require("../middeware/refreshToken.js");
const jwt = require("jsonwebtoken");
const renderToken = require("uniqid");
const sendEmailNodemailer = require("../untils/sendMailNodemailer.js");
// const storage = require('node-persist');
// var LocalStorage = require('node-localstorage').LocalStorage
var store = require("store");

const userController = {
  register: asyncHandler(async (req, res) => {
    // const validateEmail = (email) => {
    //       return email?.match(
    //         /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //       );
    //     };
    // console.log('is email : ', validateEmail(req.email))
    const { email, password, firstName, lastName } = req.body;
    console.log("req >>>>>", req.body);
    if (!email || !password || !firstName || !lastName) {
      console.log("Trường này không được bỏ trống");
      return res.status(400).json({
        success: false,
        status: -1,
        mess: "Trường này không được bỏ trống",
      });
    } else {
      const checkUser = await User.findOne({ email: email });
      if (checkUser?.length > 0) {
        console.log("Tài khoản này đã tồn tại");
        return res.status(400).json({
          success: false,
          status: 1,
          mess: "Tài khoản này đã tồn tại",
        });
      } else {
        const token = renderToken();
        // console.log('-------------------------------')
        // console.log('check cookie >>>', req.cookies.userData)
        // console.log('{...req.body, token}', {...req.body, token})
        // console.log('check cookie after >>>', req.cookies.userData)
        // res.cookie('userData', '{a: 123}', { maxAge: 900000});

        // storage.setItemSync('userData', JSON.stringify({...req.body, token}));

        store.set("user", { ...req.body, token });

        // console.log('check cookie after set in register >>>', req.cookies.userData)
        const html = `Vui lòng nhấn vào link này để hoàn thành đăng kí tài khoản (Lưu ý tin thời gian cho tin nhắn này là 5 phút)
                <a href=${process.env.URL_SERVER}/api/user/completed/${token}>Hoàn thành đăng ký</a>`;
        await sendEmailNodemailer(req.body.email, html, "Hoàn tất đăng ký");
        return res.json({
          status: 0,
          mess: "Vui lòng check email",
        });
      }
    }
  }),
  completedRegister: asyncHandler(async (req, res) => {
    // const cookieData = req.cookies
    // const cookieData = storage.getItemSync('userData');
    const cookieData = store.get("user");
    console.log("cookie data >>>", cookieData);
    const { token } = req.params;
    // console.log('token params >>>', token)
    if (!token || !cookieData) {
      res.clearCookie("userData");
      return res.status(401).json({
        status: -1,
        mess: "Tạo tài khoản không thành công",
      });
    } else {
      const password = cookieData?.password;
      const firstName = cookieData?.firstName;
      const lastName = cookieData?.lastName;
      const email = cookieData?.email;
      const phone = cookieData?.phone;
      // console.log('check data cookie >>>>', password)
      let salt = await bcrypt.genSaltSync(5);
      const hasdPassword = await bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        password: hasdPassword,
        firstName,
        lastName,
        email,
        phone,
      });
      if (newUser) {
        res.clearCookie("userData");
        console.log("check register successs");
        return res.json({
          status: "tạo tài khoản thành công",
        });
      }
      // return res.status(200).json({
      //   success: newUser ? true : false,
      //   status: 0,
      //   mess: newUser
      //     ? "Tạo tài khoản thành công"
      //     : "Tạo tài khoản thất bại",
      //   data: newUser,
      // });
    }
  }),
  login: asyncHandler(async (req, res) => {
    const { email, password, confirmpassword } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status: -1,
        mess: "Trường này không được bỏ trống",
      });
    } else {
      const checkUserExist = await User.findOne({ email: email });
      // console.log(checkUserExist);
      if (!checkUserExist) {
        return res.status(400).json({
          success: false,
          status: 1,
          mess: "Người dùng này không tồn tại",
        });
      } else {
        if (String(password) !== String(confirmpassword)) {
          return res.status(400).json({
            success: false,
            status: -1,
            mess: "Mật khẩu xác nhận không đúng",
          });
        } else {
          // console.log("checkUserExist.password", checkUserExist.password);
          const comparePassword = await bcrypt.compareSync(
            password,
            checkUserExist.password
          );
          // console.log(comparePassword);
          if (!comparePassword) {
            return res.status(400).json({
              success: false,
              status: 1,
              mess: "Mật khẩu bạn nhập sai !!!",
            });
          } else {
            const { password, role, ...userLogin } = checkUserExist.toObject();
            const accessToken = await createAccessToken(userLogin._id, role);
            let refreshTokenAccount = await refreshToken(userLogin._id);
            res.cookie("refreshToken", refreshTokenAccount, {
              httpOnly: "true",
              maxAge: 259200000,
            });
            // update refresh token in database
            await User.findByIdAndUpdate(
              userLogin._id,
              {
                refreshToken: refreshTokenAccount,
              },
              { new: "true" }
            );
            return res.status(200).json({
              success: false,
              status: 0,
              mess: "Đăng nhập thành công",
              data: userLogin,
              accessToken: accessToken,
            });
          }
        }
      }
    }
  }),
  getUser: asyncHandler(async (req, res) => {
    const { id } = req.auth;
    const userCurrent = await User.findById({ _id: id }).select(
      "-password -role -refreshToken"
    );
    console.log(userCurrent);
    return res.status(200).json({
      status: 0,
      mess: "Xác nhận người dùng thành công",
      data: userCurrent,
    });
  }),
  refreshAccessTokenUser: async (req, res) => {
    const tokenInCookie = req.cookies;
    if (!tokenInCookie || !tokenInCookie.refreshToken) {
      throw new Error("Token không tồn tại");
    } else {
      jwt.verify(
        tokenInCookie.refreshToken,
        process.env.JWT_SECRET,
        async (err, decode) => {
          if (err) throw new Error("Xác nhận token lỗi");
          const userTokenCurrent = await User.findOne({
            _id: decode.id,
            refreshToken: tokenInCookie.refreshToken,
          });
          if (userTokenCurrent) {
            return res.status(200).json({
              status: 0,
              accessToken: userTokenCurrent
                ? createAccessToken(decode.id, tokenInCookie.refreshToken)
                : "Tạo token mới lỗi",
            });
          }
        }
      );
    }
  },
  getAllUsers: asyncHandler(async (req, res) => {
    const allUsers = await User.find().select("-password -role -refreshToken");
    if (allUsers) {
      return res.status(200).json({
        status: 0,
        mess: "lấy tất cả thông tin người dùng thành công",
        users: allUsers,
      });
    }
  }),
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id) {
      const findUserDelete = await User.findByIdAndDelete({ _id: id });
      if (findUserDelete) {
        return res.status(200).json({
          status: 0,
          mess: "Xóa người dùng thành công",
        });
      }
    }
  }),
  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.auth;
    if (id && req.body) {
      console.log(req.body);

      const findAndUpdated = await User.findByIdAndUpdate(
        id,
        { ...req.body, avatar: req.file ? req.file.path : "" },
        {
          new: "true",
        }
      );
      if (!findAndUpdated) {
        return res.status(401).json({
          status: 1,
          mess: "Cập nhập người dùng lỗi",
        });
      }
      return res.status(200).json({
        status: 0,
        mess: "Cập nhập người dùng thành công",
      });
    }
  }),
};

module.exports = userController;
