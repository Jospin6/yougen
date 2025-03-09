import { Input } from "./input";

export const SearchBar = ({ onSearch }: { onSearch: (value: string) => void }) => {
    return (
        <Input
            className="w-[90%]"
            placeholder="Search a script"
            onChange={(e) => onSearch(e.target.value)}
        />
    );
};