import {BrowserRouter,Routes,Route} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Tutor from "./pages/Tutor"
import Mentor from "./pages/Mentor"
import Dictionary from "./pages/Dictionary"
import CodeHelper from "./pages/CodeHelper"
import Dashboard from "./pages/Dashboard"
import Quiz from "./pages/Quiz"
import { Toaster } from "@/components/ui/sonner"
import AccessibilityPanel from "./components/AccessibilityPanel";

function App(){

 return(

  <BrowserRouter>
   <AccessibilityPanel />


   <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/tutor" element={<Tutor/>}/>
    <Route path="/mentor" element={<Mentor/>}/>
    <Route path="/dictionary" element={<Dictionary/>}/>
    <Route path="/codehelper" element={<CodeHelper/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/quiz" element={<Quiz/>}/>

   </Routes>

   <Toaster position="bottom-right" richColors />

  </BrowserRouter>

 )

}

export default App