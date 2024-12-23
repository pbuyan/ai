import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelect from "@/components/languages/language-select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";

export default function DialogCard({
  text,
  language,
  onLanguageUpdate,
  generating,
  onTranslationGenerateClick,
}: {
  text: string;
  language: string;
  onLanguageUpdate: (lang: string) => void;
  generating: boolean;
  onTranslationGenerateClick?: () => void;
}) {
  const handleLanguageChange = (lang: string) => {
    onLanguageUpdate(lang);
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
          <div className="flex gap-4">
            <Button variant={"outline"} onClick={handleCopy}>
              <Copy />
            </Button>
            <Button variant={"outline"} onClick={handlePrint}>
              <Printer />
            </Button>
          </div>
          <div className="flex flex-row align-middle gap-4">
            {typeof onTranslationGenerateClick === "function" && (
              <>
                <Button
                  onClick={onTranslationGenerateClick}
                  variant={"outline"}
                >
                  Traslate
                </Button>
                <div className="py-2">to</div>
              </>
            )}

            <LanguageSelect value={language} onChange={handleLanguageChange} />
          </div>
        </CardTitle>
      </CardHeader>

      <Separator />
      <CardContent>
        <div
          className={cn(
            "p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800 min-h-48",
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
      </CardContent>
    </Card>
  );
}
