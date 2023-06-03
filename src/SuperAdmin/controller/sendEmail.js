const nodemailer = require("nodemailer");

class controllerMail {
  async sendEmail(req, res) {
    const { to, subject, text } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Chrisdiantodoni@gmail.com",
        pass: "khgqjogeicwsucvp",
      },
    });
    const mailOptions = {
      from: "Chrisdiantodoni@gmail.com",
      to,
      subject,
      text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.send("Email sent successfully");
      }
    });
  }
}
module.exports = new controllerMail();
