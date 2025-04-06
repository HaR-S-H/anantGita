import api from "./index"; 
export const getHistory = async () => {
 try {
     const response = await api.get("/rag");
   //   console.log(response.data);
      return response.data.data;
 } catch (error) {
   //  console.log(error);
 }
};
export const createQuery = async (query) => {
 try {
  const response = await api.post("/rag",{query});
     return response.data.data;
   //  console.log(response.data);
    
 } catch (error) {
   //  console.log(error);
 }
};