import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';
import LoadingIndicator from '@/components/LoadingIndicator';
import SidebarStudy from '@/components/SidebarStudy';
import WordMeanings from '@/components/WordMeanings';
import VerseContent from '@/components/VerseContent';
import VerseNavigation from '@/components/VerseNavigation';
import Header from '@/components/Header';
import ChapterSelector from '@/components/ChapterSelector';
import AudioPlayer from '@/components/AudioPlayer';
import VideoPlayer from '@/components/VideoPlayer';
import { getChapter } from '@/services/api/chapters';

const StudyPage = () => {
  const { chapterNumber = 1, verseNumber = 1 } = useParams();
  const navigate = useNavigate();
  const { chapter, chapters, loading, setLoading, setChapter,totalVerses,setTotalVerses } = useStudy();
  const [showSidebar, setShowSidebar] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState('english'); // sanskrit, english, hindi
  // const [totalVerses, setTotalVerses] = useState(0);
  // const [currVerse,setCurrVerse]=useState(-1);
  // console.log(chapter);
  
  const verse = chapter.verses[verseNumber - 1];
  
  const navigateToVerse = async (chapterNum, verseNum) => {
    // setCurrVerse(verseNum);
    const response = await getChapter(chapterNum, setChapter, setLoading,setTotalVerses);
    // setTotalVerses(response.data.chapter.totalVerses);
    navigate(`/study/chapter/${chapterNum}/verse/${verseNum}`);
  };
  const fetchChapter = async() => {
    try {
      await getChapter(chapterNumber, setChapter, setLoading,setTotalVerses);
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    fetchChapter();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.paleBeige }}>
      <div className="flex flex-1 relative">
        <main className="flex-1 sm:px-2 md:px-4 lg:px-6 sm:py-4 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            
            {/* Chapter Selector (Full width on small, 1/3 width on large) */}
            <div className="md:col-span-1">
              <ChapterSelector 
                currentChapter={parseInt(chapterNumber)} 
                onSelectChapter={(chapterNum) => navigateToVerse(chapterNum, 1)} 
              />
            </div>

            {/* Verse Content (Takes more space on medium and large screens) */}
            <div className="md:col-span-1 lg:col-span-2 sm:space-y-6">
            <VerseContent 
                verse={verse} 
                chapterName={chapter?.name?.english} 
                chapterId={chapter?._id}
                chapterNumber={parseInt(chapterNumber)}
                displayLanguage={displayLanguage}
                setDisplayLanguage={setDisplayLanguage}
                toggleSidebar={toggleSidebar}
                totalVerses={totalVerses}
                currVerse={verseNumber}
              />

              <VerseNavigation 
                totalVerses={chapter?.totalVerses || 0} 
                currentVerse={parseInt(verseNumber)} 
                chapterNumber={parseInt(chapterNumber)} 
                onNavigate={navigateToVerse} 
              />

              {/* Media Players Section */}
              <div className="flex flex-col sm:flex-row sm:gap-4 sm:border-none border-b sm:border">
  {verse?.audioUrl && (
    <div className="w-full">
      <AudioPlayer audioUrl={verse.audioUrl} />
    </div>
  )}
  {verse?.videoUrl && (
    <div className="flex justify-center items-center sm:w-1/3 lg:w-1/4 border sm:border-none sm:bg-transparent bg-[#FFFBF2] pb-5 pt-5 sm:p-0">
      <VideoPlayer videoUrl={verse.videoUrl} />
    </div>
  )}
</div>

              {verse?.wordMeanings?.length > 0 && (
                <WordMeanings 
                  wordMeanings={verse.wordMeanings} 
                  displayLanguage={displayLanguage === 'hindi' ? 'hindi' : 'english'} 
                />
              )}
            </div>
          </div>
        </main>

        {/* Sidebar Overlay for Small Screens */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden`} onClick={toggleSidebar}></div>

        <SidebarStudy
          isOpen={showSidebar} 
          onClose={toggleSidebar}
          chapterNumber={parseInt(chapterNumber)}
          totalVerses={chapter?.totalVerses || 0}
          currentVerse={parseInt(verseNumber)}
          onNavigate={navigateToVerse}
          className="md:static md:flex"
        />
      </div>
    </div>
  );
};

export default StudyPage;