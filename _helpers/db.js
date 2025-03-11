const { AppDataSource } = require('../config/ormconfig');
const mysql = require('mysql2/promise'); 
const { Sequelize } = require('sequelize');

const db = AppDataSource;
module.exports = db;


async function initialize() {
    try {
        // create db if it doesn't already exist
        const { host, port, user, password, database } = config.database;
        const connection = await mysql.createConnection({ host, port, user, password }); 
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        // connect to db
        const sequelize = new Sequelize(database, user, password, { 
            host, // Added host to fix connection issues
            dialect: 'mysql' 
        });

        // init models and add them to the exported db object 
        db.User = require('../users/user.model')(sequelize);

        // sync all models with database
        await sequelize.sync({ alter: true });

        // export sequelize for reuse
        db.sequelize = sequelize;

        console.log("Database connected and synchronized.");
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

// Run initialize and export db
initialize();
module.exports = db;
