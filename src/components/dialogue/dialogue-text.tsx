import type { FC } from "react";
import LanguageSelect from "@/components/languages/language-list";
import { cn } from "@/lib/utils";
import SkeletonLoader from "@/components/skeleton-loader";

interface DialogueTextProps {
	text: string;
	language: string;
	onLanguageUpdate: (lang: string) => void;
	generating: boolean;
}

const DialogueText: FC<DialogueTextProps> = ({ text, language, onLanguageUpdate, generating }) => {
	return (
		<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="flex flex-wrap justify-end text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
				<div className="py-2 me-2">
					<LanguageSelect value={language} onChange={onLanguageUpdate} />
				</div>
			</div>
			<div
				className={cn("p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800 min-h-48", {
					"animate-pulse": generating,
				})}
			>
				{text ? (
					<div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: text }} />
				) : (
					<SkeletonLoader />
				)}
			</div>
		</div>
	);
};

export default DialogueText;
