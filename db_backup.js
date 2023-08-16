const fs = require('fs');
const fastcsv = require('fast-csv');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; //if you use different port change the port
const dbName = 'dbName';
const collectionName = 'collectionName';

(async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const cursor = collection.find({}); // You can apply filters here if needed

    const csvStream = fastcsv.format({ headers: true });
    const writableStream = fs.createWriteStream('mongoDump.csv');

    csvStream.pipe(writableStream);

    await cursor.forEach(document => {
      csvStream.write(document);
    });

    csvStream.end();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
})();