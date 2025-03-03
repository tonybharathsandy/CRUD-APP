const express = require('express')

const fs = require('fs')

const cors = require('cors')

const app = express()

const data = require('./data.json')

app.use(cors())

app.use(express.json()); 

function writeUserData(data){
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2))
}

app.get("/", (request, response) => {
    response.send(data)
})

app.post("/add-user", (request, response) => {
    console.log(request.body)
    const newUserData = {
    id : data.length + 1, 
    ...request.body
}
    console.log(newUserData)
    data.push(newUserData)
    writeUserData(data)
    response.send(data);
})

app.delete('/add-user:id', (request, response) => {
    const removeId = request.params.id
    const removedData = data.filter((value) => {
        return value.id !== Number(removeId)
    })
    writeUserData(removedData)
    response.send(removedData)
})

app.patch('/add-user:id', (request, response) =>{
    const id = Number(request.params.id)
    console.log(request.body)
    const editedData = data.map((value) => {
        if(value.id === id){
            return request.body
        }
        else{
           return value
        }
    })
    writeUserData(editedData)
    response.send(editedData)
})

app.listen(8000, (err) => {
    console.log("Server running successfully on port 8000")
    if(err){
        console.log(err)
    }
})