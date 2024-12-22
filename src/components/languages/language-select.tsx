import { languages } from "./languages";
import SelectSimple from "@/components/select-simple";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LanguageSelect({ value, onChange }: SelectProps) {
  return (
    <SelectSimple
      options={languages}
      onChange={onChange}
      value={value}
      placeholder="Select a language"
    />
  );
}
