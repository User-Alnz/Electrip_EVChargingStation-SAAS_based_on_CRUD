export interface MysqlError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  sqlState?: string;
  sql?: string;
}

export function isMysqlError(err: any): err is MysqlError {
  return typeof err === "object" && err !== null && "code" in err;
}

export function handleSqlError(error: unknown) {
  if (isMysqlError(error)) {
    switch (error.code) {
      case "ER_DUP_ENTRY":
        throw new Error("Duplicate in table");
      case "ER_NO_REFERENCED_ROW":
        throw new Error("Invalid foreign key.");
      case "ER_BAD_FIELD_ERROR":
        throw new Error(`Bad field: ${error.sqlMessage}`);
      default:
        throw new Error(`Database error: ${error.sqlMessage || error.message}`);
    }
  }

  // fallback for unknown errors
  throw new Error("An unexpected error occurred.");
}