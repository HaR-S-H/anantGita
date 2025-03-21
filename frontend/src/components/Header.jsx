import React from 'react';
import colors from '@/constants/colors';

// shadcn/ui components
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Menu } from 'lucide-react';

const Header = ({ displayLanguage, setDisplayLanguage, toggleSidebar }) => {
  return (
    <header className="py-4 px-6 shadow-lg relative z-10" style={{ 
      background: `linear-gradient(135deg, ${colors.darkRed} 0%, #8B0000 100%)`,
    }}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full shadow-md mr-4">
            <img src="/logo.svg" alt="Bhagavad Gita" className="h-8 w-auto" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: colors.offWhite }}>
              Bhagavad Gita
            </h1>
            <p className="text-xs md:text-sm opacity-75" style={{ color: colors.paleBeige }}>
              Sacred Wisdom of Ancient India
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={displayLanguage} onValueChange={setDisplayLanguage}>
            <SelectTrigger className="w-32 border-none bg-white/10 hover:bg-white/20 transition-colors" style={{ color: colors.offWhite }}>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: colors.darkRed, color: colors.paleBeige }}>
              <SelectItem value="sanskrit" className="hover:bg-white/10">Sanskrit</SelectItem>
              <SelectItem value="english" className="hover:bg-white/10">English</SelectItem>
              <SelectItem value="hindi" className="hover:bg-white/10">Hindi</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={toggleSidebar}
            variant="outline"
            className="flex items-center gap-2 border-none bg-white/10 hover:bg-white/20 transition-colors"
            style={{ color: colors.paleBeige }}
          >
            <Menu size={16} />
            <span>Menu</span>
          </Button>
        </div>
      </div>
      
      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 opacity-70"></div> */}
    </header>
  );
};

export default Header;