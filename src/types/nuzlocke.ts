export interface NuzlockeRun {
  id: string
  userId: string
  name: string
  gameName: string
  isRandomizer: boolean
  isHardcore: boolean
  speciesClause: boolean
  setMode: boolean
  noItemsBattle: boolean
  partnerUserId?: string
  partnerRunId?: string
  status: 'active' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface PokemonEncounter {
  id: string
  runId: string
  userId: string
  nickname: string
  speciesName: string
  originalSpecies?: string // for randomizers
  levelCaught: number
  currentLevel: number
  location: string
  status: 'alive' | 'dead' | 'released'
  deathCause?: string
  deathLocation?: string
  isStarter: boolean
  partnerPokemonId?: string // linked soullink pokemon
  caughtAt: string
  diedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Location {
  id: string
  runId: string
  userId: string
  name: string
  isUsed: boolean
  pokemonId?: string
  createdAt: string
  updatedAt: string
}

export interface ActivityLogEntry {
  id: string
  runId: string
  userId: string
  activityType: 'caught' | 'died' | 'evolved' | 'leveled' | 'released'
  pokemonId?: string
  description: string
  location?: string
  createdAt: string
}

export interface PartnerConnection {
  id: string
  user1Id: string
  user2Id: string
  run1Id: string
  run2Id: string
  status: 'pending' | 'active' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface NuzlockeStats {
  totalCaught: number
  totalDeaths: number
  currentTeamSize: number
  locationsUsed: number
  totalLocations: number
  runDuration: string
}