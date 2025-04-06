import api from "./index"; 
export const getProgress = async (setChapters, setComprehensionScore, setVerses, setLastAccessedAt, setLastStudiedVerse, setLoading, setTimeSpent) => {
  
  try {
    
    
    setLoading(true);
    const response = await api.get("/progress");
    // console.log(response.data);
    setChapters(response.data.data.progress.chaptersCompleted);
    setVerses(response.data.data.progress.versesCompleted);
    setLastStudiedVerse(response.data.data.progress.lastStudiedVerse);
    setLastAccessedAt(response.data.data.progress.lastAccessedAt);
    setTimeSpent(response.data.data.progress.timeSpent);
    
    setComprehensionScore(response.data.data.progress.comprehensionScore)
    // setComprehensionScore(response.data.data.progress.timeSpent)
    setLoading(false);
     return response.data;
  } catch (error) {
    setLoading(false);
    console.error(error);
    // throw error;
  }
};
export const updateProgress = async (verseId) => {
  try {
    // setLoading(true);
    const response = await api.post("/progress", {verseId});
    // console.log(response.data);
    // setLoading(false);
     return response.data;
  } catch (error) {
    // setLoading(false);
    // console.error(error);
    // throw error;
  }
};
export const updateProgressWithChapter = async (chapterId) => {
  try {
    // setLoading(true);
    const response = await api.post("/progress", {chapterId});
    // console.log(response.data);
    // setLoading(false);
     return response.data;
  } catch (error) {
    // setLoading(false);
    // console.error(error);
    // throw error;
  }
};
export const deleteProgress = async () => {
  try {
    setLoading(true);
    const response = await api.delete("/progress");
    // console.log(response.data);
    setLoading(false);
     return response.data;
  } catch (error) {
    setLoading(false);
    // console.error(error);
    // throw error;
  }
};
export const updateTime = async ({ timeSpent }) => {
  try {
    // console.log(timeSpent);
    const response = await api.post("/progress", {timeSpent});
    // console.log(response.data);
     return response.data;
  } catch (error) {
    // console.error(error);
    // throw error;
  }
};
