import { languages } from "./languages";
import SelectSimple from "@/components/select-simple";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
}

export default function LanguageSelect({
  value,
  size = "sm",
  onChange,
}: SelectProps) {
  return (
    <SelectSimple
      size={size}
      options={languages}
      onChange={onChange}
      value={value}
      placeholder="Select a language"
    />
  );
}
