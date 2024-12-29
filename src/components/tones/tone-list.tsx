import SelectNested from "@/components/select-nested";
import { tones } from "./tones";

interface SelectProps {
	size?: "sm" | "md" | "lg";
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export default function ToneList({ size = "sm", value, onChange, disabled = false }: SelectProps) {
	return <SelectNested size={size} options={tones} onChange={onChange} value={value} disabled={disabled} />;
}
