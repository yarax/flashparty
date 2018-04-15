const MongoClient = require('mongodb').MongoClient;
import Config from '../config';
const config = Config();

let connection;

async function initMongo() {
  const client = await MongoClient.connect(config.mongo.url)
  const db = client.db("flashparty");
  await db.collection('spots').createIndex( { location : "2dsphere" } );
  return db;
}

export function connect() {
  connection = connection || initMongo();
  return connection;
}