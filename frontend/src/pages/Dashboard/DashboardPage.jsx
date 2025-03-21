import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, BookOpen, CheckCircle, Award, Calendar as CalendarIcon, BarChart } from 'lucide-react';
import colors from '@/constants/colors';
import { useProgress } from '@/context/ProgressContext';
import { useStudy } from '@/context/StudyContext';
import { useNavigate } from 'react-router-dom';
import { getVerse } from '@/services/api/verses';
import LoadingIndicator from '@/components/LoadingIndicator';

// Sample activity data for charts
const activityData = [
  { day: 'Sun', minutes: 15 },
  { day: 'Mon', minutes: 30 },
  { day: 'Tue', minutes: 45 },
  { day: 'Wed', minutes: 20 },
  { day: 'Thu', minutes: 35 },
  { day: 'Fri', minutes: 25 },
  { day: 'Sat', minutes: 50 },
];

const DashboardPage = () => {
  const progressData = useProgress();
  const studyData = useStudy();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(progressData);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [lastVerse, setLastVerse] = useState(null);
  const [verseParts, setVerseParts] = useState({ before: '', after: '' });
  
  // Calculate completion percentages
  const totalChapters = 18; // Example total number of chapters
  const totalVerses = 700; // Example total number of verses
  const chapterCompletionRate = (progress.chapters.length / totalChapters) * 100;
  const verseCompletionRate = (progress.verses.length / totalVerses) * 100;

  const fetchLastVerse = async () => {
    if (!progress.lastStudiedVerse) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await getVerse(progress.lastStudiedVerse);
      setLastVerse(response);
      
      if (response && response.verseNumber) {
        const [before, after] = response.verseNumber.split('.');
        setVerseParts({ before, after });
      }
    } catch (error) {
      console.error("Error fetching last verse:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastVerse();
  }, [progress.lastStudiedVerse]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div style={{ background: colors.offWhite }} className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Summary Cards - First Row */}
          <Card style={{ borderColor: colors.lightBeige, background: colors.paleBeige }} className="h-full">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: colors.darkRed }}>
                <Clock size={18} />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2" style={{ color: colors.primaryRed }}>
                {Math.floor(progress.timeSpent / 60)}h {progress.timeSpent % 60}m
              </div>
              <p className="text-xs sm:text-sm">Total time spent studying</p>
            </CardContent>
          </Card>

          <Card style={{ borderColor: colors.lightBeige, background: colors.paleBeige }} className="h-full">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: colors.darkRed }}>
                <CheckCircle size={18} />
                Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Chapters</span>
                    <span style={{ color: colors.primaryRed }}>{progress.chapters.length}/{totalChapters}</span>
                  </div>
                  <Progress value={chapterCompletionRate} className="h-2" style={{ background: colors.warmBeige }} 
                    indicatorStyle={{ background: colors.primaryRed }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Verses</span>
                    <span style={{ color: colors.primaryRed }}>{progress.verses.length}/{totalVerses}</span>
                  </div>
                  <Progress value={verseCompletionRate} className="h-2" style={{ background: colors.warmBeige }} 
                    indicatorStyle={{ background: colors.primaryRed }} />
                </div>
              </div>
            </CardContent>  
          </Card>

          <Card style={{ borderColor: colors.lightBeige, background: colors.paleBeige }} className="h-full sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: colors.darkRed }}>
                <Award size={18} />
                Comprehension
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2" style={{ color: colors.primaryRed }}>
                {
                  progress.comprehensionScore
}%
              </div>
              <Progress value={progress.comprehensionScore} className="h-2" style={{ background: colors.warmBeige }} 
                indicatorStyle={{ background: colors.primaryRed }} />
              <p className="text-xs sm:text-sm mt-2">Based on quiz performances</p>
            </CardContent>
          </Card>

          {/* Second Row */}
          <Card className="col-span-1 sm:col-span-2 lg:col-span-2" style={{ borderColor: colors.lightBeige, background: colors.paleBeige }}>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: colors.darkRed }}>
                <BarChart size={18} />
                Activity Overview
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your study time over the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-48 sm:h-56 md:h-64 lg:h-72 p-0 sm:p-1 md:p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.lightBeige} />
                  <XAxis dataKey="day" stroke={colors.darkRed} tick={{ fontSize: 12 }} />
                  <YAxis stroke={colors.darkRed} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.paleBeige, 
                      borderColor: colors.lightBeige 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke={colors.primaryRed} 
                    strokeWidth={2} 
                    dot={{ fill: colors.darkRed }} 
                    activeDot={{ r: 6, fill: colors.softRed }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card style={{ borderColor: colors.lightBeige, background: colors.paleBeige }} className="col-span-1">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: colors.darkRed }}>
                <CalendarIcon size={18} />
                Study Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-1 md:p-2 flex justify-center">
              <Calendar 
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                styles={{
                  head_cell: { color: colors.darkRed },
                  day_selected: { backgroundColor: colors.primaryRed },
                  day_today: { color: colors.softRed }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Last Section - Recent Activity */}
        <Card className="mt-4 sm:mt-6" style={{ borderColor: colors.lightBeige, background: colors.paleBeige }}>
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: colors.darkRed }}>
              <BookOpen size={18} />
              Last Studied
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            {lastVerse ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium">You last studied: <span style={{ color: colors.primaryRed }}>Verse {lastVerse.verseNumber}</span></p>
                  <p className="text-xs sm:text-sm mt-1">Continue your progress by picking up where you left off.</p>  
                </div>
                <button 
                  className="mt-3 sm:mt-0 px-4 sm:px-6 py-2 rounded-md text-white font-medium flex items-center justify-center text-sm"
                  style={{ backgroundColor: colors.primaryRed }}
                  onClick={() => navigate(`/study/chapter/${verseParts.before}/verse/${verseParts.after}`)}
                >
                  Continue Studying
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm">No verse studied yet. Start your journey!</p>
                <button 
                  className="mt-3 px-4 sm:px-6 py-2 rounded-md text-white font-medium text-sm"
                  style={{ backgroundColor: colors.primaryRed }}
                  onClick={() => navigate('/study')}
                >
                  Start Studying
                </button>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs sm:text-sm text-gray-500 border-t p-3 sm:p-4" style={{ borderColor: colors.lightBeige }}>
            Last accessed: {new Date(progress.lastAccessedAt).toLocaleString()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;