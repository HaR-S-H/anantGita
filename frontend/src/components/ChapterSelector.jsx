import React from 'react';
import { useStudy } from '@/context/StudyContext';
import colors from '@/constants/colors';

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ChapterSelector = ({ currentChapter, onSelectChapter }) => {
  const { chapters, loading } = useStudy();

  if (loading) {
    return (
      <Card className="shadow-lg h-full md:h-[80vh] w-full" style={{ backgroundColor: colors.offWhite }}>
        <CardHeader className="py-2">
          <CardTitle className="text-base md:text-xl" style={{ color: colors.darkRed }}>
            Chapters
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full p-2">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-1">
              {[...Array(18)].map((_, i) => (
                <Skeleton key={i} className="h-8 md:h-12 w-full rounded-lg" />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg h-[40vh] md:h-[80vh] w-full flex flex-col rounded-none" style={{ backgroundColor: colors.offWhite }}>
      <CardHeader className="py-2 md:pb-3">
        <CardTitle className="text-base md:text-xl" style={{ color: colors.darkRed }}>
          Chapters
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full w-full pr-2">
          <div className="space-y-1 px-2">
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <Button
                  key={chapter.number}
                  onClick={() => onSelectChapter(chapter.number)}
                  variant="ghost"
                  className="w-full justify-between h-auto py-1 md:py-3 px-2 md:px-4 rounded-lg flex items-center text-xs md:text-sm"
                  style={{
                    backgroundColor: currentChapter === chapter.number ? colors.lightBeige : 'transparent',
                    borderLeft: `4px solid ${currentChapter === chapter.number ? colors.primaryRed : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center text-left flex-1 min-w-0">
                    <span className="font-medium shrink-0" style={{ color: colors.deeperRed }}>
                      {chapter.number}.
                    </span>
                    <span className="ml-1 truncate" style={{ color: '#634B2A' }}>
                      {chapter.name.english}
                    </span>
                  </div>
                  <Badge
  variant="outline"
  className="shrink-0"
  style={{ backgroundColor: colors.warmBeige, color: colors.deeperRed }}
>
  <span className="hidden sm:inline">{chapter.totalVerses} verses</span>
  <span className="sm:hidden">{chapter.totalVerses}</span>
</Badge>
                </Button>
              ))
            ) : (
              // Fallback if API doesn't return chapters
              Array.from({ length: 18 }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => onSelectChapter(i + 1)}
                  variant="ghost"
                  className="w-full justify-between h-auto py-1 md:py-3 px-2 md:px-4 rounded-lg text-left flex items-center text-xs md:text-sm"
                  style={{
                    backgroundColor: currentChapter === i + 1 ? colors.lightBeige : 'transparent',
                    borderLeft: `4px solid ${currentChapter === i + 1 ? colors.primaryRed : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="font-medium shrink-0" style={{ color: colors.deeperRed }}>
                      {i + 1}.
                    </span>
                    <span className="ml-1 truncate" style={{ color: '#634B2A' }}>
                      Chapter {i + 1}
                    </span>
                  </div>
                  <Badge
  variant="outline"
  className="shrink-0"
  style={{ backgroundColor: colors.warmBeige, color: colors.deeperRed }}
>
  <span className="hidden sm:inline">{Math.floor(Math.random() * 50) + 10} verses</span>
  <span className="sm:hidden">{Math.floor(Math.random() * 50) + 10}</span>
</Badge>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChapterSelector;