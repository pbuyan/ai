import { countries } from "./countries";
import SelectSimple from "@/components/select-simple";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountriesSelect({ value, onChange }: SelectProps) {
  return <SelectSimple options={countries} onChange={onChange} value={value} />;
}
