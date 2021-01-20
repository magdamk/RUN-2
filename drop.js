const mongo = require('mongodb');
const databaseUrl = 'mongodb://localhost';

async function run() {
    try {
        let client = new mongo.MongoClient(databaseUrl, { useUnifiedTopology: true });
        await client.connect();
        console.log('ok');
        let collectionName = 'races';
        let exists = (await (await client.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1);
        if ((exists) && (await client.db('app').dropCollection('races'))) {
            console.log("Collection 'races' deleted");
        } else { console.log("Collection 'races' not found") }
        collectionName = 'participants';
        exists = (await (await client.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1);
        if ((exists) && (await client.db('app').dropCollection('participants'))) {
            console.log("Collection 'participants' deleted");
        } else { console.log("Collection 'participants' not found") }
        collectionName = 'clubs';
        exists = (await (await client.db('app').listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1);
        if ((exists) && (await client.db('app').dropCollection('clubs'))) {
            console.log("Collection 'clubs' deleted");
        } else { console.log("Collection 'clubs' not found") }

        await client.close();
    } catch (err) {
        console.error(err);
    };
}

run();