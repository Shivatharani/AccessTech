export default function QuizCard({quiz}){

 if(!quiz) return null

 return(

  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
 
   <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
    Quiz Time!
   </h2>
 
   <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
    {quiz}
   </div>
 
  </div>

 )

}