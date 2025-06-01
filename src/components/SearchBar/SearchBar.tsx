import styles from './SearchBar.module.css';
import { toast } from 'react-hot-toast';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {

  const handleClick = () => {
    const input = document.querySelector('input[name="query"]') as HTMLInputElement | null;
    const query = input?.value.trim();

    if (!query) {
      toast.error('Please enter a search query');
      return;
    }

    onSubmit(query);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            name="query"
            placeholder="Search movies..."
            autoComplete="off"
            autoFocus
          />
          <button className={styles.button} type="button" onClick={handleClick}>
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
