const express = require("express");
const cors = require("cors");
const app = express();
const Port = 3000;
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send({ message: "Welcome to our server" });
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://foodmood:H3drqaE2ANCw9XpA@cluster0.vhkuyua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const foodItem = client.db("foodmood-Shop").collection("foods");

    app.get(`/foods`, async (req, res) => {
      const result = await foodItem.find().toArray();
      res.send(result);
    });


    app.get('/sort/:id', async(req,res)=>{
      const id = req.params.id
      console.log(id);
      if(id == "lowtohigh"){
        const result = await foodItem.find().sort({price : 1}).toArray();
        res.send(result)
        return
      }
      if(id == "hightolow"){
        const result = await foodItem.find().sort({price : -1}).toArray();
        res.send(result)
        return
      }
   
      
    })

    app.get("/foods/:id", async (req, res) => {
      const route = req.params.id;
      const query = { _id: new ObjectId(route) };
      const result = await foodItem.findOne(query);
      res.send(result);
      // console.log(result);
    });

    app.get("/name/:id", async (req, res) => {
      const route = req?.params?.id;
      const query = {name : route}
      const result = await foodItem.findOne(query)
      console.log(result);
    });

    app.post("/food", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await foodItem.insertOne(data);
      res.send(result);
    });


    app.put('/update/:id', async(req,res)=>{
      const id = req?.params?.id
      const data = req?.body

      const query = {_id : new ObjectId(id)}
      const options = {upsert : true}
      // const replace = {
      //   name : data?.name
      //   price : data?.price
      //   image : data?.image
      //   name : data?.name
      // }

      const result = await foodItem.replaceOne(query, data, options)
      console.log(result);
      res.send(result)
      

    })



    app.delete('/food/:id', async(req,res)=>{
      const route = req?.params?.id;

      const query = {_id : new ObjectId(route)}
      const result = await foodItem.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(Port, () => {
  console.log(`Server is running at ${Port}`);
});
