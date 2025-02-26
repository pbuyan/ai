import LanguageSelect from "@/components/languages/language-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, getLanguageName } from "@/lib/utils";
import { Copy, MoveRight, Printer } from "lucide-react";
import { toast } from "sonner";

interface DialogCardProps {
	text: string;
	translatedDialogue: string;
	language: string;
	translationLanguage: string;
	generating: boolean;
	generatingTranslation: boolean;
	onTranslationLanguageUpdate: (lang: string) => void;
	onTranslationGenerateClick?: () => void;
}

const sanitizeString = (inputString: string): string => {
	if (typeof inputString !== "string") {
		throw new TypeError("Input must be a string");
	}
	return inputString.replace(/<\/?[^>]+(>|$)/g, "");
};

// Copy handler that uses the sanitizer before writing to clipboard.
const handleCopy = (content: string): void => {
	const sanitized = sanitizeString(content);
	navigator.clipboard.writeText(sanitized);
	toast.success("Copied!", { position: "bottom-left" });
};

const OriginalPanel: React.FC<{
	text: string;
	generating: boolean;
	hasTranslation: boolean;
}> = ({ text, generating, hasTranslation }) => (
	<div
		className={cn(
			"w-full p-4 bg-gray-50 rounded-lg md:p-8 dark:bg-gray-800 min-h-48",
			{ "animate-pulse": generating },
			{ "lg:w-1/2": hasTranslation },
		)}
	>
		<div className="pb-2 flex justify-end text-gray-400">
			{text && <Copy onClick={() => handleCopy(text)} className="hover:cursor-pointer" />}
		</div>
		{!text ? (
			<div className="w-full">
				<div className="h-3.5 bg-skeleton rounded-full w-48 mb-4" />
				<div className="h-3 bg-skeleton rounded-full max-w-[480px] mb-2.5" />
				<div className="h-3 bg-skeleton rounded-full mb-2.5" />
				<div className="h-3 bg-skeleton rounded-full max-w-[440px] mb-2.5" />
				<div className="h-3 bg-skeleton rounded-full max-w-[460px] mb-2.5" />
				<div className="h-3 bg-skeleton rounded-full max-w-[360px]" />
			</div>
		) : (
			<div className="prose prose-lg text-primary" dangerouslySetInnerHTML={{ __html: text }} />
		)}
	</div>
);

// Subcomponent for the translated dialogue panel.
const TranslationPanel: React.FC<{
	translatedDialogue: string;
	generatingTranslation: boolean;
	translationLanguage: string;
}> = ({ translatedDialogue, generatingTranslation, translationLanguage }) => (
	<div
		className={cn(
			"w-full lg:w-1/2 p-4 bg-gray-50 rounded-lg md:p-8 dark:bg-gray-800 min-h-48",
			{ "animate-pulse": generatingTranslation },
			{ hidden: !generatingTranslation && !translatedDialogue },
		)}
	>
		<div className="pb-2 flex justify-between lg:justify-end text-gray-400">
			<h2 className="pb-8 lg:hidden underline text-xl text-foreground">
				{getLanguageName(translationLanguage)}
			</h2>
			{translatedDialogue && (
				<Copy onClick={() => handleCopy(translatedDialogue)} className="hover:cursor-pointer" />
			)}
		</div>
		{!translatedDialogue ? (
			<div className="w-full">
				<div className="h-2.5 bg-skeleton rounded-full w-48 mb-4" />
				<div className="h-2 bg-skeleton rounded-full max-w-[480px] mb-2.5" />
				<div className="h-2 bg-skeleton rounded-full mb-2.5" />
				<div className="h-2 bg-skeleton rounded-full max-w-[440px] mb-2.5" />
				<div className="h-2 bg-skeleton rounded-full max-w-[460px] mb-2.5" />
				<div className="h-2 bg-skeleton rounded-full max-w-[360px]" />
			</div>
		) : (
			<div className="prose prose-lg text-primary" dangerouslySetInnerHTML={{ __html: translatedDialogue }} />
		)}
	</div>
);

export default function DialogCard({
	text,
	translatedDialogue,
	language,
	translationLanguage,
	generating,
	generatingTranslation,
	onTranslationLanguageUpdate,
	onTranslationGenerateClick,
}: DialogCardProps) {
	const handleTranslationLanguageChange = (lang: string) => onTranslationLanguageUpdate(lang);

	const hasTranslation = generatingTranslation || translatedDialogue;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between h-full items-center">
					<div className="text-foreground">{getLanguageName(language)}</div>
					<div className="pt-1">
						<Button
							onClick={onTranslationGenerateClick}
							variant="outline"
							className="text-foreground text-md font-semibold"
							disabled={!text}
						>
							Translate <MoveRight />
						</Button>
					</div>
					<div className="flex gap-4">
						<LanguageSelect
							value={translationLanguage}
							onChange={handleTranslationLanguageChange}
							disabled={!text}
						/>
					</div>
				</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent>
				<div className="flex mt-6 gap-2 flex-col lg:flex-row">
					<OriginalPanel text={text} generating={generating} hasTranslation={!!hasTranslation} />
					<Separator className={cn("lg:hidden", { hidden: !translatedDialogue })} />
					<TranslationPanel
						translatedDialogue={translatedDialogue}
						generatingTranslation={generatingTranslation}
						translationLanguage={translationLanguage}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
