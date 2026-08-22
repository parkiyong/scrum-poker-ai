import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FacilitatorBar } from '../components/FacilitatorBar';

describe('FacilitatorBar component', () => {
  it('renders start voting in Idle phase', () => {
    const handleStart = vi.fn();
    render(
      <FacilitatorBar
        phase="Idle"
        onStartVoting={handleStart}
        onRevealCards={vi.fn()}
        onTriggerReVote={vi.fn()}
        onFinalize={vi.fn()}
        isFacilitator={true}
      />
    );

    const btn = screen.getByText(/Start Voting/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleStart).toHaveBeenCalled();
  });

  it('renders reveal cards in Voting phase', () => {
    const handleReveal = vi.fn();
    render(
      <FacilitatorBar
        phase="Voting"
        onStartVoting={vi.fn()}
        onRevealCards={handleReveal}
        onTriggerReVote={vi.fn()}
        onFinalize={vi.fn()}
        isFacilitator={true}
      />
    );

    const btn = screen.getByText(/Reveal Cards/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleReveal).toHaveBeenCalled();
  });

  it('renders nothing when not facilitator', () => {
    const { container } = render(
      <FacilitatorBar
        phase="Voting"
        onStartVoting={vi.fn()}
        onRevealCards={vi.fn()}
        onTriggerReVote={vi.fn()}
        onFinalize={vi.fn()}
        isFacilitator={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
