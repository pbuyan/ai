import SelectNested from "@/components/select-nested";
import { topics } from "./topics";

interface SelectProps {
	size?: "sm" | "md" | "lg";
	value: string;
	onChange: (value: string) => void;
}

export default function TopicList({ size = "sm", value, onChange }: SelectProps) {
	return <SelectNested size={size} options={topics} onChange={onChange} value={value} />;
}
