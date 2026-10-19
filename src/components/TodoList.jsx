import { useState } from 'react';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  // 'idle' → état initial | 'adding' → jaune | 'done' → bleu
  const [buttonState, setButtonState] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // 1) Le bouton devient JAUNE immédiatement
    setButtonState('adding');

    // 2) On ajoute la tâche
    setTasks((prev) => [...prev, trimmed]);
    setInput('');

    // 3) Après un court délai, il devient BLEU et y reste
    setTimeout(() => {
      setButtonState('done');
    }, 800);
  };

  const handleDelete = (taskIndex) => {
    setTasks((prev) => prev.filter((_, index) => index !== taskIndex));
  };

  // Classe CSS dynamique selon l'état du bouton
  const buttonClass =
    buttonState === 'adding'
      ? 'btn-adding'   // 🟡 jaune
      : buttonState === 'done'
      ? 'btn-done'     // 🔵 bleu (reste)
      : '';            // état par défaut

  return (
    <div className="todo-container">
      <h2>Tâches</h2>

      <form className="todo-form" onSubmit={handleSubmit}>
        <label htmlFor="new-task">Nouvelle tâche :</label>
        <input
          id="new-task"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Acheter du pain"
        />
        <button type="submit" className={buttonClass}>
          {buttonState === 'adding'
            ? ' Ajout en cours...'
            : buttonState === 'done'
            ? ' Ajouté'
            : 'Ajouter'}
        </button>
      </form>

      <ul aria-label="liste des tâches">
        {tasks.map((task, index) => (
          <li key={index}>
            <span>{task}</span>
            <button
              type="button"
              className="btn-delete"
              aria-label={`Supprimer ${task}`}
              onClick={() => handleDelete(index)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;