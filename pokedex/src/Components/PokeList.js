import React, { useState, useEffect } from 'react';
import API from '../API/API';
import { Link } from 'react-router-dom';

const PokeList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchName, setSearchName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  
  const api = new API();
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [allPokemons, allTypes] = await Promise.all([
          api.getAllPokemon(),
          api.getTypes()
        ]);
        
        setPokemons(allPokemons);
        setTypes(allTypes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      
      const criteria = {};
      if (searchName) criteria.name = searchName;
      if (selectedType) criteria.type = parseInt(selectedType);
      if (selectedGeneration) criteria.generation = parseInt(selectedGeneration);
      
      const results = await api.searchPokemon(criteria);
      setPokemons(results);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const resetFilters = async () => {
    setSearchName('');
    setSelectedType('');
    setSelectedGeneration('');
    
    try {
      setLoading(true);
      const allPokemons = await api.getAllPokemon();
      setPokemons(allPokemons);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  // Générer un tableau unique de générations à partir des données
  const generations = [...new Set(pokemons.map(p => p.generation))].sort((a, b) => a - b);
  
  if (loading && pokemons.length === 0) return <div>Chargement des données...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div className="pokemon-list-container">
      <h1>Pokédex</h1>
      
      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="name-search">Nom:</label>
          <input
            id="name-search"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Rechercher par nom"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Tous les types</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>
                {type.name.fr}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="generation-filter">Génération:</label>
          <select
            id="generation-filter"
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
          >
            <option value="">Toutes les générations</option>
            {generations.map(gen => (
              <option key={gen} value={gen}>
                Génération {gen}
              </option>
            ))}
          </select>
        </div>
        
        <button onClick={handleSearch} className="search-button">Rechercher</button>
        <button onClick={resetFilters} className="reset-button">Réinitialiser</button>
      </div>
      
      {loading && <div>Chargement des résultats...</div>}
      
      <div className="pokemon-grid">
        {pokemons.map(pokemon => (
          <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className="pokemon-card-link">
            <div className="pokemon-card-mini">
              <img src={pokemon.image} alt={pokemon.name.fr} />
              <div className="pokemon-info-mini">
                <span className="pokemon-id">#{pokemon.id}</span>
                <h3>{pokemon.name.fr}</h3>
                <div className="pokemon-types-mini">
                  {pokemon.types.map(typeId => {
                    const typeInfo = types.find(t => t.id === typeId);
                    return typeInfo ? (
                      <img 
                        key={typeId}
                        src={typeInfo.image} 
                        alt={typeInfo.name.fr}
                        title={typeInfo.name.fr}
                        className="type-icon"
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {pokemons.length === 0 && !loading && (
        <div className="no-results">Aucun Pokémon ne correspond à votre recherche</div>
      )}
    </div>
  );
};

export default PokeList;