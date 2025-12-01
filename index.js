const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const app =express();
const port =process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.im5itev.mongodb.net/?appName=Cluster0`;


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
        // await client.connect();

        const db =client.db("car_db");
        const carsCollection = db.collection("cars");
        const bookingCollection = db.collection("booking");

// cars 
        app.get("/cars",async(req,res)=>{
            const carsor = carsCollection.find();
            const result= await carsor.toArray();
            res.send(result);
        })
        // latest cars
        app.get("/latest-cars",async(req,res)=>{
            const carsor = carsCollection.find().sort({postedAt:1}).limit(6);
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


       // my listings car
       app.get("/cars/email/:email", async (req, res) => {
           const email = req.params.email; 
           let query = { providerEmail: email };
       
           const result = await carsCollection.find(query).toArray();
           res.send(result);
       });

// update car api 
       app.put("/cars/:id",async(req,res)=>{
         const id =req.params.id;
         const query ={_id : new ObjectId(id)}
         const data = req.body
         const filter = query
         const update ={
            $set:data 
         };
         const result =await carsCollection.updateOne(filter,update)
         res.send(result)
       })
       



        // my booking 
        app.post("/booking",async(req,res)=>{
            let data =req.body;
            data.status = "booking";
            const id =req.body._id
            const filter ={_id : new ObjectId(id)}
            const update ={
                $set:{
                    status :"booking"
                }
            }
            await carsCollection.updateOne(filter,update)
            const result =await bookingCollection.insertOne(data)
            res.send(result)
        })

        app.get("/booking/email/:eamil",async(req,res)=>{
            const email =req.params.eamil;
            const query ={booking_by:email}
            const result =await bookingCollection.find(query).toArray()
            res.send(result)
        })

// delete
        app.delete("/cars/:id",async(req,res)=>{
            const id =req.params.id;
            const query ={_id: new ObjectId(id)};
            const result = await carsCollection.deleteOne(query);
            res.send(result);
        })




        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    }
    finally{

    }

}

run().catch(console.dir)

app.listen(port,()=>{
    console.log(`smart server is runing on port ${port}`)
})  