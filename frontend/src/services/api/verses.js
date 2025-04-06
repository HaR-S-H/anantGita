import api from "./index"; 
// export const getAllVerses = async (setAllVerses) => {
//  try {
//    const response = await api.get("/verses");
//    setAllVerses(response.data.data.verses);
//    return response.data;
//  } catch (error) {
//     console.log(error);
//  }
// };
export const getVerse = async (verseId) => {
  try {

  
   const response = await api.get(`/verses/${verseId}`);
  //  console.log(response.data);
  return response.data.data.verse;
 } catch (error) {
  // console.log(error);
  
 }
};
