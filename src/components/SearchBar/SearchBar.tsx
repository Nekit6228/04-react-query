import toast from "react-hot-toast";
import css from "./SearchBar.module.css";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();  
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      toast("Please enter your search query.");
      return;
    }
    onSubmit(trimmedQuery);
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <div className={css.logowrp}>
          <a
            className={css.link}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by <br />
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="logo"
              width={200}
            />
          </a>
        </div>

        <form onSubmit={handleSubmit} className={css.form}>
          <div className={css.inputGroup}>
            <input
              className={css.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={css.button} type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
