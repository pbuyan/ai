import { tones } from "./tones";
import SelectNested from "@/components/select-nested";

interface SelectProps {
  size?: "sm" | "md" | "lg";
  value: string;
  onChange: (value: string) => void;
}

export default function ToneList({
  size = "sm",
  value,
  onChange,
}: SelectProps) {
  return (
    <SelectNested
      size={size}
      options={tones}
      onChange={onChange}
      value={value}
    />
  );
}
