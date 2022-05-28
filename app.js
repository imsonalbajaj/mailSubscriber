const express = require("express");
const app = express();
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const port = process.env.PORT || 3000;


app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function (req, res) {
    const listId = "X"; // your audience id

    const subscribingUser = {
        firstName: req.body.fn,
        lastName: req.body.ln,
        email: req.body.email
    };

    mailchimp.setConfig({
        apiKey: "X",
        server: "X",
    });

    const email = subscribingUser.email;
    const subscriberHash = md5(email.toLowerCase());

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });

            console.log(
                `Successfully added contact as an audience member. The contact's id is ${
                  response.id
                }.`
            );
            console.log(`This user's subscription status is ${response.status}.`);
        } catch (e) {
            if (e.status === 404) {
                console.error(`This email is not subscribed to this list`, e);
            }
        }
    }


    run();
    res.sendFile(__dirname + "/success.html")
})


app.listen(port, function () {
    console.log("server is running on port: ", port);
})