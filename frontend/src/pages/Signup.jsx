import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { Eye,EyeOff } from "lucide-react"

export default function Signup(){

 const nav = useNavigate()

 const [showPassword,setShowPassword] = useState(false)
 const [showConfirm,setShowConfirm] = useState(false)

 const [form,setForm] = useState({
  name:"",
  email:"",
  password:"",
  confirm_password:"",
  language:"English",
  level:"Beginner"
 })

 const signup = async()=>{

  await API.post("/auth/signup",form)

  alert("Signup successful")

  nav("/")

 }

 return(

 <div className="h-screen flex items-center justify-center bg-gray-50">

 <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px]">

 <h2 className="text-2xl font-bold mb-6 text-center">
 Create Account
 </h2>

 <input
 className="border p-3 rounded w-full mb-3"
 placeholder="Name"
 onChange={(e)=>setForm({...form,name:e.target.value})}
 />

 <input
 className="border p-3 rounded w-full mb-3"
 placeholder="Email"
 onChange={(e)=>setForm({...form,email:e.target.value})}
 />

 <div className="relative mb-3">

 <input
 type={showPassword ? "text":"password"}
 className="border p-3 rounded w-full"
 placeholder="Password"
 onChange={(e)=>setForm({...form,password:e.target.value})}
 />

 <button
 className="absolute right-3 top-3"
 onClick={()=>setShowPassword(!showPassword)}
 >
 {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
 </button>

 </div>

 <div className="relative mb-3">

 <input
 type={showConfirm ? "text":"password"}
 className="border p-3 rounded w-full"
 placeholder="Confirm Password"
 onChange={(e)=>setForm({...form,confirm_password:e.target.value})}
 />

 <button
 className="absolute right-3 top-3"
 onClick={()=>setShowConfirm(!showConfirm)}
 >
 {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
 </button>

 </div>

 <select
 className="border p-3 rounded w-full mb-3"
 onChange={(e)=>setForm({...form,language:e.target.value})}
 >
 <option>English</option>
 <option>Tamil</option>
 <option>Hindi</option>
 </select>

 <select
 className="border p-3 rounded w-full mb-4"
 onChange={(e)=>setForm({...form,level:e.target.value})}
 >
 <option>Beginner</option>
 <option>Intermediate</option>
 <option>Advanced</option>
 </select>

 <button
 onClick={signup}
 className="bg-green-600 text-white w-full py-3 rounded"
 >
 Signup
 </button>

 <p className="text-center mt-4">

 Already have account?

 <Link
 to="/"
 className="text-blue-600 ml-1"
 >
 Login
 </Link>

 </p>

 </div>

 </div>

 )

}