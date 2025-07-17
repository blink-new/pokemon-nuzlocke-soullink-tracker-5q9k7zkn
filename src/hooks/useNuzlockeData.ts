import { useState, useEffect } from 'react'
import { PokemonEncounter, Location, ActivityLogEntry, NuzlockeRun, NuzlockeStats } from '../types/nuzlocke'

// Mock data for development - will be replaced with real database calls
const mockRun: NuzlockeRun = {
  id: 'run_1',
  userId: 'user_1',
  name: 'Pokemon Emerald Randomizer',
  gameName: 'Pokemon Emerald',
  isRandomizer: true,
  isHardcore: true,
  speciesClause: true,
  setMode: true,
  noItemsBattle: false,
  partnerUserId: 'partner_1',
  partnerRunId: 'run_2',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const mockPokemon: PokemonEncounter[] = [
  {
    id: 'poke_1',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Sparky',
    speciesName: 'Pikachu',
    originalSpecies: 'Zigzagoon',
    levelCaught: 3,
    currentLevel: 25,
    location: 'Route 101',
    status: 'alive',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'poke_2',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Blaze',
    speciesName: 'Torchic',
    originalSpecies: 'Torchic',
    levelCaught: 5,
    currentLevel: 28,
    location: 'Prof. Birch',
    status: 'alive',
    isStarter: true,
    caughtAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'poke_3',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Rocky',
    speciesName: 'Geodude',
    originalSpecies: 'Poochyena',
    levelCaught: 4,
    currentLevel: 22,
    location: 'Route 102',
    status: 'alive',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'poke_4',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Aqua',
    speciesName: 'Tentacool',
    originalSpecies: 'Wingull',
    levelCaught: 6,
    currentLevel: 20,
    location: 'Route 103',
    status: 'alive',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'poke_5',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Leafy',
    speciesName: 'Oddish',
    originalSpecies: 'Ralts',
    levelCaught: 7,
    currentLevel: 19,
    location: 'Route 117',
    status: 'alive',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'poke_6',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Flappy',
    speciesName: 'Zubat',
    originalSpecies: 'Zubat',
    levelCaught: 8,
    currentLevel: 24,
    location: 'Granite Cave',
    status: 'alive',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Dead Pokemon
  {
    id: 'poke_7',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Shellbert',
    speciesName: 'Wartortle',
    originalSpecies: 'Squirtle',
    levelCaught: 5,
    currentLevel: 32,
    location: 'Prof. Birch',
    status: 'dead',
    deathCause: "Norman's Slaking",
    deathLocation: 'Petalburg Gym',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    diedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'poke_8',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Buzzy',
    speciesName: 'Beedrill',
    originalSpecies: 'Weedle',
    levelCaught: 3,
    currentLevel: 18,
    location: 'Petalburg Woods',
    status: 'dead',
    deathCause: 'Wild Manectric',
    deathLocation: 'Route 118',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    diedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'poke_9',
    runId: 'run_1',
    userId: 'user_1',
    nickname: 'Digger',
    speciesName: 'Sandshrew',
    originalSpecies: 'Sandshrew',
    levelCaught: 12,
    currentLevel: 15,
    location: 'Route 111',
    status: 'dead',
    deathCause: 'Rival Battle',
    deathLocation: 'Route 110',
    isStarter: false,
    caughtAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    diedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
]

const mockLocations: Location[] = [
  { id: 'loc_1', runId: 'run_1', userId: 'user_1', name: 'Route 101', isUsed: true, pokemonId: 'poke_1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_2', runId: 'run_1', userId: 'user_1', name: 'Route 102', isUsed: true, pokemonId: 'poke_3', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_3', runId: 'run_1', userId: 'user_1', name: 'Route 103', isUsed: true, pokemonId: 'poke_4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_4', runId: 'run_1', userId: 'user_1', name: 'Petalburg Woods', isUsed: true, pokemonId: 'poke_8', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_5', runId: 'run_1', userId: 'user_1', name: 'Route 104', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_6', runId: 'run_1', userId: 'user_1', name: 'Route 105', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_7', runId: 'run_1', userId: 'user_1', name: 'Granite Cave', isUsed: true, pokemonId: 'poke_6', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_8', runId: 'run_1', userId: 'user_1', name: 'Route 117', isUsed: true, pokemonId: 'poke_5', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_9', runId: 'run_1', userId: 'user_1', name: 'Route 111', isUsed: true, pokemonId: 'poke_9', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_10', runId: 'run_1', userId: 'user_1', name: 'Route 118', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_11', runId: 'run_1', userId: 'user_1', name: 'Route 119', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_12', runId: 'run_1', userId: 'user_1', name: 'Route 120', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_13', runId: 'run_1', userId: 'user_1', name: 'Safari Zone', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'loc_14', runId: 'run_1', userId: 'user_1', name: 'Victory Road', isUsed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
]

const mockActivity: ActivityLogEntry[] = [
  {
    id: 'act_1',
    runId: 'run_1',
    userId: 'user_1',
    activityType: 'caught',
    pokemonId: 'poke_1',
    description: 'Caught Sparky (Pikachu) at Route 101',
    location: 'Route 101',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'act_2',
    runId: 'run_1',
    userId: 'user_1',
    activityType: 'died',
    pokemonId: 'poke_7',
    description: "Shellbert (Wartortle) died to Norman's Slaking",
    location: 'Petalburg Gym',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'act_3',
    runId: 'run_1',
    userId: 'user_1',
    activityType: 'caught',
    pokemonId: 'poke_3',
    description: 'Partner caught Geodude at Granite Cave',
    location: 'Granite Cave',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
]

export const useNuzlockeData = () => {
  const [currentRun, setCurrentRun] = useState<NuzlockeRun | null>(null)
  const [pokemon, setPokemon] = useState<PokemonEncounter[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [activity, setActivity] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCurrentRun(mockRun)
      setPokemon(mockPokemon)
      setLocations(mockLocations)
      setActivity(mockActivity)
      setLoading(false)
    }, 1000)
  }, [])

  const alivePokemon = pokemon.filter(p => p.status === 'alive')
  const deadPokemon = pokemon.filter(p => p.status === 'dead')
  const usedLocations = locations.filter(l => l.isUsed)

  const stats: NuzlockeStats = {
    totalCaught: pokemon.length,
    totalDeaths: deadPokemon.length,
    currentTeamSize: alivePokemon.length,
    locationsUsed: usedLocations.length,
    totalLocations: locations.length,
    runDuration: '5 days'
  }

  const addPokemon = (newPokemon: Omit<PokemonEncounter, 'id' | 'createdAt' | 'updatedAt'>) => {
    const pokemon: PokemonEncounter = {
      ...newPokemon,
      id: `poke_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setPokemon(prev => [...prev, pokemon])
    
    // Add activity log
    const activityEntry: ActivityLogEntry = {
      id: `act_${Date.now()}`,
      runId: pokemon.runId,
      userId: pokemon.userId,
      activityType: 'caught',
      pokemonId: pokemon.id,
      description: `Caught ${pokemon.nickname} (${pokemon.speciesName}) at ${pokemon.location}`,
      location: pokemon.location,
      createdAt: new Date().toISOString()
    }
    setActivity(prev => [activityEntry, ...prev])
    
    // Update location
    setLocations(prev => prev.map(loc => 
      loc.name === pokemon.location 
        ? { ...loc, isUsed: true, pokemonId: pokemon.id, updatedAt: new Date().toISOString() }
        : loc
    ))
  }

  const killPokemon = (pokemonId: string, deathCause: string, deathLocation: string) => {
    setPokemon(prev => prev.map(p => 
      p.id === pokemonId 
        ? { 
            ...p, 
            status: 'dead' as const, 
            deathCause, 
            deathLocation, 
            diedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : p
    ))
    
    const pokemon = pokemon.find(p => p.id === pokemonId)
    if (pokemon) {
      const activityEntry: ActivityLogEntry = {
        id: `act_${Date.now()}`,
        runId: pokemon.runId,
        userId: pokemon.userId,
        activityType: 'died',
        pokemonId: pokemon.id,
        description: `${pokemon.nickname} (${pokemon.speciesName}) died to ${deathCause}`,
        location: deathLocation,
        createdAt: new Date().toISOString()
      }
      setActivity(prev => [activityEntry, ...prev])
    }
  }

  const updatePokemonLevel = (pokemonId: string, newLevel: number) => {
    setPokemon(prev => prev.map(p => 
      p.id === pokemonId 
        ? { ...p, currentLevel: newLevel, updatedAt: new Date().toISOString() }
        : p
    ))
  }

  return {
    currentRun,
    pokemon,
    alivePokemon,
    deadPokemon,
    locations,
    activity,
    stats,
    loading,
    addPokemon,
    killPokemon,
    updatePokemonLevel
  }
}