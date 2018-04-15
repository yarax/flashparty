"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const tsoa_1 = require("tsoa");
const party_1 = require("./controllers/party");
const spot_1 = require("./controllers/spot");
const models = {
    "FlashParty": {
        "properties": {
            "location": { "dataType": "array", "array": { "dataType": "double" }, "required": true },
            "participants": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "SpotRequest": {
        "properties": {
            "lat": { "dataType": "double", "required": true },
            "lon": { "dataType": "double", "required": true },
            "ts": { "dataType": "double", "required": true },
            "userId": { "dataType": "string", "required": true },
        },
    },
};
function RegisterRoutes(app) {
    app.get('/v1/party/:coordinates', function (request, response, next) {
        const args = {
            coordinates: { "in": "path", "name": "coordinates", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new party_1.PartyController();
        const promise = controller.getParty.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/v1/spots', function (request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "SpotRequest" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new spot_1.SpotController();
        const promise = controller.createSpot.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.delete('/v1/spots/:spotId', function (request, response, next) {
        const args = {
            spotId: { "in": "path", "name": "spotId", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new spot_1.SpotController();
        const promise = controller.deleteSpot.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    function promiseHandler(controllerObj, promise, response, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode;
            if (controllerObj instanceof tsoa_1.Controller) {
                const controller = controllerObj;
                const headers = controller.getHeaders();
                Object.keys(headers).forEach((name) => {
                    response.set(name, headers[name]);
                });
                statusCode = controller.getStatus();
            }
            if (data) {
                response.status(statusCode || 200).json(data);
            }
            else {
                response.status(statusCode || 204).end();
            }
        })
            .catch((error) => next(error));
    }
    function getValidatedArgs(args, request) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return tsoa_1.ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return tsoa_1.ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return tsoa_1.ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return tsoa_1.ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return tsoa_1.ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new tsoa_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
}
exports.RegisterRoutes = RegisterRoutes;
//# sourceMappingURL=routes.js.map