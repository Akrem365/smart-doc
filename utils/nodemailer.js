import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dakrem11@gmail.com",
    pass: "lymx mtol aato qwqr",
  },
});

export default transporter;
