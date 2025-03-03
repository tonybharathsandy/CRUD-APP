import axios from 'axios'
import './App.css'
import { useEffect, useState } from 'react'

function App() {

  const [serverDatas, setServerDatas] = useState([])
  const [filterData, setFilterData] = useState("")
  const [addUser, setAddUser] = useState(false)
  const [objectData, setObjectData] = useState({
    name : "",
    place : "",
    number : ""
  })
  const [edit, setEdit] = useState(false)
  const [userId, setUserId] = useState("")
  console.log("editID : " , userId)

  useEffect(() => {
    serverData()
  }, [])
 
  async function serverData(){
    let serverData = await axios.get('http://localhost:8000/')
    setServerDatas(serverData.data)
  }
  console.log(serverDatas)

  function filteringData(e){

    if(filterData.length === 1){
      serverData()
    }
      setFilterData(e.target.value)
      let ans = serverDatas.filter((data) => {
       return data.name.toLowerCase().includes(filterData.toLowerCase()) || data.place.toLowerCase().includes(filterData.toLowerCase())
      })
      setServerDatas(ans)
  }

  function addUserData(e){
      setObjectData({...objectData, [e.target.name] :  e.target.value})
  }

  function userSubmit(e){
    e.preventDefault()
    axios.post('http://localhost:8000/add-user', objectData)
    .then((response) => {
      setServerDatas(response.data)
    })
    .catch((error) =>{
      console.log(error)
    })
    setAddUser(false)
  }

  function deleteFunction(id){
    axios.delete(`http://localhost:8000/add-user${id}`)
    .then((response) => {
      console.log("response", response)
      setServerDatas(response.data)
    })
    .catch((error) =>{
      console.log(error)
    })
  }

  function editFunction(e, id){
    e.preventDefault()
    axios.patch(`http://localhost:8000/add-user${id}`, {...objectData, id : Date.now()})
    .then((response) => {
      console.log("response", response)
      setServerDatas(response.data)
      setAddUser(false)
      setEdit(false)
      setObjectData({ name: "", place: "", number: "" })
    })
    .catch((error) =>{
      console.log(error)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="font-semibold text-2xl text-center mb-6">CRUD Operations</h2>

    <div className='flex gap-98 py-2.5'>
      <div>
        <input type='text' onChange={filteringData} placeholder='Filter the Data...' className=' border rounded border-gray-500 border-r-2 outline-0 '/>
      </div>
      <div>
        <button className='bg-green-500 p-2 rounded' onClick={() => setAddUser(true)}>Add Users</button>
      </div>
    </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Place</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serverDatas.map((user, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.place}</td>
                <td className="border border-gray-300 px-4 py-2">{user.number}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600" onClick={() => { setAddUser(true),setEdit(true), setUserId(user.id)}}>Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onClick={() => deleteFunction(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addUser && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
          <div className="relative bg-white border p-6 rounded-2xl shadow-lg w-80">
            <button
              onClick={() =>{ setAddUser(false) ;setEdit(false)}}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md"
            >
              X
            </button>
            <form className="space-y-4" onSubmit={(e) => edit ? editFunction(e, userId) : userSubmit(e)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  onChange={addUserData}
                  name='name'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  onChange={addUserData}
                  name='number'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Place</label>
                <input
                  type="text"
                  placeholder="Enter place name"
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  onChange={addUserData}
                  name='place'
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App