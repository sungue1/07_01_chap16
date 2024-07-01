const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const mysql = require('mysql2');

if (dotenv.error) {
    throw new Error("Failed to load .env file");
}

let mongodb;
let mysqldb;

const setup = async () => {
    if (mongodb && mysqldb) {
        return { mongodb, mysqldb };
    }

    try {
        const mongoDbUrl = process.env.MONGODB_URL;
        const mongoDbName = process.env.MONGODB_DB;
        const mysqlHost = process.env.MYSQL_HOST;
        const mysqlUser = process.env.MYSQL_USER;
        const mysqlPassword = process.env.MYSQL_PASSWORD;
        const mysqlDatabase = process.env.MYSQL_DB;


        // MongoDB 연결 시도
        const mongoConn = await MongoClient.connect(mongoDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        mongodb = mongoConn.db(mongoDbName);
        console.log("몽고DB 접속 성공");

        // MySQL 연결 시도
        mysqldb = mysql.createConnection({
            host: mysqlHost,
            user: mysqlUser,
            password: mysqlPassword,
            database: mysqlDatabase
        });
        mysqldb.connect((err) => {
            if (err) {
                console.error("MySQL 접속 실패", err);
                throw err;
            }
            console.log("MySQL 접속 성공");
        });

        return { mongodb, mysqldb };
    } catch (err) {
        console.error("DB 접속 실패", err);
        throw err;
    }
};

module.exports = setup;
