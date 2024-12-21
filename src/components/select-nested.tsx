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
  options: { category: string; items: string[] }[];
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
      <SelectTrigger>
        <SelectValue placeholder="Select a topic..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectGroup key={option.category}>
            <SelectLabel>{option.category}</SelectLabel>
            {option.items.map((item) => (
              <SelectItem key={item} value={`${option.category} ${item}`}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
