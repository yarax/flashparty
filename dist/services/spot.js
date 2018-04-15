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
const mongo_1 = require("../services/mongo");
const config_1 = require("../config");
const geolib = require("geolib");
const config = config_1.default();
function flushParty(db, userIds) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Flashparty was deleted for users: ', userIds);
        const promises = userIds.map(userId => {
            return db.collection('spots').updateOne({
                userId: userId
            }, {
                $unset: {
                    flashparty: ''
                }
            });
        });
        return Promise.all(promises);
    });
}
function updatePartyParticipants(db, userId, flashparty) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = flashparty.participants.indexOf(userId);
        flashparty.participants.splice(index, 1);
        const promises = flashparty.participants.map(userId => {
            return db.collection('spots').updateOne({
                userId: userId
            }, {
                $set: flashparty
            });
        });
        return Promise.all(promises);
    });
}
function createSpot(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_1.connect();
        const existing = yield db.collection('spots').findOne({ userId: requestBody.userId });
        if (existing) {
            // checking if party can still exist
            if (existing.flashparty) {
                const dist = geolib.getDistance({ longitude: requestBody.lon, latitude: requestBody.lat }, { longitude: existing.flashparty.location[0], latitude: existing.flashparty.location[1] });
                if (dist > config.radiusMeters) {
                    if (existing.flashparty.participants.length < 6) { // party cannot exist anymore
                        yield flushParty(db, existing.flashparty.participants);
                    }
                    else {
                        yield updatePartyParticipants(db, requestBody.userId, existing.flashparty);
                    }
                }
            }
            return db.collection('spots').update({ userId: requestBody.userId }, {
                ts: requestBody.ts,
                location: { type: 'Point', coordinates: [requestBody.lon, requestBody.lat] }
            });
        }
        else {
            return db.collection('spots').insert({
                ts: requestBody.ts,
                userId: requestBody.userId,
                location: { type: 'Point', coordinates: [requestBody.lon, requestBody.lat] }
            });
        }
    });
}
exports.createSpot = createSpot;
function deleteSpot(spotId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_1.connect();
        return db.collection('spots').deleteOne({ _id: spotId });
    });
}
exports.deleteSpot = deleteSpot;
function getSpotsNearBy(db, lon, lat) {
    return __awaiter(this, void 0, void 0, function* () {
        return db.collection('spots').aggregate([
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [parseFloat(lon), parseFloat(lat)]
                    },
                    "distanceField": "distance",
                    "num": config.minNumberOfParticipants,
                    "maxDistance": config.radiusMeters,
                    "spherical": true
                }
            },
            {
                "$sort": { "distance": -1 }
            }
        ]).toArray();
    });
}
function getNearestParty(lon, lat) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_1.connect();
        const spots = yield getSpotsNearBy(db, lon, lat);
        if (spots.length < config.minNumberOfParticipants) {
            throw new Error('Not enough folks nearby');
        }
        // Skipping step of acknowledgement by each participant
        // and setting the flash party to everyone in the area
        const party = {
            location: [lon, lat],
            participants: spots.map(s => s.userId)
        };
        const promises = spots.map(spot => {
            return db.collection('spots').updateOne({
                userId: spot.userId
            }, {
                $set: {
                    flashparty: party
                }
            });
        });
        yield Promise.all(promises);
        return party;
    });
}
exports.getNearestParty = getNearestParty;
//# sourceMappingURL=spot.js.map