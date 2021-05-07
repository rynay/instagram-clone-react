const Suggestions = ({ suggestions, follow }) => {
  return (
    <section>
      <h2>Suggestions for you</h2>
      <ul>
        {suggestions.map((sug) => (
          <li key={sug.username}>
            <div>
              <img alt="" src={`./images/avatars/${sug.username}.jpg`} />
            </div>
            <h3>{sug.username}</h3>
            <button
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                follow(sug);
              }}
              onClick={() => follow(sug)}
            >
              follow
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Suggestions;
