import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';

// Composant pour un seul Pokémon dans l'arbre d'évolution
const EvolutionNode = ({ pokemon }) => {
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="evolution-node">
      <img 
        src={pokemon.image} 
        alt={pokemon.name} 
        className="evolution-image" 
      />
      <div className="evolution-name">{pokemon.name}</div>
      <div className="evolution-id">#{pokemon.id.toString().padStart(3, '0')}</div>
    </Link>
  );
};

// Composant pour la condition d'évolution
const EvolutionCondition = ({ condition }) => {
  const { translations } = useContext(LanguageContext);
  
  if (!condition) return <div className="evolution-arrow">→</div>;
  
  return (
    <div className="evolution-condition">
      <div className="evolution-arrow">→</div>
      <div className="condition-details">
        {condition.trigger === 'level-up' && condition.level && (
          <span>{translations.levelUp}: {condition.level}</span>
        )}
        {condition.trigger === 'item' && condition.item && (
          <span>{translations.item}: {condition.item}</span>
        )}
        {condition.trigger === 'trade' && (
          <span>{translations.trade}</span>
        )}
        {condition.trigger === 'other' && (
          <span>{condition.details || translations.specialCondition}</span>
        )}
      </div>
    </div>
  );
};

// Fonction récursive pour construire l'arbre d'évolution
const renderEvolutionChain = (chain) => {
  if (!chain) return null;
  
  return (
    <div className="evolution-chain">
      <EvolutionNode pokemon={chain.species} />
      
      {chain.evolvesTo && chain.evolvesTo.length > 0 && (
        <div className="evolution-branches">
          {chain.evolvesTo.map((evolution, index) => (
            <div key={index} className="evolution-branch">
              <EvolutionCondition condition={evolution.evolutionDetails} />
              <EvolutionNode pokemon={evolution.species} />
              
              {/* Récursion pour les évolutions suivantes */}
              {evolution.evolvesTo && evolution.evolvesTo.length > 0 && (
                <div className="nested-evolutions">
                  {evolution.evolvesTo.map((nestedEvo, nestedIndex) => (
                    <div key={nestedIndex} className="nested-evolution">
                      <EvolutionCondition condition={nestedEvo.evolutionDetails} />
                      <EvolutionNode pokemon={nestedEvo.species} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EvolutionTree = ({ evolutionChain }) => {
  if (!evolutionChain) return null;
  
  return (
    <div className="evolution-tree">
      {renderEvolutionChain(evolutionChain)}
    </div>
  );
};

export default EvolutionTree;