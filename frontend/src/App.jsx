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
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App(){

 return(

  <BrowserRouter>
   <AccessibilityPanel />


   <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
    <Route path="/signup" element={<PublicRoute><Signup/></PublicRoute>}/>
    <Route path="/tutor" element={<ProtectedRoute><Tutor/></ProtectedRoute>}/>
    <Route path="/mentor" element={<ProtectedRoute><Mentor/></ProtectedRoute>}/>
    <Route path="/dictionary" element={<ProtectedRoute><Dictionary/></ProtectedRoute>}/>
    <Route path="/codehelper" element={<ProtectedRoute><CodeHelper/></ProtectedRoute>}/>
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
    <Route path="/quiz" element={<ProtectedRoute><Quiz/></ProtectedRoute>}/>

   </Routes>

   <Toaster position="bottom-right" richColors />

  </BrowserRouter>

 )

}

export default App