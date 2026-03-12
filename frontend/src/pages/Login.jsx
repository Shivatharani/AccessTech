import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"

import { GoogleLogin } from "@react-oauth/google"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {

 const nav = useNavigate()

 const [showPassword,setShowPassword] = useState(false)

 const [form,setForm] = useState({
  email:"",
  password:""
 })

 const login = async () => {

  const res = await API.post("/auth/login",form)

  localStorage.setItem("token",res.data.access_token)
  localStorage.setItem("email",form.email)

  nav("/tutor")

 }

 const handleGoogle = async (credentialResponse) => {

  const res = await API.post("/auth/google-login",{
   token:credentialResponse.credential
  })

  localStorage.setItem("token",res.data.access_token)

  nav("/tutor")

 }

 return(

 <div className="h-screen flex items-center justify-center bg-gray-50">

  <div className="bg-white shadow-xl rounded-2xl p-10 w-[400px]">

   <h2 className="text-2xl font-bold mb-6 text-center">
    Welcome Back
   </h2>

   <input
   className="border p-3 rounded w-full mb-4"
   placeholder="Email"
   onChange={(e)=>setForm({...form,email:e.target.value})}
   />

   <div className="relative">

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

   <button
   onClick={login}
   className="bg-blue-600 text-white w-full py-3 rounded mt-4"
   >
   Login
   </button>

   <div className="mt-4 flex justify-center">
    <GoogleLogin
     onSuccess={handleGoogle}
     onError={()=>alert("Google login failed")}
    />
   </div>

   <p className="text-center mt-4">

   Don't have an account?

   <Link
   to="/signup"
   className="text-blue-600 ml-1"
   >
   Signup
   </Link>

   </p>

  </div>

 </div>

 )

}