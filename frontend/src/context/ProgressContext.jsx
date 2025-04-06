import { createContext, useContext, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner"
const ProgressContext = createContext();
import { getProgress } from "@/services/api/progress";
export const ProgressProvider = ({ children }) => {
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [lastAccessedAt, setLastAccessedAt] = useState();
  const [lastStudiedVerse, setLastStudiedVerse] = useState(null);
    const [timeSpent, setTimeSpent] = useState(0);
    const [allVerses,setAllVerses]=useState([]);
  const [loading, setLoading] = useState(true);
    const [comprehensionScore, setComprehensionScore] = useState(0);
 const fetchProgress = async () => {
    try {
    const response = await getProgress(setChapters,setComprehensionScore,setVerses,setLastAccessedAt,setLastStudiedVerse,setLoading,setTimeSpent);
    } catch {
    } finally {
      setLoading(false);
    }
    };
    // const allverses = async () => {
    //     try {
    //         const response = await getAllVerses(setAllVerses);
    //     } catch (error) {
            
    //     }
    // }
  useEffect(() => {
    fetchProgress();
    // allverses();
  }, []);


  return (
    <ProgressContext.Provider value={{setAllVerses,allVerses,chapters,setChapters,loading,setLoading,verses,comprehensionScore,setComprehensionScore,setVerses,lastStudiedVerse,lastAccessedAt, setLastAccessedAt,setLastStudiedVerse,timeSpent,setTimeSpent}}>
      {children}
      <Toaster />

    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
    return useContext(ProgressContext);
  };
