const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express(); 
const port = process.env.PORT || 5000;

// middleware
// https://backend-nine-liart.vercel.app/ http://localhost:5173/
 app.use(cors({
  origin : [
     'http://localhost:5173', 
  ],
  credentials: true
 }));
 app.use(express.json());

//  app.use(cookieParser());





 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.30z9ip6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });




  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();



      
       const bookingCollection = client.db('Booking').collection('bookings')
       const usersCollection = client.db('Booking').collection('user')

    
  
  

 



         // Save or modify user email, status in DB
    // app.put('/users/:email', async (req, res) => {
    //   const email = req.params.email
    //   const user = req.body
    //   const query = { email: email }
    //   const options = { upsert: true }
    //   const isExist = await bookingCollection.findOne(query)
    //   console.log('User found?----->', isExist)
    //   if (isExist) return res.send(isExist)
    //   const result = await bookingCollection.updateOne(
    //     query,
    //     {
    //       $set: { ...user, timestamp: Date.now() },
    //     },
    //     options
    //   )
    //   res.send(result)
    // })




// app.delete('/bookings/:id',async(req,res)=>{
//   const id = req.params.id
//    console.log(id)
//    const query = {_id: new ObjectId(id)}
//       const result = await bookingCollection.deleteOne(query)
//      res.send(result);
//     })

  


  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=> {
    res.send('Employee server is running')

})

app.listen(port, ()=> {
    console.log(`Employee server running on port : ${port}`)
})