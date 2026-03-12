import {useState} from "react";
import API from "../services/api";
import {showToast} from "../hooks/useToast";

export default function Quiz(){

 const [score,setScore]=useState(0)

 const submit=async()=>{

  const email=localStorage.getItem("email")

  await API.post("/ai/submit-quiz",{
   email,
   topic:"AI",
   score
  })

  showToast("Quiz submitted")

 }

 return(
  <div className="p-10">

   <h1>Quiz</h1>

   <input
    type="number"
    onChange={e=>setScore(e.target.value)}
   />

   <button onClick={submit}
   className="bg-purple-500 text-white px-4 py-2 ml-2">

   Submit

   </button>

  </div>
 )

}