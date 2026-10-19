import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach } from 'vitest';
import TodoList from './TodoList';

describe('TodoList', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // ✅ Test 1 : rendu initial
  test('affiche le formulaire, le label et la liste vide au démarrage', () => {
    render(<TodoList />);

    expect(screen.getByLabelText(/nouvelle tâche/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /liste des tâches/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // ✅ Test 2 : ajout d'une tâche
  test("ajoute une tâche et l'affiche dans la liste", async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /ajouter/i });

    await user.type(input, 'Acheter du pain');
    await user.click(button);

    expect(screen.getByText('Acheter du pain')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  // ✅ Test 3 : le champ est vidé après l'ajout
  test("vide le champ de saisie après l'ajout", async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    await user.type(input, 'Apprendre React');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(input).toHaveValue('');
  });

  // ✅ Test 4 : ajout de plusieurs tâches dans l'ordre
  test('ajoute plusieurs tâches dans le bon ordre', async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /ajouter/i });

    await user.type(input, 'Acheter du pain');
    await user.click(button);
    await user.type(input, 'Apprendre React');
    await user.click(button);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Acheter du pain');
    expect(items[1]).toHaveTextContent('Apprendre React');
  });

  // ✅ Test 5 : soumission via la touche Entrée
  test('ajoute une tâche en appuyant sur Entrée', async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    await user.type(input, 'Faire du sport{Enter}');

    expect(screen.getByText('Faire du sport')).toBeInTheDocument();
  });

  test('supprime uniquement la tâche sélectionnée', async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    const addButton = screen.getByRole('button', { name: /ajouter/i });
    await user.type(input, 'Acheter du pain');
    await user.click(addButton);
    await user.type(input, 'Apprendre React');
    await user.click(addButton);

    await user.click(screen.getByRole('button', { name: 'Supprimer Acheter du pain' }));

    expect(screen.queryByText('Acheter du pain')).not.toBeInTheDocument();
    expect(screen.getByText('Apprendre React')).toBeInTheDocument();
  });

  // ✅ Test 6 : ignore les tâches vides ou composées d'espaces
  test('ignore une tâche vide ou composée uniquement d’espaces', async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /ajouter/i });

    // Cas 1 : champ vide
    await user.click(button);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    // Cas 2 : uniquement des espaces
    await user.type(input, '   ');
    await user.click(button);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // ✅ Test 7 : trim des espaces autour du texte
  test('supprime les espaces avant et après la tâche', async () => {
    render(<TodoList />);

    const input = screen.getByLabelText(/nouvelle tâche/i);
    await user.type(input, '   Lire un livre   {Enter}');

    expect(screen.getByText('Lire un livre')).toBeInTheDocument();
  });
});