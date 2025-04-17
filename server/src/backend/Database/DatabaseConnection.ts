import "dotenv/config";
import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

/*********
** The pool manages multiple connections under the hood, so it can handle multiple queries at the same time more efficiently than creating one connection per request.
**********/

const OpenPoolConnectionToSQL = mysql.createPool({ //Create pool keep connection open on 127.0.0.0.1 port MySQL is running, usually ::3306.
  host: DB_HOST,
  port: Number.parseInt(DB_PORT as string),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default OpenPoolConnectionToSQL; //Change name OpenPoolConnectionToSQL => Database in /Model

import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type Database = Pool;
type QueryResult = ResultSetHeader; //Not expecting any rows back. Like query => DELETE, UPDATE, DELETE | Does return object and following entries : insertId, affectedRows, changedRows, warningCount
type RowsResult = RowDataPacket[]; // return Array Json format

//Use Database to Database.query() your SQL.
export type { Database, QueryResult, RowsResult };