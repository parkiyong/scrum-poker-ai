import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeckSelector } from '../components/DeckSelector';

describe('DeckSelector component', () => {
  it('renders all Fibonacci deck options and calls onSelectCard', () => {
    const handleSelect = vi.fn();
    render(<DeckSelector selectedCard="5" onSelectCard={handleSelect} />);

    const card5 = screen.getAllByRole('button', { name: /5/i })[0];
    expect(card5).toBeInTheDocument();

    const card8 = screen.getAllByRole('button', { name: /8/i })[0];
    fireEvent.click(card8);

    expect(handleSelect).toHaveBeenCalledWith('8');
  });
});
