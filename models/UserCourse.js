module.exports = (sequelize, type) => {
    return sequelize.define("user_course", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: type.INTEGER,
        course_id: type.INTEGER,
        name: type.STRING,
        price: type.INTEGER,
    });
};
