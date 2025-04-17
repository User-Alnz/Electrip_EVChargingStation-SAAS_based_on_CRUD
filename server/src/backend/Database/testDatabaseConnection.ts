import OpenPoolConnectionToSQL from "./DatabaseConnection.js"

/*********
** Just a script to test if connection pool to DB is well working
**********/

OpenPoolConnectionToSQL
  .getConnection()
  .then(async(connection) => {
    console.info(`Using database ${process.env.DB_NAME} \n Here is a sample of your tables :\n`);

        const displayDatabases = await connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? LIMIT 5`,
        [process.env.DB_NAME]);// just exemple yon can display something else
        console.info(displayDatabases);

    //connection.release(); only on production mode rather than OpenPoolConnectionToSQL.end(); that close whole pool connection
    await OpenPoolConnectionToSQL.end(); // Can also kill porcess => process.exit()
  })
  .catch((error: Error) => {
    console.warn("Warning:", "Failed to establish a database connection.");
    console.warn(error.message);
  });