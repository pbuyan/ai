import SelectSimple from "@/components/select-simple";

interface SelectProps {
  size: "sm" | "md" | "lg";
  value: string;
  onChange: (value: string) => void;
}

const levels = [
  { code: "begginer", text: "Begginer" },
  { code: "intermediate", text: "Intermediate" },
  { code: "advanced", text: "Advanced" },
];

export default function LevelList({
  size = "sm",
  value,
  onChange,
}: SelectProps) {
  return (
    <SelectSimple
      size={size}
      options={levels}
      onChange={onChange}
      value={value}
      placeholder="Select a level"
    />
  );
}
