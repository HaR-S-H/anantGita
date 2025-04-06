import api from "./index"; 
export const getNote = async (setNotes,setLoading) => {
  try {
    setLoading(true);
    const response = await api.get("/notes");
    // console.log(response.data);
    setNotes(response?.data?.data?.Notes);
    setLoading(false);
     return response.data;
  } catch (error) {
    setLoading(false);
    // console.error(error);
    // throw error;
  }
};
export const updateNote = async (noteId) => {
  try {
    // setLoading(true);
    const response = await api.put(`/notes${noteId}`);
    // console.log(response.data);
    // setLoading(false);
     return response.data;
  } catch (error) {
    // setLoading(false);
    // console.error(error);
    // throw error;
  }
};
export const addNote = async (verseId,note) => {
  try {
      // setLoading(true);      
    const response = await api.post("/notes",{verseId,note});
    // console.log(response.data);
    // setLoading(false);
     return response.data.data.note;
  } catch (error) {
    // setLoading(false);
    // console.error(error);
    // throw error;
  }
};
export const getNoteById=async(verseId) => {
    try {
        // setLoading(true);     
        
      const response = await api.post("/notes/verse",{verseId});
      // console.log(response.data);
      // setLoading(false);
       return response.data.data.note;
    } catch (error) {
        // setLoading(false);
        setNoteText('')
      // console.error(error);
      // throw error;
    }
  };