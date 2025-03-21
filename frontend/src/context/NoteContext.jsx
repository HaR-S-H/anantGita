import { createContext, useContext, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner"
import { getNote } from "@/services/api/notes";
const NoteContext = createContext();
export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
 const fetchNote = async () => {
    try {
        const response = await getNote(setNotes, setLoading);
    } catch {
    } finally {
      setLoading(false);
    }
    };
  useEffect(() => {
    fetchNote();
  }, []);


  return (
    <NoteContext.Provider value={{notes,setLoading,loading,setNotes}}>
      {children}
      <Toaster />

    </NoteContext.Provider>
  );
};

export const useNote = () => {
    return useContext(NoteContext);
  };
