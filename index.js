const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config({ encoding: 'latin1' })
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function run() {
  try {
    await client.connect();
    const database = client.db("opportunity");
    const messageCollection = database.collection("message");

    app.post('/message', async(req, res) => {
      const messageData = req.body;
      const result = await messageCollection.insertOne(messageData);
      console.log(result);
      res.send(result);
    });

    app.get('/messages', async (req, res) => {
      const cursor = messageCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})