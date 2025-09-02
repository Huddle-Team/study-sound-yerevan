import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Language names in their own language (for native speakers)
const nativeLanguageNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский', 
  hy: 'Հայերեն'
};

// Language names in Armenian (since Armenian is default)
const armenianLanguageNames: Record<string, string> = {
  en: 'Անգլերեն',
  ru: 'Ռուսերեն',
  hy: 'Հայերեն'
};

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  // Use Armenian names if current language is Armenian, otherwise use native names
  const displayNames = language === 'hy' ? armenianLanguageNames : nativeLanguageNames;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 language-selector-responsive button-text-safe">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="truncate hidden sm:inline">{displayNames[language]}</span>
          <span className="truncate sm:hidden">{displayNames[language].slice(0, 3)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="modal-content-responsive">
        {Object.entries(nativeLanguageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as 'en' | 'ru' | 'hy')}
            className={`${language === code ? 'bg-accent' : ''} select-text-responsive`}
          >
            <div className="flex flex-col">
              <span>{name}</span>
              {language === 'hy' && (
                <span className="text-xs text-muted-foreground">{armenianLanguageNames[code]}</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
