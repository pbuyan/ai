import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelect from "@/components/languages/language-list";
import { cn, getLanguageName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Printer, MoveRight } from "lucide-react";
import { toast } from "sonner";

export default function DialogCard({
  text,
  translatedDialogue,
  language,
  translationLanguage,
  onLanguageUpdate,
  onTranslationLanguageUpdate,
  generating,
  onTranslationGenerateClick,
}: {
  text: string;
  translatedDialogue: string;
  language: string;
  translationLanguage: string;
  generating: boolean;
  onLanguageUpdate: (lang: string) => void;
  onTranslationLanguageUpdate: (lang: string) => void;
  onTranslationGenerateClick?: () => void;
}) {
  const handleLanguageChange = (lang: string) => {
    onLanguageUpdate(lang);
  };

  const handleTranslationLanguageChange = (lang: string) => {
    onTranslationLanguageUpdate(lang);
  };

  const sanitizeString = (inputString: string) => {
    if (typeof inputString !== "string") {
      throw new TypeError("Input must be a string");
    }
    return inputString.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleCopy = () => {
    const str = sanitizeString(text);
    navigator.clipboard.writeText(str);
    toast.success("Copied!", {
      position: "bottom-left",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex flex-row align-middle gap-4">
            {/* {typeof onTranslationGenerateClick === "function" && (
              <>
                <Button
                  onClick={onTranslationGenerateClick}
                  variant={"outline"}
                >
                  Traslate
                </Button>
                <div className="py-2">to</div>
              </>
            )} */}

            <div className="pt-2 text-gray-500">
              {getLanguageName(language)}
            </div>
            {/* <LanguageSelect value={language} onChange={handleLanguageChange} /> */}
          </div>

          <div className="pt-1">
            <div>
              <>
                <Button
                  onClick={onTranslationGenerateClick}
                  variant={"outline"}
                  className="text-gray-500"
                >
                  Traslate
                  <MoveRight className="text-gray-500" />
                </Button>
              </>
            </div>
          </div>

          <div className="flex gap-4">
            {/* <Button variant={"outline"} onClick={handleCopy}>
              <Copy />
            </Button>
            <Button variant={"outline"} onClick={handlePrint}>
              <Printer />
            </Button> */}
            <div>
              <LanguageSelect
                value={translationLanguage}
                onChange={handleTranslationLanguageChange}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <Separator />
      <CardContent>
        <div className="flex flex-wrap">
          <div
            className={cn(
              "w-full lg:w-1/2 p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800 min-h-48",
              { "animate-pulse": generating }
            )}
          >
            {!text ? (
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
              </div>
            ) : (
              <div
                className="prose prose-lg"
                /* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          <div
            className={cn(
              "w-full lg:w-1/2 p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800 min-h-48",
              { "animate-pulse": generating }
            )}
          >
            <h2 className="pb-8 lg:hidden underline text-xl text-gray-500">
              {getLanguageName(translationLanguage)}
            </h2>
            {!translatedDialogue ? (
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
              </div>
            ) : (
              <div
                className="prose prose-lg"
                /* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */
                dangerouslySetInnerHTML={{ __html: translatedDialogue }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
