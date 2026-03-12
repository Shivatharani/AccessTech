import {Link} from "react-router-dom";

export default function Navbar(){

 return(
  <div className="flex justify-between items-center bg-black text-white px-6 py-4">

   <h1 className="text-xl font-bold">
    AccessTech
   </h1>

   <div className="space-x-6">

    <Link to="/tutor">Tutor</Link>

    <Link to="/dashboard">Dashboard</Link>

    <Link to="/quiz">Quiz</Link>

   </div>

  </div>
 )

}