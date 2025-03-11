"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "node_mysql_crud_api",
    entities: [User_1.User], // ✅ Ensure this is correct
    synchronize: true, // ✅ This forces table creation
    logging: true
});
