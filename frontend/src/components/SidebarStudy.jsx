import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Bookmark, 
  PenLine, 
  Share, 
  Printer, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const SidebarStudy = ({ isOpen, onClose, chapterNumber, totalVerses, currentVerse, onNavigate }) => {
  // Generate quick jump to specific verses (in groups of 10)
  const generateQuickJumps = () => {
    const jumps = [];
    for (let i = 1; i <= totalVerses; i += 10) {
      const end = Math.min(i + 9, totalVerses);
      jumps.push({
        label: `Verses ${i}-${end}`,
        startVerse: i
      });
    }
    return jumps;
  };

  return (
    <aside 
      className={`fixed inset-y-0 right-0 w-80 shadow-2xl transition-transform transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}
      style={{ backgroundColor: colors.offWhite, height: '100vh' }}
    >
      <Card className="h-full flex flex-col rounded-none border-none">
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-white/20 h-8 w-8 bg-gray-200/50"
          >
            <X size={20} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 h-full">
          <CardContent className="p-5 space-y-6 pt-16">
            <div>
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: colors.darkRed }}>
                Jump to Chapter
              </h4>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 18 }, (_, i) => (
                  <Button
                    key={i+1}
                    onClick={() => {
                      onNavigate(i+1, 1);
                      onClose();
                    }}
                    variant={i+1 === chapterNumber ? "default" : "outline"}
                    className="h-10 w-10 p-0 aspect-square font-bold"
                    style={{
                      backgroundColor: i+1 === chapterNumber ? colors.primaryRed : colors.lightBeige,
                      color: i+1 === chapterNumber ? 'white' : colors.deeperRed,
                      borderColor: 'transparent'
                    }}
                  >
                    {i+1}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-2" style={{ backgroundColor: colors.lightBeige }} />
            
            <div>
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: colors.darkRed }}>
                Quick Jump - Chapter {chapterNumber}
              </h4>
              <div className="space-y-1.5">
                {generateQuickJumps().map((jump, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      onNavigate(chapterNumber, jump.startVerse);
                      onClose();
                    }}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 h-auto"
                    style={{
                      backgroundColor: (currentVerse >= jump.startVerse && currentVerse <= jump.startVerse + 9) ? colors.lightBeige : 'transparent',
                      color: colors.deeperRed,
                      borderLeft: `3px solid ${(currentVerse >= jump.startVerse && currentVerse <= jump.startVerse + 9) ? colors.primaryRed : 'transparent'}`
                    }}
                  >
                    <span className="flex items-center">
                      {jump.label}
                      {(currentVerse >= jump.startVerse && currentVerse <= jump.startVerse + 9) && 
                        <ChevronRight size={16} className="ml-2" />
                      }
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-2" style={{ backgroundColor: colors.lightBeige }} />
            
            <div>
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: colors.darkRed }}>
                Study Tools
              </h4>
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  className="w-full justify-start px-4 py-6 h-auto"
                  style={{ backgroundColor: colors.lightBeige, color: colors.deeperRed, borderColor: 'transparent' }}
                >
                  <Share size={18} className="mr-3" />
                  Share Verse
                </Button>

                <Button 
                  variant="outline"
                  className="w-full justify-start px-4 py-6 h-auto"
                  style={{ backgroundColor: colors.lightBeige, color: colors.deeperRed, borderColor: 'transparent' }}
                >
                  <Printer size={18} className="mr-3" />
                  Print Commentary
                </Button>
              </div>
            </div>
            

            
    
          </CardContent>
        </ScrollArea>
      </Card>
    </aside>
  );
};

export default SidebarStudy;