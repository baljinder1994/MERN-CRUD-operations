import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import './App.css'
const server = () => {
    const[searchQuery,setSearchQuery]=useState('')
    const[newTodo,setNewTodo]=useState('')
    const[todos,setTodos]=useState([])

   useEffect(() =>{
    fetchTodos()
   },[])

  const fetchTodos=() =>{
    axios.get('http://localhost:5000/api/todos')
    .then(response => setTodos(response.data))
    .catch(error => console.log('Error fetching',error)
        
    )
  }

  const editTodo=(id) =>{
    const updatedTitle=prompt("Edit Todo");
    if(updatedTitle){
        axios.patch(`http://localhost:5000/api/todos/${id}`,{title:updatedTitle})
        .then(response =>{
            setTodos(todos.map(todo =>(todo._id ===  id ? response.data : todo) ))
        })
        .catch(error => console.error('Error updating',error))
    }
  }

   const deleteTodo=(id) =>{
     axios.delete(`http://localhost:5000/api/todos/${id}`)
     .then(() => setTodos(todos.filter(todo => todo._id !== id)))
     .catch(error => console.error('Error deleting'))
   }

    const addTodo = (e) => {
     e.preventDefault();
     if(newTodo.trim()){
        axios.post('http://localhost:5000/api/todos',{title:newTodo})
        .then(response =>{
            setTodos([...todos,response.data])
            setNewTodo('')
        })
        .catch(error => console.log(error))
     }
}

const filterTodo=todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
)

  return (
    <div className='app'>
      <h1>CRUD Todo</h1>
      <input
        type="text"
        placeholder='Search box'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='search-input'
      ></input>
      <form onSubmit={addTodo} className='todo-form'>
      <input
        type="text"
        placeholder='Add data..'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className='search-input'
      ></input>
      <button type="submit">Add </button>
      </form>
      <ul className='todo-list'>
        {filterTodo.map((todo) =>(
        <li className='todo-item'>
           <span> {todo.title}</span>
        <div>
            <button onClick={() => editTodo(todo._id)}>✏️</button>
            <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
        </div>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default server
