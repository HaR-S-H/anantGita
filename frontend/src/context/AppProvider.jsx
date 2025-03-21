import { AuthProvider } from "./AuthContext";
import { StudyProvider } from "./StudyContext";
import { ProgressProvider } from "./ProgressContext";
import { NoteProvider } from "./NoteContext";
const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <StudyProvider>
        <ProgressProvider>
          <NoteProvider>
      {/* Wrap other providers if needed */}
            {children}
            </NoteProvider>
          </ProgressProvider>
        </StudyProvider>
    </AuthProvider>
  );
};

export default AppProvider;
