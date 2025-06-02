import toast from "react-hot-toast";
import css from "./SearchBar.module.css";
import { useEffect } from "react";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  useEffect(() => {
    function handleFormSubmit(event: Event) {
      const form = event.target as HTMLFormElement;
      if (
        form.tagName !== "FORM" ||
        form.getAttribute("action") !== "handleSubmit"
      ) {
        return;
      }
      event.preventDefault();
      const formData = new FormData(form);
      const query = (formData.get("query") as string)?.trim();
      if (!query) {
        toast("Please enter your search query.");
        return;
      }
      onSubmit(query);
    }

    document.addEventListener("submit", handleFormSubmit);
    return () => {
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [onSubmit]);

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

        <form action="handleSubmit" className={css.form}>
          <div className={css.inputGroup}>
            <input
              className={css.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
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
