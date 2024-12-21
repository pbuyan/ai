import { topics } from "./topics";
import SelectNested from "../select-nested";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicList({ value, onChange }: SelectProps) {
  return <SelectNested options={topics} onChange={onChange} value={value} />;
}
