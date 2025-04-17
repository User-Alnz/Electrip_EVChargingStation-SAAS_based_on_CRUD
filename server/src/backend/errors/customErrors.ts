/************************************************************************
    Creating an abstract class From "Error" native class in typescript 

    We use abstract an readonly to have by default a base set property
    for buitl over class to handle errors

    next in badRequestErrors.ts
*************************************************************************/

export type CustomErrorContent = {
    message: string,
    context?: { [key: string]: any }
  };
  
  export default abstract class CustomError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errors: CustomErrorContent[];
    abstract readonly logging: boolean;
  
    constructor(message: string) {
      super(message);
  
      // Only because we are extending a built in class
      Object.setPrototypeOf(this, CustomError.prototype);
    }
}