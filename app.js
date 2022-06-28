// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static(__dirname + "/static"));
app.use(express.static(__dirname + "/image"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/9c427f4c52";

  const options = {
    method: "POST",
    auth: "Petos290:32933ac5ed102b9f95766feb4788218a-us13",
  };

  const request = https.request(url, options, function (response) {
    const responseCode = response.statusCode;

    if (responseCode === 200) {
      response.on("data", function (data) {
        res.sendFile(__dirname + "/success.html");
      });
    } else {
      console.log(responseCode);
      res.sendFile(__dirname + "/failure.html");
    }
  });
  request.write(jsonData);
  request.end();
});

// console.log(firstName, lastName, email);

app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening on port 3000");
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
