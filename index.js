const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express(); 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;

// middleware
// https://backend-nine-liart.vercel.app/ http://localhost:5173/
 app.use(cors({
  origin : [
     'http://localhost:5173', 'https://hotel-booking-mern-c8edc.web.app' , 'https://hotel-booking-mern-c8edc.firebaseapp.com'
  ],
  credentials: true
 }));
 app.use(express.json());
 app.use(cookieParser());

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


const logger = (req, res, next)=> {
  console.log('log : info', req.method, req.url);
  next();
}
const verifyToken = (req,res,next) => {
  const token = req?.cookies?.token;
  if(!token){
    return res.status(401).send({message : 'unauthorize access'})
  }
  jwt.verify(token,process.env.SECRET_TOKEN, (err,decoded)=> {
    if(err){
      return res.status(401).send({message: 'unauthorized access'})
    }
    req.user = decoded;
    next();

  })
  console.log('middleware', token);

}
//   const verifyToken = async (req, res, next) => {
//     const token = req.cookies?.token;
//     if (!token) {
//         return res.status(401).send({ message: 'unauthorized access' })
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({ message: 'unauthorized access' })
//         }
//         req.user = decoded;
//         next();
//     })
// }
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();



      
       const bookingCollection = client.db('Booking').collection('bookings')
       const usersCollection = client.db('Booking').collection('user')

      // const bookingCollection = client.db('Booking').collection('bookings');
      const roomCollection = client.db('Booking').collection('rooms')
    app.post('/user',async(req,res)=> {
      const user = req.body;
      console.log(user)
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })
    app.get('/user', async (req,res)=> {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get("/user/:id", async(req,res)=> {
      const id = req.params.id;
      // const smallBrandName = brandName.toLowerCase()
      const query = {_id :new ObjectId (id)};
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

      app.post('/rooms', async(req,res)=> {
        const newProduct = req.body;
        console.log(newProduct)
        const result = await roomCollection.insertOne(newProduct);
        res.send(result)
  })
  
  app.get('/rooms', async (req,res)=> {
    const cursor = roomCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })
  app.get("/rooms/:id", async(req,res)=> {
    const id = req.params.id;
    // const smallBrandName = brandName.toLowerCase()
    const query = {_id :new ObjectId (id)};
    const result = await roomCollection.findOne(query);
    res.send(result)
  })

  app.post('/bookings', async(req,res)=> {
    let booking = req.body;
    console.log(booking)
    const result = await bookingCollection.insertOne(booking);
    res.send(result)
})

app.get('/bookings', logger, verifyToken, async (req,res)=> {
  const id = req.params.id;
  // console.log('cooockies', req.cookies); 


  console.log(id)
  const cursor = bookingCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

// app.get("/bookings/:id", async(req,res)=> {
//   const id = req.params.id;
//   // const smallBrandName = brandName.toLowerCase()
//   const query = {_id : id};
//   const result = await bookingCollection.findOne(query).toArray();
//   res.send(result)
// })

app.get('/bookings/:email', logger, verifyToken, async (req, res) => {
  const email = req.params.email ;
  const result = await bookingCollection.find({ email: email }).toArray()
  res.send(result)

})

app.post('/jwt', logger, verifyToken, async (req,res)=> {
  const user =req.body;
  console.log(user);
  const token = jwt.sign(user, process.env.SECRET_TOKEN, {expiresIn: '1h'});
  res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .send({ success: true })
        })

        app.post('/logout', async(req,res)=>{
          const user = req.body;
          console.log('logging out', user)
          res.clearCookie('token', {maxAge : 0, secure:true}).send({success: true})
        })

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




app.delete('/bookings/:id',async(req,res)=>{
  const id = req.params.id
   console.log(id)
   const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
     res.send(result);
    })

  


  
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
    res.send('Coffee server is running')

})

app.listen(port, ()=> {
    console.log(`coffee server running on port : ${port}`)
})