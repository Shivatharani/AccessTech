import {createContext,useState} from "react";

export const LanguageContext=createContext();

export const LanguageProvider=({children})=>{

 const [language,setLanguage]=useState("English");

 return(
  <LanguageContext.Provider value={{language,setLanguage}}>
   {children}
  </LanguageContext.Provider>
 )

}