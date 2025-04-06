import api from "./index"; 
export const getQuizez = async (chapterIds) => {
 try {
  const response = await api.post("/quiz",{chapterIds});
   return response.data.data;
 } catch (error) {
   //  console.log(error);
 }
};
export const submitQuiz = async (answers, quizId) => {
    try {
        const response = await api.post("/quiz/submit",{answers,quizId});
         return response.data.data;
       } catch (error) {
         //  console.log(error);
       }
};
export const getQuizHistory= async () => {
    try {
        const response = await api.get("/quizHistory");
         return response.data.data;
       } catch (error) {
         //  console.log(error);
       }
};
