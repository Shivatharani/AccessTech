import {useContext} from "react";
import {LanguageContext} from "../context/LanguageContext";

export default function LanguageSelector(){

 const {language,setLanguage}=useContext(LanguageContext)

 return(
  <select
   value={language}
   onChange={(e)=>setLanguage(e.target.value)}
  >
   <option>English</option>
   <option>Tamil</option>
   <option>Hindi</option>
  </select>
 )

}