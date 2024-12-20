import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { topics } from "./topics";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicList({ value, onChange }: SelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a topic..." />
      </SelectTrigger>
      <SelectContent>
        {topics.map((topic) => (
          <SelectGroup key={topic.category}>
            <SelectLabel>{topic.category}</SelectLabel>
            {topic.items.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
