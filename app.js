import express from "express";
import fetch from "node-fetch";
import awsCloudFront from "aws-cloudfront-sign";
import dotenv from "dotenv";
import FormData from 'form-data';
import cors from 'cors';
import fs from "fs";
import multer from "multer";
import mysql from 'mysql';

dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: "uploads/" });

var con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.DATABASE
});

con.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.get("/getFiles", async (req, res) => {
    var email = req.query.email;
    let urls = [];
    var options = { keypairId: process.env.CLOUDFRONT_ACCESS_KEY_ID, privateKeyPath: process.env.CLOUDFRONT_PRIVATE_KEY_PATH };

    if (email == process.env.ADMIN_EMAIL) {
        con.query(`select * from users`, (error, result, fields) => {
            result.forEach(res => {
                // let filename = res.filename.replace(/\s/g, '');
                new Promise(function (resolve, reject) {
                    var signedUrl = awsCloudFront.getSignedUrl(process.env.CLOUDFRONT_URL + "/" + res.filename, options);
                    resolve(urls.push({
                        "key": res.filename,
                        "url": signedUrl,
                        "creationDate": res.creation_date,
                        "modifiedDate": res.modified_date,
                        "description": res.description,
                        "email": res.email
                    }));
                })
            });
            res.send(urls);
        });
    } else {
        con.query(`select * from users where email='${email}'`, (error, result, fields) => {
            result.forEach(res => {
                new Promise(function (resolve, reject) {
                    var signedUrl = awsCloudFront.getSignedUrl(process.env.CLOUDFRONT_URL + "/" + res.filename, options);
                    resolve(urls.push({
                        "key": res.filename,
                        "url": signedUrl,
                        "creationDate": res.creation_date,
                        "modifiedDate": res.modified_date,
                        "description": res.description,
                        "email": res.email
                    }));
                })
            });
            res.send(urls);
        });
        // con.end();
    }
})

app.delete("/deleteFile", async (req, res) => {
    let filename = req.query.key;
    let email = req.query.email;
    const formData = new FormData();
    formData.append("key", filename);
    return fetch('https://j0noe3sfu4.execute-api.us-east-1.amazonaws.com/dev/item', {
        method: 'DELETE',
        body: JSON.stringify({ "key": filename })
    }).then(response => {
        if (response.status == 200) {
            con.connect(function (err) {
                con.query(`DELETE FROM main.users where email='${email}' and filename='${filename}'`,
                    function (err, result, fields) {
                        if (err) console.log(err);
                        if (result) console.log(result);
                        result ? res.send({ "Status": 200, "Message": "Succesfully deleted" }) :
                            res.send({ "Status": 400, "Message": "error!" })
                    });
            });
        }
    })
})

app.post("/postFile", upload.single('file'), async (req, res) => {

    const path = req.file.path;
    const buffer = fs.readFileSync(path);
    var filename = req.query.filename;
    var date = new Date().toISOString();

    let action = req.query.action;
    return fetch(`https://j0noe3sfu4.execute-api.us-east-1.amazonaws.com/dev/item?filename=${filename}`, { // Your POST endpoint
        method: 'POST',
        headers: {
            "Content-Type": "*/*"
        },
        body: buffer // This is your file object
    }).then(
        response => response.json()
    ).then(
        success => {
            console.log(req.body.fileData);
            var options = { keypairId: process.env.CLOUDFRONT_ACCESS_KEY_ID, privateKeyPath: process.env.CLOUDFRONT_PRIVATE_KEY_PATH };
            var signedUrl = awsCloudFront.getSignedUrl(process.env.CLOUDFRONT_URL + "/" + filename, options);
            success.cdnUrl = signedUrl
            res.send(success);
            if (action == "update") {
                con.connect(function (err) {
                    con.query(`UPDATE main.users SET modified_date = '${date}', description='${req.body.fileDesc}' where email='${req.body.email}' and filename='${req.body.key}'`),
                        function (err, result, fields) {
                            if (err) console.log(err);
                            if (result) console.log(result);
                        }
                });
            } else {
                var user = JSON.parse(req.body.user);
                con.connect(function (err) {
                    con.query(`INSERT INTO main.users (firstname, lastname, email, filename, creation_date, modified_date) VALUES ('${user.given_name}', '${user.family_name}', '${user.email}','${filename}', '${date}', '${date}')`,
                        function (err, result, fields) {
                            if (err) console.log(err);
                            if (fields) console.log(fields);
                            if (result) console.log({ firstname: user.given_name, lastname: user.family_name, email: user.email, filename: filename, creation_date: date });
                        });
                });
            }
        }
    ).catch(
        error => console.log(error)
    );
});

app.post("/register", async(req, res)=>{
    let user = req.body;
    con.connect(function (err) {
    con.query(`INSERT INTO main.auth (email, password) VALUES ('${user.email}', '${user.password}')`,
        function (err, result, fields) {
            if (err) console.log(err);
            if (fields) console.log(fields);
            if (result) console.log({ email: user.email });
        });
    })
    res.sendStatus(200);
})

app.post("/login", async(req, res)=>{
    let user = req.body;
    con.connect(function (err) {
    con.query(`select * from auth where email='${user.email}' and password='${user.password}'`,
        function (err, result, fields) {
            if (err) console.log(err);
            if (result) res.send(result);
        });
    })
})

app.listen(process.env.PORT || 4000, function () {
    console.log("Server started on port 4000");
});