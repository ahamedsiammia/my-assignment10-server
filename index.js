const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://carspotdbuser:1jtNg3UPZbv9zIux@cluster0.im5itev.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get("/", (req,res)=>{
    res.send("car server is runing")
})


async function run (){
    try{
        await client.connect();

        const db =client.db("car_db");
        const carsCollection = db.collection("cars");


        app.get("/cars",async(req,res)=>{
            const carsor = carsCollection.find();
            const result= await carsor.toArray();
            res.send(result);
        })
        // latest cars
        app.get("/latest-cars",async(req,res)=>{
            const carsor = carsCollection.find().limit(6);
            const result= await carsor.toArray();
            res.send(result);
        })
        // car details 
        app.get("/cars/:id",async(req,res)=>{
            const id =req.params.id;
            const query ={_id: new ObjectId(id)};
            const result =await carsCollection.findOne(query);
            res.send(result)
        })

        app.post("/cars",async(req,res)=>{
            const newCar =req.body;
            const result =await carsCollection.insertOne(newCar);
            res.send(result)
        })


        app.delete("/cars/:id",async(req,res)=>{
            const id =req.params.id;
            const query ={_id: new ObjectId(id)};
            const result = await carsCollection.deleteOne(query);
            res.send(result);
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    }
    finally{

    }

}

run().catch(console.dir)

app.listen(port,()=>{
    console.log(`smart server is runing on port ${port}`)
})  