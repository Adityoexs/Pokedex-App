import { rest } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRoute } from '../../test/render';
import { server } from '../../test/msw/server';
import PokemonListPage from '../PokemonListPage';
import PokemonDetailPage from '../PokemonDetailPage';

const API = 'https://pokeapi.co/api/v2';

describe('PokemonDetailPage', () => {
  function renderDetailPage(name = 'bulbasaur') {
    return renderWithRoute(
      [
        { path: '/', element: <PokemonListPage /> },
        { path: '/pokemon/:name', element: <PokemonDetailPage /> },
      ],
      `/pokemon/${name}`
    );
  }

  it('shows loading spinner while fetching', () => {
    renderDetailPage();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders pokemon name', async () => {
    renderDetailPage('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('renders pokemon image', async () => {
    renderDetailPage('bulbasaur');

    await waitFor(() => {
      const img = screen.getByTestId('pokemon-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Bulbasaur');
    });
  });

  it('renders type badges', async () => {
    renderDetailPage('bulbasaur');

    await waitFor(() => {
      const typesContainer = screen.getByTestId('pokemon-types');
      expect(typesContainer).toBeInTheDocument();
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });
  });

  it('renders back navigation link', async () => {
    renderDetailPage('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText(/Back to Pokédex/i)).toBeInTheDocument();
    });

    const backLink = screen.getByText(/Back to Pokédex/i).closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders pokemon stats section', async () => {
    renderDetailPage('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText('Base Stats')).toBeInTheDocument();
    });

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
  });

  it('renders height and weight', async () => {
    renderDetailPage('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText(/0\.7 m/i)).toBeInTheDocument();
      expect(screen.getByText(/6\.9 kg/i)).toBeInTheDocument();
    });
  });

  it('renders error state when request fails', async () => {
    server.use(
      rest.get(`${API}/pokemon/:name`, (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderDetailPage('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText(/Failed to load Pokémon "bulbasaur"/i)).toBeInTheDocument();
    });
  });

  it('falls back to front_default when official artwork is missing', async () => {
    server.use(
      rest.get(`${API}/pokemon/:name`, (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            base_experience: 64,
            sprites: {
              front_default: 'https://example.com/front.png',
              other: {
                'official-artwork': {
                  front_default: null,
                },
              },
            },
            types: [
              {
                slot: 1,
                type: { name: 'grass', url: `${API}/type/12` },
              },
            ],
            abilities: [],
            stats: [],
          })
        );
      })
    );

    renderDetailPage('bulbasaur');

    await waitFor(() => {
      const img = screen.getByTestId('pokemon-image');
      expect(img).toHaveAttribute('src', 'https://example.com/front.png');
    });
  });

  it('renders hidden ability label when ability is hidden', async () => {
    server.use(
      rest.get(`${API}/pokemon/:name`, (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            base_experience: 64,
            sprites: {
              front_default: 'https://example.com/front.png',
              other: {
                'official-artwork': {
                  front_default: 'https://example.com/artwork.png',
                },
              },
            },
            types: [],
            abilities: [
              {
                ability: { name: 'overgrow', url: `${API}/ability/65` },
                is_hidden: false,
                slot: 1,
              },
              {
                ability: { name: 'chlorophyll', url: `${API}/ability/34` },
                is_hidden: true,
                slot: 3,
              },
            ],
            stats: [],
          })
        );
      })
    );

    renderDetailPage('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText('overgrow')).toBeInTheDocument();
      expect(screen.getByText('chlorophyll')).toBeInTheDocument();
      expect(screen.getByText('(hidden)')).toBeInTheDocument();
    });
  });
});