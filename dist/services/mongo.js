"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoClient = require('mongodb').MongoClient;
const config_1 = require("../config");
const config = config_1.default();
let connection;
function initMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield MongoClient.connect(config.mongo.url);
        const db = client.db("flashparty");
        yield db.collection('spots').createIndex({ location: "2dsphere" });
        return db;
    });
}
function connect() {
    connection = connection || initMongo();
    return connection;
}
exports.connect = connect;
//# sourceMappingURL=mongo.js.map