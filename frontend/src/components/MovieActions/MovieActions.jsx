import './MovieActions.css';

function MovieActions({ className = '' }) {
  return (
    <div className={`movie-actions ${className}`.trim()} aria-hidden="true">
      <span className="movie-action">
        <svg
          className="movie-action-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.9 14 10h5.8a2 2 0 0 1 2 2.3l-1.4 7.2A3 3 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3l3.4-6.8a2 2 0 0 1 3.6 1.7Z" />
        </svg>
      </span>
      <span className="movie-action">
        <svg
          className="movie-action-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 14V2" />
          <path d="M9 18.1 10 14H4.2a2 2 0 0 1-2-2.3l1.4-7.2A3 3 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-3.4 6.8a2 2 0 0 1-3.6-1.7Z" />
        </svg>
      </span>
    </div>
  );
}

export default MovieActions;
