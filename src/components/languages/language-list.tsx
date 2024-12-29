import SelectSimple from "@/components/select-simple";
import { languages } from "./languages";

interface SelectProps {
	value: string;
	onChange: (value: string) => void;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
}

export default function LanguageSelect({ value, size = "sm", onChange, disabled = false }: SelectProps) {
	return (
		<SelectSimple
			size={size}
			options={languages}
			onChange={onChange}
			value={value}
			disabled={disabled}
			placeholder="Select a language"
		/>
	);
}
