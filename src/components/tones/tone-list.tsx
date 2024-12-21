import { tones } from "./tones";
import SelectNested from "@/components/select-nested";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ToneList({ value, onChange }: SelectProps) {
  return <SelectNested options={tones} onChange={onChange} value={value} />;
}
