import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  options: { code: string; text: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectNested({
  options,
  value,
  onChange,
}: SelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a topic..." />
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
