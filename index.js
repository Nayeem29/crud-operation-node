const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
// const ObjectId = require('mongodb').ObjectId;

//use middleware
app.use(cors());
app.use(express.json());

//user: dbUser1
//password: Q4vhQpLaIQ0m5j5H



const uri = "mongodb+srv://dbUser1:Q4vhQpLaIQ0m5j5H@cluster0.ebuer.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const userCollection = client.db('foodExpress').collection('user');
    // get all users 
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // get one user based on id
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Update user based on id
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedUser = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        }
      };
      const result = await userCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    })

    // post user into data base
    app.post('/user', async (req, res) => {
      const newUser = req.body;
      console.log('adding new user', newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //Delete one user by params and query
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Crud operation is running');
});

app.listen(port, () => {
  console.log('Mongo crud is processing');
});