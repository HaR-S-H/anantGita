import React, { useEffect } from 'react';
import colors from '@/constants/colors';
import { Menu, BookOpen, BookCheck, FileEdit } from 'lucide-react';
import { getProgress, updateProgress, updateProgressWithChapter } from '@/services/api/progress';
// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProgress } from '@/context/ProgressContext';
import { addNote, getNote, getNoteById } from '@/services/api/notes';
import { useNote } from '@/context/NoteContext';

const VerseContent = ({ 
  verse, 
  chapterName = '', 
  chapterNumber, 
  chapterId,
  displayLanguage, 
  setDisplayLanguage,
  toggleSidebar,
  totalVerses,
  currVerse
}) => {
  // Add state for tracking read status
  const { chapters, verses, setChapters, setVerses, setLastStudiedVerse,setLastAccessedAt,setComprehensionScore, setLoading, setTimeSpent } = useProgress();
  const { notes, setNotes } = useNote();
  const [verseRead, setVerseRead] = React.useState(verses.includes(verse._id));
  const [chapterRead, setChapterRead] = React.useState(chapters.includes(chapterId));
  // State for notes
  const [noteText, setNoteText] = React.useState("");
  const [noteDialogOpen, setNoteDialogOpen] = React.useState(false);
  const [savedNotes, setSavedNotes] = React.useState([]);
  
  // Check if this is the last verse in the chapter
  const isLastVerse = currVerse == totalVerses;

  const handleMarkVerseRead = async () => {  
    setVerseRead(!verseRead);
    
    // Here you would add logic to store this in your actual state management
    try {
      await updateProgress(verse._id);

      
      // Try calling getProgress without await to see if it's a timing issue
      getProgress(setChapters, 
        setComprehensionScore, 
        setVerses, 
        setLastAccessedAt,
        setLastStudiedVerse, 
        setLoading, 
        setTimeSpent)
    } catch (error) {
      console.error("Error in click handler:", error);
    }
  };

  const fetchNote = async () => { 
    try {
      const note = await getNoteById(verse._id);
      setNoteText(note?.note);
    } catch (error) {
      setNoteText('');
      // console.log(error);
    }
  }

  useEffect(() => {
    fetchNote();
  }, [verse._id]);

  const handleMarkChapterRead = async() => {
    setChapterRead(!chapterRead);
    // Here you would add logic to store this in your actual state management
    try {
      await updateProgressWithChapter(chapterId);
      await getProgress(setChapters, setVerses, setLastStudiedVerse, setLoading, setTimeSpent);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleAddNote = async () => {
    try {
      if (noteText.trim()) {
        // In a real app, you would save this to your backend
        const response = await addNote(verse._id, noteText);
        setNoteText(response.note);
        setNoteDialogOpen(false);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  if (!verse) {
    return (
      <Card className="shadow-lg  min-h-[60vh] md:h-[60vh] rounded-none" style={{ backgroundColor: colors.offWhite }}>
        <CardContent className="text-center py-6 flex items-center justify-center h-full">
          <p style={{ color: '#634B2A' }}>Select a verse to begin studying</p>
        </CardContent>
      </Card>
    );
  }

  const getDisplayText = () => {
    if (displayLanguage === 'sanskrit') {
      return verse.text.sanskrit;
    } else if (displayLanguage === 'hindi') {
      return verse.text.hindi;
    } else {
      return verse.text.english;
    }
  };

  const getTextDirection = () => {
    return displayLanguage === 'sanskrit' ? 'rtl' : 'ltr';
  };

  const getFontClass = () => {
    if (displayLanguage === 'sanskrit') {
      return 'font-sanskrit text-base md:text-xl';
    } else if (displayLanguage === 'hindi') {
      return 'font-hindi text-base md:text-lg';
    } else {
      return 'font-serif text-base md:text-lg';
    }
  };

  const handleClick = async () => {
    const response = await getNoteById(verse._id);
    setNoteText(response.note);
  }

  return (
    <Card className="shadow-lg  min-h-[60vh] md:h-[60vh] flex flex-col rounded-none" style={{ backgroundColor: colors.offWhite }}>
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:mb-2 gap-2">
          <CardTitle className="text-lg md:text-xl" style={{ color: colors.darkRed }}>
            {chapterName || `Chapter ${chapterNumber}`}
          </CardTitle>
          
          {/* Read buttons, Language Select, and Menu on top right */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Add Note button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        style={{
                          backgroundColor: colors.lightBeige,
                          color: colors.deeperRed,
                          borderColor: colors.deeperRed
                        }}
                        onClick={()=>{handleClick()}}
                      >
                        <FileEdit size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[90vw]" style={{ backgroundColor: colors.offWhite }}>
                      <DialogHeader>
                        <DialogTitle style={{ color: colors.darkRed }}>Add Note</DialogTitle>
                        <DialogDescription style={{ color: '#634B2A' }}>
                          Add your personal notes for Chapter {chapterNumber}, Verse {verse.verseNumber}.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Write your thoughts, insights, or questions about this verse..."
                        className="min-h-[150px] mt-2"
                        style={{ 
                          backgroundColor: colors.lightBeige,
                          borderColor: colors.deeperRed,
                          color: '#634B2A'
                        }}
                      />
                      <DialogFooter className="mt-4">
                        <Button 
                          type="submit" 
                          onClick={handleAddNote}
                          style={{
                            backgroundColor: colors.deeperRed,
                            color: colors.lightBeige
                          }}
                        >
                          Save Note
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Note</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Mark Verse Read button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleMarkVerseRead}
                    size="sm"
                    variant={verseRead ? "default" : "outline"}
                    className="h-8 w-8 p-0"
                    style={{
                      backgroundColor: verseRead ? colors.deeperRed : colors.lightBeige,
                      color: verseRead ? colors.lightBeige : colors.deeperRed,
                      borderColor: colors.deeperRed
                    }}
                  >
                    <BookOpen size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{verseRead ? "Mark Verse as Unread" : "Mark Verse as Read"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Mark Chapter Read button - only on last verse */}
            {isLastVerse && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleMarkChapterRead}
                      size="sm"
                      variant={chapterRead ? "default" : "outline"}
                      className="h-8 w-8 p-0"
                      style={{
                        backgroundColor: chapterRead ? colors.deeperRed : colors.lightBeige,
                        color: chapterRead ? colors.lightBeige : colors.deeperRed,
                        borderColor: colors.deeperRed
                      }}
                    >
                      <BookCheck size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{chapterRead ? "Mark Chapter as Unread" : "Mark Chapter as Read"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Select value={displayLanguage} onValueChange={setDisplayLanguage}>
              <SelectTrigger className="w-24 h-8 text-sm" style={{ 
                backgroundColor: colors.lightBeige, 
                color: colors.deeperRed,
                borderColor: colors.deeperRed 
              }}>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sanskrit">Sanskrit</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={toggleSidebar}
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-1"
              style={{ 
                backgroundColor: colors.lightBeige, 
                color: colors.deeperRed,
                borderColor: colors.deeperRed 
              }}
            >
              <Menu size={14} />
              <span className="text-sm hidden sm:inline">Menu</span>
            </Button>
          </div>
        </div>
        
        <CardDescription className="flex flex-wrap items-center gap-2">
          <span style={{ color: '#634B2A' }}>
            Chapter {chapterNumber}, Verse {verse.verseNumber}
          </span>
          {verse.speaker && (
            <Badge variant="outline" style={{ backgroundColor: colors.lightBeige, color: colors.deeperRed }}>
              Speaker: {verse.speaker}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>

      <Separator className="flex-shrink-0" style={{ backgroundColor: colors.lightBeige }} />

      {/* Scrollable Area */}
      <ScrollArea className="flex-1 px-3 sm:px-6 py-4 min-h-0 max-h-full md:max-h-[calc(60vh-100px)]">
        <div className="pb-6">
          <Card className="mb-4 max-h-[200px] overflow-auto" style={{ backgroundColor: colors.lightBeige }}>
            <CardContent className={`p-3 sm:p-6 ${getFontClass()} overflow-hidden break-words`} style={{ 
              color: colors.deeperRed, 
              direction: getTextDirection(),
              lineHeight: 1.8
            }}>
              {getDisplayText()}
            </CardContent>
          </Card>

          {/* Show alternative translations if the main display isn't English */}
          {displayLanguage !== 'english' && (
            <Card className="mt-4 max-h-[200px] overflow-auto" variant="outline" style={{ borderColor: colors.lightBeige }}>
              <CardHeader className="pb-0 px-3 sm:px-6">
                <CardTitle className="text-sm" style={{ color: colors.darkRed }}>
                  English Translation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-3 sm:px-6">
                <p className="text-sm sm:text-base break-words" style={{ color: '#634B2A' }}>
                  {verse.text.english}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Show alternative translations if the main display isn't Hindi */}
          {displayLanguage !== 'hindi' && verse.text.hindi && (
            <Card className="mt-4 max-h-[200px] overflow-auto" variant="outline" style={{ borderColor: colors.lightBeige }}>
              <CardHeader className="pb-0 px-3 sm:px-6">
                <CardTitle className="text-sm" style={{ color: colors.darkRed }}>
                  Hindi Translation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-3 sm:px-6">
                <p className="text-sm sm:text-base font-hindi break-words" style={{ color: '#634B2A' }}>
                  {verse.text.hindi}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Display saved notes if there are any */}
          {savedNotes.length > 0 && (
            <Card className="mt-4" variant="outline" style={{ borderColor: colors.lightBeige }}>
              <CardHeader className="pb-0 px-3 sm:px-6">
                <CardTitle className="text-sm" style={{ color: colors.darkRed }}>
                  Your Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-3 sm:px-6">
                {savedNotes
                  .filter(note => note.verseId === verse._id)
                  .map(note => (
                    <div key={note.id} className="mb-2 p-2 rounded" style={{ backgroundColor: colors.lightBeige }}>
                      <p className="text-xs sm:text-sm break-words" style={{ color: '#634B2A' }}>
                        {note.text}
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.deeperRed }}>
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
</div>
))}
</CardContent>
</Card>
)}
</div>
</ScrollArea>
</Card>
);
};

export default VerseContent;