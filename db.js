const Sequelize = require("sequelize");
const UserModel = require("./models/User");
const CourseModel = require("./models/Course");
const UserCourseModel = require("./models/UserCourse");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);
const User = UserModel(sequelize, Sequelize);
const Course = CourseModel(sequelize, Sequelize);
const UserCourse = UserCourseModel(sequelize, Sequelize);
const Models = { User, Course, UserCourse };
const connection = {};

module.exports = async () => {
    if (connection.isConnected) {
        console.log("=> Using existing connection.");
        return Models;
    }

    await sequelize.sync();
    await sequelize.authenticate();
    connection.isConnected = true;
    console.log("=> Created a new connection.");
    return Models;
};
