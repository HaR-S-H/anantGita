import { createContext, useContext, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner"
import { getAllChapters } from "@/services/api/chapters";
import { getChapter } from "@/services/api/chapters";
const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalVerses, setTotalVerses] = useState(0);
//   const [verses, setVerses] = useState([]);
    const fetchChapters = async () => {
    try {
    const response = await getAllChapters();
        setChapters(response.data.chapters);
    } catch {
    } finally {
      setLoading(false);
    }
    };
    const fetchChapter = async () => {
        try {
        const response = await getChapter(1,setChapter,setLoading,setTotalVerses);
        } catch {
        } finally {
          setLoading(false);
        }
        };

  useEffect(() => {
    fetchChapter();
    fetchChapters();
  }, []);


  return (
    <StudyContext.Provider value={{ chapter,chapters,setChapter,setChapters,loading,setLoading,totalVerses,setTotalVerses}}>
      {children}
      <Toaster />

    </StudyContext.Provider>
  );
};

export const useStudy = () => {
    return useContext(StudyContext);
  };
