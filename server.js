import express from 'express'
import { MongoClient,ObjectId } from 'mongodb'
const app= express ()
const port=process.env.PORT



// body parser Middelware
app.use(express.json())

// connect To Database (MonggoDB) using MongoClient
const url=process.env.MONGO_URL
const client = new MongoClient(url)
let dbName='moviesDB'
let db
const connectToDB =async () => {
    try {
      await client.connect()
      console.log('Connected to MongoDB')
      db = client.db(dbName)
    } catch (error) {
        console.log (`Error when try to connect${error}`)
    }
}


connectToDB()

app.post('/movies/add-movie',async(req,res)=>{
    try {
        const movie= (req.body)
        const result=await db.collection('movies').insertMany(movie)
        if(!result){
            return res.status(400).json({message:'Movie not added'})
        }
        res.status(201).json({message:'Movie added successfully',result})
        }
catch (error) { 
            console.log (`Error when try to add movie${error}`)
            res.status(500).send({message:'Cannot add a movie'})
        }
    })

//Get all movies
app.get('/movies',async (req,res)=>{
    try {
        const result =await db.collection('movies').find().toArray()
        if(!result){
            return res.status(500).json({message:'No movies found'})
        }
        res.status(200).json({message:'Movies found',result})
    } catch (error) {
        console.log(error)
    res.status(500).send ('cannot get all movies')    }
})

//Get a  single movie by id and title
// app.get('/movies/:id',async (req,res)=>{
    app.get('/movies/:title',async (req,res)=>{

    
    try {
        // const {id} = req.params
        const {title} = req.params

        // const result =await db.collection('movies').findOne({_id:new ObjectId(id)})   
        const result =await db.collection('movies').findOne({title})    
 
        if(!result){
            return res.status(404).json({message:'Movie not found'})
            }
            res.status(200).json({message:'Movie found',result})
            } catch (error) {
                console.log(error)
                res.status(500).send ('cannot get a movie')
                }
                })

    // Update One movie 
    app.put('/UpdateMovie/:id',async (req,res)=>{
        try{
            const {id} = req.params
            const NewMovie = req.body
            const result =await db.collection('movies').updateOne({_id:new ObjectId(id)},
            {$set:NewMovie})
            if(result.matchedCound===0){
                return res.status(404).json({message:'Movie not found'})
                }
                res.status(200).json({message:'Movie updated',result})
                } catch (error) {
                    console.log(error)
                    res.status(500).send ('cannot update a movie')
                    }
                    })
                    // Delete a movie by id
                    app.delete('/DeleteMovie/:id',async (req,res)=>{
                        try{
                            const {id} = req.params
                            const result =await db.collection('movies').deleteOne({_id:new ObjectId(id)})
                            if(result.deletedCount===0){
                                return res.status(404).json({message:'Movie not found'})
                                }
                                res.status(200).json({message:'Movie deleted',result})
                                } catch (error) {
                                    console.log(error)
                                    res.status(500).send ('cannot delete a movie')
                                    }
                                    })
                                    


            


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})