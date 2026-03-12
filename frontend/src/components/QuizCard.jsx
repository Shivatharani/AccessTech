export default function QuizCard({quiz}){

 if(!quiz) return null

 return(

  <div className="bg-white p-6 rounded-xl shadow">

   <h2 className="text-lg font-bold mb-4">
    Quiz
   </h2>

   <pre>{quiz}</pre>

  </div>

 )

}