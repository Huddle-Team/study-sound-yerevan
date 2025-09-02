import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage, languageNames } from "@/contexts/LanguageContext";

// Armenian-centric language names for button display
const nativeLanguageNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский', 
  hy: 'Հայերեն'
};

// Armenian language names for dropdown (what Armenians would call these languages)
const armenianLanguageNames: Record<string, string> = {
  en: 'Անգլերեն',
  ru: 'Ռուսերեն',
  hy: 'Հայերեն'
};

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="btn-responsive gap-2 min-w-fit">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate max-w-20">
            {nativeLanguageNames[language]}
          </span>
          <span className="sm:hidden">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {Object.entries(armenianLanguageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as 'en' | 'ru' | 'hy')}
            className={`${language === code ? 'bg-accent' : ''} text-responsive`}
          >
            <span className="truncate">{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
