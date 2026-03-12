import {useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import QuizCard from "../components/QuizCard";

export default function Tutor(){

 const [topic,setTopic]=useState("")
 const [response,setResponse]=useState("")
 const [quiz,setQuiz]=useState("")

 const askAI=async()=>{

  const email=localStorage.getItem("email")

  const res=await API.post("/ai/ask",{
   email,
   topic
  })

  setResponse(res.data.response)
  setQuiz(res.data.quiz)

 }

 return(

  <div>

   <Navbar/>

   <div className="p-10">

    <h1 className="text-2xl font-bold mb-6">
     AI Tutor
    </h1>

    <input
     className="border p-3 rounded w-[300px]"
     placeholder="Enter topic"
     onChange={e=>setTopic(e.target.value)}
    />

    <button
     onClick={askAI}
     className="bg-blue-600 text-white px-6 py-3 ml-3 rounded"
    >
     Ask AI
    </button>

    <div className="mt-8 bg-white p-6 rounded-xl shadow">

     <h2 className="font-bold text-lg mb-2">
      Explanation
     </h2>

     <pre>{response}</pre>

    </div>

    <div className="mt-6">
     <QuizCard quiz={quiz}/>
    </div>

   </div>

  </div>

 )

}