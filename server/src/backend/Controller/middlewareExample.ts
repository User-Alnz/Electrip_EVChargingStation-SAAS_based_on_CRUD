import type { RequestHandler } from "express";
import BadRequestError from "../errors/badRequestErrors.js";

const AsyncRead : RequestHandler = async (req, res, next) => {

    try {

        const {id} = req.body;

        if(!id)
        return next(new BadRequestError({code: 400, message: "Name is required!", logging: true}));

       //Add await other function() or async middleware here ! Or like calling Model function for instance. 
       // Ex => await Model_User.GetListofUser(); | 

       res.status(202).json({ 
            success : true, 
            message : "Request done"
        });

    } catch (err) {
        //Pass the error to errorHandler.
      next(err);
    }

};

//Sync for faster answer and if no other midleware, controllers or other function needed
const SyncRead : RequestHandler = (req, res, next) => {

    const {name} = req.query;

    if(!name)
    return next(new BadRequestError({code: 400, message: "Name is required!", logging: true}));

    const newUser = { id:  1, name,};

    res.status(201).send({ data: newUser });
}

// Exemple of Authorization middleware. Tested in /__test__/UnitTest/controllerUnitTestExemple.test.ts | In CLI Run => npm run test 
const Authorization : RequestHandler = (req, res, next) => {

    if (!req.headers || !req.headers['authorization']) {
        req.statusCode = 403;
        res.json({ error: "Missing JWT token from the 'Authorization' header" });
    } else {
        return next(new BadRequestError({ code : 401, message : "invalid Token", logging: true}));
    }
}


export default {AsyncRead, SyncRead, Authorization};