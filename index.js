const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express(); 
const port = process.env.PORT || 5000;
// const bodyParser = require('body-parser');
// const fs = require('fs');


// app.use(bodyParser.json());

// middleware
app.use(cors());

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



      
       const usersCollection = client.db('Employee').collection('users')
        const workCollection = client.db('Employee').collection('work')
        const salariesCollection = client.db('Employee').collection('salaries')
        const ContactsCollection = client.db('Employee').collection('contacts')


    
  
  

       app.post('/users', async(req,res)=> {
        let users = req.body;
        // console.log(users)
        if(users.role === "employee" ){
          const result = await usersCollection.insertOne({...users, isVerified:"false"});
       return res.send(result)
           
        }
        
        const result = await usersCollection.insertOne(users);
        res.send(result)
  })

  app.get('/users', async (req,res)=> {
    const id = req.params.id
    // console.log(id)
    const cursor = usersCollection.find({role: {$ne: "admin"}  }  );
    const result = await cursor.toArray();
    res.send(result);
  })
  app.get("/users/:id", async(req,res)=> {
    const id = req.params.id;
    const query = {_id :new ObjectId (id)};
    const result = await usersCollection.findOne(query);
    res.send(result)
  })

  app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  });

 
  // app.delete("/users/:id", async(req,res)=> {
  //   const id = req.params.id;
  //   const query = {_id :new ObjectId (id)};
  //   const result = await usersCollection.findOneAndDelete(query);
  //   res.send(result)
  // })

 

  app.get('/usersby/:role', async (req, res) => {


    const role = req.params.role
  
  
    const result = await usersCollection.find({ role: role }).toArray()
  
    res.send(result)
  
  })
  app.get('/usersbyid/:role/:id', async(req,res)=> {
    const id = req.params.id;
    // const smallBrandName = brandName.toLowerCase()
    const query = {_id :new ObjectId (id)};
    const result = await usersCollection.findOne(query);
    res.send(result)
  })

  app.patch('/users/:id', async (req,res)=>{
    const id = req.params.id;
    const verified = req.query.verified
    console.log(id,verified)
    
     await usersCollection.findOneAndUpdate({_id : new ObjectId(id)},{$set:{
      isVerified : verified

    }})
   res.send({success : true})
  })

  app.patch('/users/role/:id', async (req,res)=>{
    const id = req.params.id;
    const role = req.query.role
    console.log(id,role)
    
     await usersCollection.findOneAndUpdate({_id : new ObjectId(id)},{$set:{
      role : role

    }})
   res.send({success : true})
  })

  app.patch('/users/fired/:id', async (req,res)=>{
    const id = req.params.id;
    // const fired = req.query.fired

        
     await usersCollection.findOneAndUpdate({_id : new ObjectId(id)},{$set:{
      isFired : true

    }})
   res.send({success : true})
  })
  
  

  app.get('/user/:email',async (req,res)=> {
    const email = req.params.email;
    const result = await usersCollection.findOne({email})
    res.send(result)
  })

         // Save or modify user email, status in DB
        //  app.put('/users:email', async (req, res) => {
        //   const email = req.params.email
        //   const user = req.body
        //   const query = { email: email }
        //   const options = { upsert: true }
        //   const isExist = await usersCollection.findOne(query)
        //   console.log('User found>', isExist)
        //   if (isExist) return res.send(isExist)
        //   const result = await usersCollection.updateOne(
        //     query,
        //     {
        //       $set: { ...user, timestamp: Date.now() },
        //     },
        //     options
        //   )
        //   res.send(result)
        // })

     //Salary Pay
    app.post("/salaries", async (req, res) => {
      const salary = req.body;
      const result = await salariesCollection.insertOne(salary);
      res.send(result);
    });

    app.get("/salaries", async (req, res) => {
      const result = await salariesCollection.find().toArray();
      res.send(result);
    });  

     //get rooms for host
     app.get('/salaries/:email', async (req, res) => {
      const email = req.params.email
      const result = await salariesCollection
        .find({ email : email })
        .toArray()
      res.send(result)
    })






app.post('/works', async(req,res)=> {
  const newProduct = req.body;
  console.log(newProduct)
  const result = await workCollection.insertOne(newProduct);
  res.send(result)
})

app.get('/works', async (req,res)=> {
  const email = req.query.email
  const query = {email : email}
  const cursor =await workCollection.find(query).sort({date : -1}).toArray();
  
  // const result = await cursor;
  res.send(cursor);
})

app.get('/allWorks', async(req,res)=> {
   const result =await workCollection.find().toArray()
   res.send(result)
})
app.get('/allWorks/:email', async (req, res) => {
  const email = req.params.email
  const result = await workCollection
    .find({ email : email })
    .toArray()
  res.send(result)
})
app.get('/allWorks/:email/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await workCollection.find(query).toArray();
  res.send(result);
})

app.put("/updateWork/:id", async(req,res)=> {
  const id = req.params.id;
  const filter = { _id : new ObjectId(id)};
  // const options = {upsert : true};
  const updateWork = req.body;
  // const Product = 
  console.log(updateWork)
  const result = await workCollection.updateOne(filter, 
    {
      $set : {
        name : updateWork.name,
        task : updateWork.task,
        description : updateWork.description,
        date : updateWork.date,
        hoursWorked : updateWork.hoursWorked
        
      }
    } );
  res.send(result)
})

// app.get("/tasks",  async (req, res) => {
//   const result = await tasksCollection.find().toArray();
//   res.send(result);
// });

app.delete("/allWorks/:email/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await workCollection.deleteOne(query);
  res.send(result);
});
app.delete("/allWorks/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await workCollection.deleteOne(query);
  res.send(result);
});

// contact api
app.post("/contacts", async (req, res) => {
  const contact = req.body;
  const result = await ContactsCollection.insertOne(contact);
  res.send(result);
});

    //HR stats
    app.get("/hr-stats",  async (req, res) => {
      const users = await usersCollection.estimatedDocumentCount();
      const totalSalaryAmount = await salariesCollection.estimatedDocumentCount();
      const totalTask = await workCollection.estimatedDocumentCount();
      const totalContacts = await ContactsCollection.estimatedDocumentCount();
      
      const pipeline = [
          {
            $group: {
              _id: null,
              totalPaidSalary: { $sum: '$salary' },
            },
          },
        ];
  
        const result = await salariesCollection.aggregate(pipeline).toArray();
        const PaidSalary = result.length > 0 ? result[0].totalPaidSalary : 0;


      res.send({users, totalSalaryAmount, PaidSalary, totalTask, totalContacts});
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
    res.send('Employee server is running')

})

app.listen(port, ()=> {
    console.log(`Employee server running on port : ${port}`)
})