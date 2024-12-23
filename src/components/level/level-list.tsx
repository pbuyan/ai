import SelectSimple from "@/components/select-simple";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

const levels = [
  { code: "begginer", text: "Begginer" },
  { code: "intermediate", text: "Intermediate" },
  { code: "advanced", text: "Advanced" },
];

export default function LevelList({ value, onChange }: SelectProps) {
  return (
    <SelectSimple
      options={levels}
      onChange={onChange}
      value={value}
      placeholder="Select a level"
    />
  );
}
