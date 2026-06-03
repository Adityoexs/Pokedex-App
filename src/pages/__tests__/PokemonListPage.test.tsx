import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import PokemonListPage from '../PokemonListPage';

describe('PokemonListPage', () => {
  it('renders the page header', () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/'] });
    expect(screen.getByText(/Pokédex/i)).toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/'] });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders pokemon cards after data loads', async () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/'] });

    // Wait for an actual card, not just the grid container (which renders immediately)
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
    });

    expect(screen.getByTestId('pokemon-card-ivysaur')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-charmander')).toBeInTheDocument();
  });

  it('renders pokemon names capitalised', async () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('renders the type filter UI', async () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/filter by type/i)).toBeInTheDocument();
  });

  it('shows pokemon filtered by type when a type is selected', async () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/?type=fire'] });

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-charmander')).toBeInTheDocument();
    });

    expect(screen.getByTestId('pokemon-card-charmeleon')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-charizard')).toBeInTheDocument();
    // Original unfiltered pokemon should not be present
    expect(screen.queryByTestId('pokemon-card-bulbasaur')).not.toBeInTheDocument();
  });

  it('shows clear button when type filter is active', async () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/?type=fire'] });

    await waitFor(() => {
      expect(screen.getByLabelText('Clear type filter')).toBeInTheDocument();
    });
  });

  it('clears type filter when Clear is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/?type=fire'] });

    await waitFor(() => {
      expect(screen.getByLabelText('Clear type filter')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Clear type filter'));

    // After clearing, the unfiltered list should appear
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
    });
  });

  it('each card links to the detail page', async () => {
    renderWithProviders(<PokemonListPage />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
    });

    const card = screen.getByTestId('pokemon-card-bulbasaur');
    expect(card.closest('a')).toHaveAttribute('href', '/pokemon/bulbasaur');
  });
});
