import api from "./index"; 
import { toast } from "sonner";
export const getAllChapters = async () => {
  try {
    const response = await api.get("/chapters");    
    return response.data;
  } catch (error) {
    // toast.error(error.response?.data?.message);
    // console.error(error);
    // throw error;
  }
};
export const getChapter = async (chapterNum, setChapter, setLoading,setTotalVerses) => {
  try {
    setLoading(true);
    const response = await api.get(`/chapters/${chapterNum}`);
    // console.log(response.data);
    setChapter(response?.data.data.chapter);
    setTotalVerses(response?.data.data.chapter.totalVerses);
    setLoading(false);
     return response?.data;
  } catch (error) {
    // toast.error(error.response?.data?.message);
    setLoading(false);
    // console.error(error);
    // throw error;
  }
};
