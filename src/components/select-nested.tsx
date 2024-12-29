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
  size?: "sm" | "md" | "lg";
  options: { category: string; items: string[] }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SelectNested({
  size = "sm",
  options,
  value,
  onChange,
  disabled = false,
}: SelectProps) {
  const sizes = {
    sm: "py-4",
    md: "py-6",
    lg: "py-8",
  };
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        className={`text-md text-foreground ${sizes[size]}`}
        disabled={disabled}
      >
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
