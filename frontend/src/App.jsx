import {BrowserRouter,Routes,Route} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Tutor from "./pages/Tutor"
import Dashboard from "./pages/Dashboard"
import Quiz from "./pages/Quiz"
import { Toaster } from "@/components/ui/sonner"

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/tutor" element={<Tutor/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/quiz" element={<Quiz/>}/>

   </Routes>

   <Toaster position="bottom-right" richColors />

  </BrowserRouter>

 )

}

export default App