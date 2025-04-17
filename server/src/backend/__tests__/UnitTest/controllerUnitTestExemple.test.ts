import { NextFunction, Request, Response } from 'express';
import  middlewareExample from "../../Controller/middlewareExample"

describe('This is testing Authorization Controller/middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn()
        };
    });

    test('without headers', async () => {
        const expectedResponse = {
            "error": "Missing JWT token from the 'Authorization' header"
        };

        middlewareExample.Authorization(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('without "authorization" header', async () => {
        const expectedResponse = {
            "error": "Missing JWT token from the 'Authorization' header"
        };
        mockRequest = {
            headers: {
            }
        }
        middlewareExample.Authorization(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('with "authorization" header', async () => {
        mockRequest = {
            headers: {
                'authorization': 'Bearer abc'
            }
        }
        middlewareExample.Authorization(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toBeCalledTimes(1);
    });
});