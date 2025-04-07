import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const limit = 20;

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return await detailResponse.json();
        })
      );
      
      setPokemons(pokemonDetails);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des Pokémon. Veuillez réessayer.');
      console.error('Erreur de fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      fetchPokemons();
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setPokemons([data]);
      } else {
        setPokemons([]);
        setError(`Aucun Pokémon trouvé avec le nom ou l'ID: ${searchTerm}`);
      }
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      console.error('Erreur de recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    setOffset(Math.max(0, offset - limit));
  };

  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePokemonClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (err) {
      setError('Erreur lors du chargement des détails du Pokémon.');
      console.error('Erreur de fetch détails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedPokemon(null);
  };

  const renderPokemonDetails = () => (
    <div className="pokemon-detail">
      <button className="back-button" onClick={handleBackClick}>Retour à la liste</button>
      <h2>{selectedPokemon.name.toUpperCase()} #{selectedPokemon.id}</h2>
      <img 
        src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default} 
        alt={selectedPokemon.name}
      />
      <div className="pokemon-types">
        {selectedPokemon.types.map((type, index) => (
          <span 
            key={index} 
            className={`pokemon-type type-${type.type.name}`}
          >
            {type.type.name}
          </span>
        ))}
      </div>
      <div className="pokemon-stats">
        {selectedPokemon.stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <strong>{stat.stat.name}:</strong> {stat.base_stat}
          </div>
        ))}
        <div className="stat-item">
          <strong>Height:</strong> {selectedPokemon.height / 10}m
        </div>
        <div className="stat-item">
          <strong>Weight:</strong> {selectedPokemon.weight / 10}kg
        </div>
      </div>
    </div>
  );

  const renderPokemonList = () => (
    <>
      <SearchBar onSearch={handleSearch} />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Chargement des Pokémon...</div>
      ) : (
        <>
          <div className="pokemon-list">
            {pokemons.length > 0 ? (
              pokemons.map((pokemon) => (
                <div 
                  key={pokemon.id} 
                  className="pokemon-card"
                  onClick={() => handlePokemonClick(pokemon.id)}
                >
                  <span className="pokemon-id">#{pokemon.id}</span>
                  <img 
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                  />
                  <h3>{pokemon.name}</h3>
                  <div className="pokemon-types">
                    {pokemon.types.map((type, index) => (
                      <span 
                        key={index} 
                        className={`pokemon-type type-${type.type.name}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>Aucun Pokémon trouvé</div>
            )}
          </div>
          
          {pokemons.length > 1 && (
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={offset === 0}
              >
                Précédent
              </button>
              <button onClick={handleNextPage}>Suivant</button>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Pokédex</h1>
      </header>
      <div className="pokedex-container">
        {selectedPokemon ? renderPokemonDetails() : renderPokemonList()}
      </div>
    </div>
  );
}

export default App;