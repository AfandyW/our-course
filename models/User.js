module.exports = (sequelize, type) => {
    return sequelize.define("users", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: type.STRING,
        password: type.STRING,
        status: type.INTEGER,
    });
};
