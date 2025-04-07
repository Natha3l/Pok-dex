import React, { useState, useEffect } from 'react';
import API from './API/API';

const PokemonCard = ({ pokemonId }) => {
  const [pokemon, setPokemon] = useState(null);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const api = new API();
  
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        const pokemonData = await api.getPokemonById(pokemonId);
        setPokemon(pokemonData);
        
        if (pokemonData) {
          const typesDetails = await api.getPokemonTypesDetails(pokemonData);
          setTypes(typesDetails);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPokemonData();
  }, [pokemonId]);
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!pokemon) return <div>Aucun Pokémon trouvé</div>;
  
  return (
    <div className="pokemon-card">
      <h2>{pokemon.name.fr} ({pokemon.name.en})</h2>
      <div className="pokemon-images">
        <div>
          <img src={pokemon.image} alt={pokemon.name.fr} />
          <p>Normal</p>
        </div>
        <div>
          <img src={pokemon.image_shiny} alt={`${pokemon.name.fr} (Shiny)`} />
          <p>Shiny</p>
        </div>
      </div>
      
      <div className="pokemon-info">
        <p><strong>ID:</strong> #{pokemon.id}</p>
        <p><strong>Génération:</strong> {pokemon.generation}</p>
        <p><strong>Taille:</strong> {pokemon.height} m</p>
        <p><strong>Poids:</strong> {pokemon.weight} kg</p>
        
        <div className="pokemon-types">
          <strong>Types:</strong>
          <div className="types-list">
            {types.map(type => (
              <div key={type.id} className="type-badge">
                <img src={type.image} alt={type.name.fr} width="20" />
                <span>{type.name.fr}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pokemon-stats">
          <h3>Statistiques</h3>
          <ul>
            <li>HP: {pokemon.stats.hp}</li>
            <li>Attaque: {pokemon.stats.atk}</li>
            <li>Défense: {pokemon.stats.def}</li>
            <li>Att. Spéciale: {pokemon.stats.spe_atk}</li>
            <li>Déf. Spéciale: {pokemon.stats.spe_def}</li>
            <li>Vitesse: {pokemon.stats.vit}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;