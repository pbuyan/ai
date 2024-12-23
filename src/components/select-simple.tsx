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
  placeholder?: string;
}

export default function SelectSimple({
  options,
  value,
  onChange,
  placeholder,
}: SelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="py-6 text-md">
        <SelectValue placeholder={placeholder} />
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
