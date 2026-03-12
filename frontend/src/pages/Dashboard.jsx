import {useEffect,useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {BarChart,Bar,XAxis,YAxis,Tooltip} from "recharts";

export default function Dashboard(){

 const [data,setData]=useState([])

 useEffect(()=>{

  const email=localStorage.getItem("email")

  API.get(`/dashboard/analytics?email=${email}`)
  .then(res=>{

   setData([
    {name:"Questions",value:res.data.total_questions},
    {name:"Logins",value:res.data.total_logins},
    {name:"Quiz Avg",value:res.data.avg_quiz_score}
   ])

  })

 },[])

 return(

  <div>

   <Navbar/>

   <div className="p-10">

    <h1 className="text-2xl font-bold mb-6">
     Dashboard
    </h1>

    <BarChart width={500} height={300} data={data}>
     <XAxis dataKey="name"/>
     <YAxis/>
     <Tooltip/>
     <Bar dataKey="value"/>
    </BarChart>

   </div>

  </div>

 )

}