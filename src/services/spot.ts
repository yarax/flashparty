import {SpotRequest, Spot} from '../models/spot';
import {FlashParty} from '../models/flashparty';
import {connect} from '../services/mongo';
import Config from '../config';
import * as geolib from 'geolib';

const config = Config();

async function flushParty(db, userIds) {
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
}

async function updatePartyParticipants(db, userId, flashparty) {
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
}

export async function createSpot(requestBody: SpotRequest) {
  const db  = await connect();
  const existing: Spot = await db.collection('spots').findOne({userId: requestBody.userId});

  if (existing) {

      // checking if party can still exist
    if (existing.flashparty) {
      const dist = geolib.getDistance({longitude: requestBody.lon, latitude: requestBody.lat}, {longitude: existing.flashparty.location[0], latitude: existing.flashparty.location[1]});

      if (dist > config.radiusMeters) {
        if (existing.flashparty.participants.length < 6) { // party cannot exist anymore
          await flushParty(db, existing.flashparty.participants)
        } else {
          await updatePartyParticipants(db, requestBody.userId, existing.flashparty)
        }
      }
    }

    return db.collection('spots').update({userId: requestBody.userId}, {
      ts: requestBody.ts,
      location: { type: 'Point', coordinates: [ requestBody.lon, requestBody.lat ] }
    });
  } else {
    return db.collection('spots').insert({
      ts: requestBody.ts,
      userId: requestBody.userId,
      location: { type: 'Point', coordinates: [ requestBody.lon, requestBody.lat ] }
    });
  }
}

export async function deleteSpot(spotId) {
  const db  = await connect();
  return db.collection('spots').deleteOne({_id: spotId});
}

async function getSpotsNearBy(db, lon, lat) {
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
          "$sort": {"distance": -1}
      } 
    ]).toArray();
}

export async function getNearestParty(lon, lat) {
  const db = await connect();
  const spots: any = await getSpotsNearBy(db, lon, lat);
  if (spots.length < config.minNumberOfParticipants) {
    throw new Error('Not enough folks nearby');
  }

  // Skipping step of acknowledgement by each participant
  // and setting the flash party to everyone in the area
  const party: FlashParty = {
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

  await Promise.all(promises);
  return party;

}