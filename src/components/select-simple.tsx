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
  size?: "sm" | "md" | "lg";
}

export default function SelectSimple({
  options,
  value,
  onChange,
  placeholder,
  size = "sm",
}: SelectProps) {
  const sizes = {
    sm: "py-4",
    md: "py-6",
    lg: "py-8",
  };
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={`text-md text-muted-foreground ${sizes[size]}`}>
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
