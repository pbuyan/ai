"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export function Terminal() {
	const [terminalStep, setTerminalStep] = useState(0);
	const [copied, setCopied] = useState(false);
	const terminalSteps = [
		"<b>Sarah:</b> Hey Mark! How's your day going?",

		"<b>Mark:</b> Hey Sarah! It's been pretty good so far, just a bit busy at work. How about yours?",

		"<b>Sarah:</b> Busy too, but in a good way! I finally finished that report I was stressing about. What are you working on?",

		"<b>Mark:</b> Oh, the usual – trying to keep up with emails and client calls. It's been a bit hectic with this new project. Anything exciting happening on your end besides the report?",

		"<b>Sarah:</b> Not really, just looking forward to the weekend! Thinking of trying that new Italian place downtown. Have you been?",

		"<b>Mark:</b> I haven't, but I've heard good things! Let me know how it is if you go. I might join you next time.",

		"<b>Sarah:</b> Sounds like a plan! I'll definitely let you know. Gotta run, though, but it was great chatting with you.",

		"<b>Mark:</b> You too, Sarah! Have a great rest of the day.",
	];

	useEffect(() => {
		const timer = setTimeout(() => {
			setTerminalStep((prev) => (prev < terminalSteps.length - 1 ? prev + 1 : prev));
		}, 500);

		return () => clearTimeout(timer);
	}, [terminalStep]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(terminalSteps.join("\n"));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full rounded-lg shadow-lg overflow-hidden bg-gray-50 dark:bg-gray-800 font-sans text-sm relative">
			<div className="p-4">
				<div className="flex justify-between items-center mb-4 pb-2 border-b">
					<div className="flex space-x-2">
						English (US)
						{/* <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" /> */}
					</div>
					<button
						type="button"
						onClick={copyToClipboard}
						className="text-gray-400 hover:text-white transition-colors"
						aria-label="Copy to clipboard"
					>
						{copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
					</button>
				</div>
				<div className="space-y-2">
					{terminalSteps.map((step, index) => (
						<div
							key={step}
							className={`${
								index > terminalStep ? "opacity-0" : "opacity-100"
							} transition-opacity duration-300`}
						>
							{/* <span className="text-green-400">$</span>{" "} */}
							<span dangerouslySetInnerHTML={{ __html: step }} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
