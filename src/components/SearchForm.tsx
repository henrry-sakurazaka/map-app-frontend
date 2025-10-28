import React, { useState } from 'react';

interface SearchFormProps {
    onSearch: (region: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch}) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(input);
    };

    return (
        <form
            onSubmit ={handleSubmit}
            className="flex items-center gap-2 mt-6 mb-8"
            >
            <input
                type="text"
                placeholder="地域名を入力(例: 東京都千代田区)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                検索
            </button>
            
        </form>
    );
};
export default SearchForm;