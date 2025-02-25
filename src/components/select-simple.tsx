import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
	code: string;
	text: string;
}

interface SelectProps {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
	sm: "py-4",
	md: "py-6",
	lg: "py-8",
};
export default function SelectSimple({
	options,
	value,
	onChange,
	placeholder,
	size = "sm",
	disabled = false,
}: SelectProps) {
	return (
		<Select onValueChange={onChange} value={value}>
			<SelectTrigger className={`text-md text-foreground ${SIZE_CLASSES[size]}`} disabled={disabled}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{options.map((item) => (
					<SelectItem key={item.code} value={item.code}>
						{item.text}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
