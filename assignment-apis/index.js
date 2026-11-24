import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import { Pool, Query } from 'pg'

const app = express()
app.use(express.json());

const pool =  new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT

})

const connectDB = async()=>{
    let client;
    try {
        client = await pool.connect();
        console.log("db connected");
        
    } catch (error) {
        console.log('db error',error);
        
    }finally{
        if(client){
            client.release()
        }
    }

}





app.post('/student',async(req,res)=>{
    try {
        const {name,email,age,course} = req.body
        const re = await pool.query(
            `insert into student (name,email,age,course) values ($1,$2,$3,$4)
             returning *
            `,[name,email,age,course]
        )
        res.json({
            message:"value inserted",
            data:re.rows
        })
        
    } catch (error) {
        res.json({message:'error',error:error})
    }
})

app.get('/student',async(req,res)=>{
    try {
        const re = await pool.query(`
           select * from student 
        `)
        res.json({
            message:"value selected",
            data:re.rows
        })
        
    } catch (error) {
         res.json({message:'error',error:error})
    }
})

app.put('/student/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const {name,email,age,course} = req.body
        const re = await pool.query(`
            update student set name = $1,email = $2,age=$3, course = $4 
            where id = $5
            returning *    
            ` , [name,email,age,course,id]
        )
        res.json({
            message:"value edited",
            data:re.rows
        })
        
    } catch (error) {
        res.json({message:'error',error:error})
    }
})

app.delete('/student/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const re = await pool.query(`
            delete from student where id = $1
            returning *
        `,[id])

        res.json({
            message:"value deleted",
            data:re.rows

        })
        
    } catch (error) {
        res.json({message:'error',error:error})
    }
})

app.get('/student/search',async(req,res)=>{
    try {
        const {course} = req.query
        const re = await pool.query(
            `select * from student where course = $1`,
            [course]
        )
        if(re.rowCount<1){
            return res.json({
                message:'no such course'
            })
        }
        res.json({
            message:"value searched",
            data:re.rows
        })
        
    } catch (error) {
        res.json({message:'error',error:error})
    }
})



const ss = async()=>{
    try {
        await connectDB()
        app.listen(3000)
        
    } catch (error) {
        console.log("server error",error);
        
    }

}
ss()


