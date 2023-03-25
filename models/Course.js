module.exports = (sequelize, type) => {
    return sequelize.define("courses", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: type.STRING,
        price: type.INTEGER,
        status: type.INTEGER,
    });
};
