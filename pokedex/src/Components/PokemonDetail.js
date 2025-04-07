import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../API/API';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [types, setTypes] = useState([]);
  const [evolutions, setEvolutions] = useState([]);
  const [preEvolutions, setPreEvolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('regular'); // 'regular' ou 'shiny'
  
  const api = new API();
  
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        
        // Convertir l'ID en nombre si c'est une chaîne
        const pokemonId = parseInt(id);
        
        // Récupérer les données du Pokémon
        const pokemonData = await api.getPokemonById(pokemonId);
        if (!pokemonData) {
          throw new Error('Pokémon non trouvé');
        }
        
        setPokemon(pokemonData);
        
        // Récupérer les détails des types
        const typesDetails = await api.getPokemonTypesDetails(pokemonData);
        setTypes(typesDetails);
        
        // Récupérer les évolutions
        const evolutionsData = await api.getPokemonEvolutions(pokemonData);
        setEvolutions(evolutionsData);
        
        // Récupérer les pré-évolutions
        const preEvolutionsData = await api.getPokemonPreEvolutions(pokemonData);
        setPreEvolutions(preEvolutionsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des détails du Pokémon:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPokemonDetails();
  }, [id]);
  
  if (loading) return <div className="loading">Chargement des données...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (!pokemon) return <div className="not-found">Pokémon non trouvé</div>;
  
  return (
    <div className="pokemon-detail-container">
      <div className="pokemon-detail-header">
        <div className="pokemon-navigation">
          {pokemon.id > 1 && (
            <Link to={`/pokemon/${pokemon.id - 1}`} className="nav-button prev">
              &lt; #{pokemon.id - 1}
            </Link>
          )}
          <Link to="/" className="back-to-list">
            Retour à la liste
          </Link>
          <Link to={`/pokemon/${pokemon.id + 1}`} className="nav-button next">
            #{pokemon.id + 1} &gt;
          </Link>
        </div>
        
        <h1 className="pokemon-name">
          <span className="pokemon-id">#{pokemon.id}</span> {pokemon.name.fr}
          <span className="pokemon-name-en">({pokemon.name.en})</span>
        </h1>
      </div>
      
      <div className="pokemon-detail-content">
        <div className="pokemon-image-section">
          <div className="pokemon-image-container">
            <img 
              src={activeImage === 'regular' ? pokemon.image : pokemon.image_shiny} 
              alt={`${pokemon.name.fr} ${activeImage === 'shiny' ? '(Shiny)' : ''}`}
              className="pokemon-image"
            />
          </div>
          <div className="image-toggle">
            <button 
              className={`toggle-button ${activeImage === 'regular' ? 'active' : ''}`}
              onClick={() => setActiveImage('regular')}
            >
              Normal
            </button>
            <button 
              className={`toggle-button ${activeImage === 'shiny' ? 'active' : ''}`}
              onClick={() => setActiveImage('shiny')}
            >
              Shiny
            </button>
          </div>
        </div>
        
        <div className="pokemon-info-section">
          <div className="pokemon-basic-info">
            <div className="info-group">
              <label>Génération:</label>
              <span>{pokemon.generation}</span>
            </div>
            <div className="info-group">
              <label>Taille:</label>
              <span>{pokemon.height} m</span>
            </div>
            <div className="info-group">
              <label>Poids:</label>
              <span>{pokemon.weight} kg</span>
            </div>
          </div>
          
          <div className="pokemon-types-container">
            <h3>Types</h3>
            <div className="pokemon-types">
              {types.map(type => (
                <div key={type.id} className="type-badge">
                  <img src={type.image} alt={type.name.fr} className="type-icon" />
                  <span>{type.name.fr}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pokemon-stats-container">
            <h3>Statistiques</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">HP</span>
                <div className="stat-bar-container">
                  <div className="stat-bar hp" style={{ width: `${(pokemon.stats.hp / 255) * 100}%` }}></div>
                </div>
                <span className="stat-value">{pokemon.stats.hp}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Attaque</span>
                <div className="stat-bar-container">
                  <div className="stat-bar atk" style={{ width: `${(pokemon.stats.atk / 255) * 100}%` }}></div>
                </div>
                <span className="stat-value">{pokemon.stats.atk}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Défense</span>
                <div className="stat-bar-container">
                  <div className="stat-bar def" style={{ width: `${(pokemon.stats.def / 255) * 100}%` }}></div>
                </div>
                <span className="stat-value">{pokemon.stats.def}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Att. Spé</span>
                <div className="stat-bar-container">
                  <div className="stat-bar spa" style={{ width: `${(pokemon.stats.spe_atk / 255) * 100}%` }}></div>
                </div>
                <span className="stat-value">{pokemon.stats.spe_atk}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Déf. Spé</span>
                <div className="stat-bar-container">
                  <div className="stat-bar spd" style={{ width: `${(pokemon.stats.spe_def / 255) * 100}%` }}></div>
                </div>
                <span className="stat-value">{pokemon.stats.spe_def}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vitesse</span>
                <div className="stat-bar-container">
                  <div className="stat-bar spe" style={{ width: `${(pokemon.stats.vit / 255) * 100}%` }}></div>
                </div>
                <span className="stat-value">{pokemon.stats.vit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pokemon-evolution-section">
        <h3>Évolutions</h3>
        
        {preEvolutions.length > 0 && (
          <div className="pre-evolutions">
            <h4>Pré-évolutions</h4>
            <div className="evolution-chain">
              {preEvolutions.map((prevo, index) => (
                <div key={prevo.id} className="evolution-item">
                  <Link to={`/pokemon/${prevo.id}`} className="evolution-link">
                    <img src={prevo.image} alt={prevo.name.fr} className="evolution-image" />
                    <div className="evolution-info">
                      <span className="evolution-id">#{prevo.id}</span>
                      <span className="evolution-name">{prevo.name.fr}</span>
                    </div>
                  </Link>
                  {index < preEvolutions.length - 1 && <span className="evolution-arrow">→</span>}
                </div>
              ))}
              {preEvolutions.length > 0 && (
                <>
                  <span className="evolution-arrow">→</span>
                  <div className="evolution-item current">
                    <img src={pokemon.image} alt={pokemon.name.fr} className="evolution-image" />
                    <div className="evolution-info">
                      <span className="evolution-id">#{pokemon.id}</span>
                      <span className="evolution-name">{pokemon.name.fr}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {evolutions.length > 0 && (
          <div className="next-evolutions">
            <h4>Prochaines évolutions</h4>
            <div className="evolution-chain">
              <div className="evolution-item current">
                <img src={pokemon.image} alt={pokemon.name.fr} className="evolution-image" />
                <div className="evolution-info">
                  <span className="evolution-id">#{pokemon.id}</span>
                  <span className="evolution-name">{pokemon.name.fr}</span>
                </div>
              </div>
              
              {evolutions.map((evo, index) => (
                <React.Fragment key={evo.pokemon.id}>
                  <div className="evolution-connection">
                    <span className="evolution-arrow">→</span>
                    <span className="evolution-condition">{evo.condition}</span>
                  </div>
                  <div className="evolution-item">
                    <Link to={`/pokemon/${evo.pokemon.id}`} className="evolution-link">
                      <img src={evo.pokemon.image} alt={evo.pokemon.name.fr} className="evolution-image" />
                      <div className="evolution-info">
                        <span className="evolution-id">#{evo.pokemon.id}</span>
                        <span className="evolution-name">{evo.pokemon.name.fr}</span>
                      </div>
                    </Link>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {preEvolutions.length === 0 && evolutions.length === 0 && (
          <p className="no-evolutions">Ce Pokémon n'évolue pas</p>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;