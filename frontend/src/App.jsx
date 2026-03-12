import {BrowserRouter,Routes,Route} from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Tutor from "./pages/Tutor"
import Dashboard from "./pages/Dashboard"
import Quiz from "./pages/Quiz"

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route path="/" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/tutor" element={<Tutor/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/quiz" element={<Quiz/>}/>

   </Routes>

  </BrowserRouter>

 )

}

export default App