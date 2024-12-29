import LanguageSelect from "@/components/languages/language-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, getLanguageName } from "@/lib/utils";
import { Copy, MoveRight, Printer } from "lucide-react";
import { toast } from "sonner";

export default function DialogCard({
	text,
	translatedDialogue,
	language,
	translationLanguage,
	onLanguageUpdate,
	onTranslationLanguageUpdate,
	generating,
	generatingTranslation,
	onTranslationGenerateClick,
}: {
	text: string;
	translatedDialogue: string;
	language: string;
	translationLanguage: string;
	generating: boolean;
	generatingTranslation: boolean;
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

	const handleCopy = (string: string) => {
		const str = sanitizeString(string);
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
				<CardTitle className="flex justify-between  h-full align-middle">
					<div className="text-foreground my-auto">{getLanguageName(language)}</div>

					<div className="pt-1">
						<Button
							onClick={onTranslationGenerateClick}
							variant={"outline"}
							className="text-foreground text-md font-semibold"
							disabled={!text}
						>
							Traslate
							<MoveRight />
						</Button>
					</div>

					<div className="flex gap-4">
						<div>
							<LanguageSelect
								value={translationLanguage}
								onChange={handleTranslationLanguageChange}
								disabled={!text}
							/>
						</div>
					</div>
				</CardTitle>
			</CardHeader>

			<Separator />

			<CardContent>
				<div className="flex mt-6 gap-2 flex-col lg:flex-row">
					<div
						className={cn(
							"w-full p-4 bg-gray-50 rounded-lg md:p-8 dark:bg-gray-800 min-h-48",
							{ "animate-pulse": generating },
							{ "lg:w-1/2": generatingTranslation || translatedDialogue },
						)}
					>
						<div className="pb-2 flex justify-end text-gray-400">
							<Copy
								onClick={() => handleCopy(text)}
								className={cn("hover:cursor-pointer", { hidden: !text })}
							/>
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
					<Separator className={cn("lg:hidden", { hidden: !translatedDialogue })} />
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
							<Copy
								onClick={() => handleCopy(translatedDialogue)}
								className={cn("hover:cursor-pointer", {
									hidden: !translatedDialogue,
								})}
							/>
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
							<div
								className="prose prose-lg text-primary"
								dangerouslySetInnerHTML={{ __html: translatedDialogue }}
							/>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
