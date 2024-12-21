import CountriesSelect from "@/components/countries/countries-select";

export default function DialogueText({
  text,
  language,
  onLanguageUpdate,
}: {
  text: string;
  language: string;
  onLanguageUpdate: (lang: string) => void;
}) {
  const handleLanguageChange = (lang: string) => {
    onLanguageUpdate(lang);
  };
  return (
    <div>
      <div className="">
        <CountriesSelect value={language} onChange={handleLanguageChange} />
      </div>
      <p className="mt-2 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
