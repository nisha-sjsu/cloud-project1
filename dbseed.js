import mysql from 'mysql';
import dotenv from "dotenv";

dotenv.config()

const con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});

con.connect(function (err) {
    // if (err) throw err;

    // con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');

    /* SHOW databases */
    // con.query('show databases;',
    //     function (error, result, fields) {
    //         console.log(result);
    //     });

    /* CREATE TABLE */
    // con.query('create table if not exists users(id int NOT NULL AUTO_INCREMENT, firstname varchar(30), lastname varchar(30), email varchar(100), filename varchar(50), creation_date date, modified_date date, description varchar(200), PRIMARY KEY(id));',
    //     function (error, result, fields) {
    //         console.log(result);
    //     });

    /* CREATE auth TABLE */
    // con.query('create table if not exists auth(id int NOT NULL AUTO_INCREMENT,  email varchar(100), filename varchar(50), password varchar(200), PRIMARY KEY(id));',
    //     function (error, result, fields) {
    //         console.log(result);
    //     })

    /* DESC TABLE */
    // con.query('desc users;',(error, result, fields)=>{
    //     console.log(result);
    // });

    /* DROP TABLE */
    // con.query('drop table users;',(error, result, fields)=>{
    //     console.log(result);
    // });

    /* SELECT users */
    con.query('select * from auth;', (error, result, fields) => {
        result.forEach(res => {
            console.log(res);
        });
    });

    /*Select files of specific user*/
    // let email = 'srinishaa@gmail.com'
    // con.query(`select * from users where email='${email}'`, (error, result, fields) => {
    //     result.forEach(res => {
    //         console.log(res.filename);
    //     });
    // });

    /* TRUNCATE TABLE */
    // con.query('truncate table auth;', (error, result, fields) => {
    //     console.log(result);
    // });
    // con.end();
})