const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()

app.use(cors())
app.use(bodyParser.json())
mongoose.connect('mongodb://localhost:27017/todo', 
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(()=>console.log('Connected to MongoDB'))
    .catch(err => console.log(err))


//Schema
const TodoSchema=new mongoose.Schema({
    title:{type:String,required:true},
    completed:{type:Boolean,default:false}
    
})


const Todo=mongoose.model('Todo',TodoSchema)

app.get('/api/todos',async(req,res) =>{
    try{
        const todos= await Todo.find();
        res.json(todos)
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
})

//Create
app.post('/api/todos',async(req,res) =>{
    try{
        const {title}= req.body;
        if(!title){
            return res.status(400).json({message:'Title is required'})
        }
        const newTodo=new Todo( {title})
        const savedTodo= await newTodo.save()
        res.status(201).json(savedTodo)
    }catch(err){
        cosole.log('Eror creating todo',err)
        res.status(500).json({message:'Server error'}
            
        )
    }
})

app.patch('/api/todos/:id', async(req,res) =>{
    try{
        const updateTodo=await Todo.findByIdAndUpdate(
            req.params.id,
            {title:req.body.title},
            {new:true}
        )
        res.json(updateTodo)
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
})

app.delete('/api/todos/:id',async(req,res) =>{
    try{
        await Todo.findByIdAndDelete(req.params.id)
        res.json({message:'Todo deleted'})
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
})








const PORT=5000;
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))