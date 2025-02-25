import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Option {
	category: string;
	items: string[];
}

interface SelectProps {
	size?: "sm" | "md" | "lg";
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
	sm: "py-4",
	md: "py-6",
	lg: "py-8",
};
export default function SelectNested({
	size = "sm",
	options,
	value,
	onChange,
	disabled = false,
}: SelectProps) {
	return (
		<Select onValueChange={onChange} value={value}>
			<SelectTrigger className={`text-md text-foreground ${SIZE_CLASSES[size]}`} disabled={disabled}>
				<SelectValue placeholder="Select a topic..." />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectGroup key={option.category}>
						<SelectLabel>{option.category}</SelectLabel>
						{option.items.map((item) => (
							<SelectItem key={`${option.category}-${item}`} value={`${option.category} ${item}`}>
								{item}
							</SelectItem>
						))}
					</SelectGroup>
				))}
			</SelectContent>
		</Select>
	);
}
