class API {
  constructor() {
    this.baseUrl = 'https://pokedex-api.3rgo.tech/api';
    this.typesCache = null;
    this.pokemonCache = null;
  }

  // Méthode utilitaire pour faire des requêtes à l'API
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('La requête a échoué côté API');
      }
      
      return data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des données: ${error.message}`);
      throw error;
    }
  }

  // Récupérer tous les types
  async getTypes() {
    if (this.typesCache) {
      return this.typesCache;
    }
    
    try {
      const types = await this.fetchData('types');
      this.typesCache = types;
      return types;
    } catch (error) {
      console.error('Erreur lors de la récupération des types:', error);
      throw error;
    }
  }

  // Récupérer un type spécifique par ID
  async getTypeById(typeId) {
    try {
      const types = await this.getTypes();
      return types.find(type => type.id === typeId);
    } catch (error) {
      console.error(`Erreur lors de la récupération du type ${typeId}:`, error);
      throw error;
    }
  }

  // Récupérer tous les Pokémon
  async getAllPokemon() {
    if (this.pokemonCache) {
      return this.pokemonCache;
    }
    
    try {
      const pokemon = await this.fetchData('pokemon');
      this.pokemonCache = pokemon;
      return pokemon;
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémon:', error);
      throw error;
    }
  }

  // Récupérer un Pokémon par ID
  async getPokemonById(id) {
    try {
      const allPokemon = await this.getAllPokemon();
      return allPokemon.find(p => p.id === id);
    } catch (error) {
      console.error(`Erreur lors de la récupération du Pokémon ${id}:`, error);
      throw error;
    }
  }

  // Récupérer un Pokémon par nom (français ou anglais)
  async getPokemonByName(name) {
    try {
      const allPokemon = await this.getAllPokemon();
      return allPokemon.find(
        p => p.name.fr.toLowerCase() === name.toLowerCase() || 
             p.name.en.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      console.error(`Erreur lors de la récupération du Pokémon ${name}:`, error);
      throw error;
    }
  }

  // Récupérer les types d'un Pokémon (avec les noms complets et non juste les IDs)
  async getPokemonTypesDetails(pokemon) {
    try {
      if (!pokemon || !pokemon.types) {
        throw new Error('Pokémon invalide ou sans types');
      }

      const allTypes = await this.getTypes();
      const typesDetails = pokemon.types.map(typeId => {
        return allTypes.find(type => type.id === typeId);
      });

      return typesDetails.filter(type => type !== undefined);
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails des types:`, error);
      throw error;
    }
  }

  // Récupérer les évolutions d'un Pokémon
  async getPokemonEvolutions(pokemon) {
    try {
      if (!pokemon || !pokemon.evolvesTo) {
        return [];
      }

      const allPokemon = await this.getAllPokemon();
      const evolutions = [];

      for (const [evolvedId, condition] of Object.entries(pokemon.evolvesTo)) {
        const evolvedPokemon = allPokemon.find(p => p.id === parseInt(evolvedId));
        if (evolvedPokemon) {
          evolutions.push({
            pokemon: evolvedPokemon,
            condition: condition
          });
        }
      }

      return evolutions;
    } catch (error) {
      console.error(`Erreur lors de la récupération des évolutions:`, error);
      throw error;
    }
  }

  // Récupérer les pré-évolutions d'un Pokémon
  async getPokemonPreEvolutions(pokemon) {
    try {
      if (!pokemon || !pokemon.evolvedFrom || pokemon.evolvedFrom.length === 0) {
        return [];
      }

      const allPokemon = await this.getAllPokemon();
      return pokemon.evolvedFrom.map(preEvoId => {
        return allPokemon.find(p => p.id === preEvoId);
      }).filter(p => p !== undefined);
    } catch (error) {
      console.error(`Erreur lors de la récupération des pré-évolutions:`, error);
      throw error;
    }
  }

  // Rechercher des Pokémon par critères
  async searchPokemon(criteria) {
    try {
      let allPokemon = await this.getAllPokemon();
      
      if (criteria.name) {
        const searchName = criteria.name.toLowerCase();
        allPokemon = allPokemon.filter(
          p => p.name.fr.toLowerCase().includes(searchName) || 
               p.name.en.toLowerCase().includes(searchName)
        );
      }
      
      if (criteria.type) {
        const typeId = typeof criteria.type === 'number' ? criteria.type : 
          (await this.getTypes()).find(t => 
            t.name.fr.toLowerCase() === criteria.type.toLowerCase() || 
            t.name.en.toLowerCase() === criteria.type.toLowerCase()
          )?.id;
          
        if (typeId) {
          allPokemon = allPokemon.filter(p => p.types.includes(typeId));
        }
      }
      
      if (criteria.generation) {
        allPokemon = allPokemon.filter(p => p.generation === criteria.generation);
      }

      return allPokemon;
    } catch (error) {
      console.error('Erreur lors de la recherche de Pokémon:', error);
      throw error;
    }
  }
}

export default API;