const nodemailer = require("nodemailer");
const messageModel = require("../../models/messages");
const { general } = require("../../../utils");
const { responseJSON } = general;

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

  async sendEMailUser(req, res) {
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
  async sendEmailMerchant(req, res) {
    const {
      to,
      subject,
      text = "Kami menemukan pelanggaran kebijakan pada akun Anda, sehingga kami telah melakukan pemblokiran sementara. Mohon menghubungi kami di nomor layanan pelanggan atau dapat melakukan penjelasan melalui kontak di website untuk membantu mengatasi masalah ini.",
    } = req.body;
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

  async updateStatusMessages(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await messageModel
        .findOne({
          where: {
            id,
          },
        })
        .then((result) => {
          if (result) {
            result.update({
              status,
            });
          }
        });
    } catch (error) {
      responseJSON({
        res: res,
        data: error.errors?.map((item) => item.message) || error,
        status: 500,
      });
    }
  }
}
module.exports = new controllerMail();
