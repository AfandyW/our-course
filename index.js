const connectToDatabase = require("./db");

const active = 1;
const nonActive = 0;

function HTTPError(statusCode, message, errorMessage) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.errorMessage = errorMessage;
    return error;
}

module.exports.healthCheck = async () => {
    try {
        await connectToDatabase();
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error, Fail connect to db",
            }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Connection successful." }),
    };
};

// users create
module.exports.register = async (event) => {
    try {
        const { User } = await connectToDatabase();
        const payload = JSON.parse(event.body);

        // check payload
        if (payload.username == null || payload.password == null)
            throw new HTTPError(
                400,
                "bad request",
                "required username and password"
            );

        // check user already exists or not
        const u = await User.findOne({ where: { username: payload.username } });
        if (u)
            throw new HTTPError(400, "bad request", "username already exists");

        // struct of user
        const user = {
            username: payload.username,
            password: payload.password,
            status: 1, // active
        };

        const res = await User.create(user);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Register Success", data: res }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};

// users get,
module.exports.login = async (event) => {
    try {
        const { User } = await connectToDatabase();
        const payload = JSON.parse(event.body);

        // check payload
        if (payload.username == null || payload.password == null)
            throw new HTTPError(
                400,
                "bad request",
                "username and password is nil"
            );

        // check user already exists or not
        const user = await User.findOne({
            where: { username: payload.username },
        });

        // kick if user not found or wrong password. no needs tell user if username is exists
        if (!user || user.password != payload.password)
            throw new HTTPError(
                400,
                "bad request",
                "wrong username or password"
            );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Login Success",
                data: { user_id: user.id },
            }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};

module.exports.addCourse = async (event) => {
    try {
        const { Course } = await connectToDatabase();
        const payload = JSON.parse(event.body);

        // check payload
        if (payload.name == null || payload.price == null)
            throw new HTTPError(400, "bad request", "required name and price");

        // check course name already exist or not
        const course = await Course.findOne({
            where: { name: payload.name },
        });
        if (course)
            throw new HTTPError(
                400,
                "bad request",
                "course name already exists"
            );

        // struct of course
        const newCourse = {
            name: payload.name,
            price: payload.price,
            status: 1, // active
        };

        const res = await Course.create(newCourse);
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Success Create New Course",
                data: res,
            }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};

module.exports.listCourse = async (event) => {
    try {
        const { Course } = await connectToDatabase();

        // get all course has status active. status == 1
        const course = await Course.findAll({
            where: { status: active },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success Get List Course",
                data: course,
            }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};

module.exports.getCourse = async (event) => {
    try {
        const { Course } = await connectToDatabase();

        const id = event.pathParameters.id;
        // get course by id
        const course = await Course.findOne({
            where: { id: id, status: active },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success Get Course",
                data: course,
            }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};

module.exports.updateCourse = async (event) => {
    try {
        const { Course } = await connectToDatabase();

        const id = event.pathParameters.id;

        // check course exists or not
        const course = await Course.findOne({
            where: { id: id, status: active },
        });

        if (!course)
            throw new HTTPError(400, "bad request", "course not found");

        const payload = JSON.parse(event.body);

        // check payload
        if (payload.name == null || payload.price == null)
            throw new HTTPError(400, "bad request", "required name and price");

        const oCourse = await Course.findOne({
            where: { name: id, status: active },
        });

        if (oCourse)
            throw new HTTPError(
                400,
                "bad request",
                "course name already exists"
            );

        if (course.name) course.name = payload.name;
        if (course.price) course.price = payload.price;

        await Course.update(
            { name: course.name, price: course.price },
            { where: { id: id } }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success Update Course",
                data: course,
            }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};

module.exports.deleteCourse = async (event) => {
    try {
        const { Course } = await connectToDatabase();

        const id = event.pathParameters.id;

        // check course exists or not
        const course = await Course.findOne({
            where: { id: id, status: active },
        });

        if (!course)
            throw new HTTPError(400, "bad request", "course not found");

        await Course.update({ status: nonActive }, { where: { id: id } });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success Delete Course",
            }),
        };
    } catch (err) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
            }),
        };
    }
};
