import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { AddPokemonDialog } from './components/AddPokemonDialog'
import { PokemonDeathDialog } from './components/PokemonDeathDialog'
import { useNuzlockeData } from './hooks/useNuzlockeData'
import { PokemonEncounter } from './types/nuzlocke'
import { getPokemonByName, getTypeColor } from './data/pokemon'
import { 
  Users, 
  Plus, 
  Zap, 
  Heart, 
  Skull, 
  MapPin, 
  Settings, 
  BarChart3,
  Link2,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddPokemon, setShowAddPokemon] = useState(false)
  const [showDeathDialog, setShowDeathDialog] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonEncounter | null>(null)
  
  const nuzlockeData = useNuzlockeData()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Pokemon Nuzlocke Soullink Tracker</CardTitle>
            <CardDescription>
              Track your Nuzlocke runs with linked partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar className="border-r border-border">
            <SidebarContent className="p-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Nuzlocke Tracker</h2>
                <p className="text-sm text-muted-foreground">Welcome, {user.displayName || user.email}</p>
              </div>
              
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button
                  variant={activeTab === 'team' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('team')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Current Team
                </Button>
                
                <Button
                  variant={activeTab === 'graveyard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('graveyard')}
                >
                  <Skull className="mr-2 h-4 w-4" />
                  Graveyard
                </Button>
                
                <Button
                  variant={activeTab === 'locations' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('locations')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Locations
                </Button>
                
                <Button
                  variant={activeTab === 'partner' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('partner')}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Soullink Partner
                </Button>
                
                <Button
                  variant={activeTab === 'rules' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('rules')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Rules & Settings
                </Button>
              </nav>
              
              <div className="mt-auto pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => blink.auth.logout()}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <h1 className="text-3xl font-bold text-foreground">
                    {activeTab === 'dashboard' && 'Dashboard'}
                    {activeTab === 'team' && 'Current Team'}
                    {activeTab === 'graveyard' && 'Graveyard'}
                    {activeTab === 'locations' && 'Locations'}
                    {activeTab === 'partner' && 'Soullink Partner'}
                    {activeTab === 'rules' && 'Rules & Settings'}
                  </h1>
                </div>
                
                {activeTab === 'team' && (
                  <Button onClick={() => setShowAddPokemon(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pokemon
                  </Button>
                )}
              </div>

              {activeTab === 'dashboard' && <DashboardContent data={nuzlockeData} />}
              {activeTab === 'team' && <TeamContent data={nuzlockeData} onKillPokemon={(pokemon) => {
                setSelectedPokemon(pokemon)
                setShowDeathDialog(true)
              }} />}
              {activeTab === 'graveyard' && <GraveyardContent data={nuzlockeData} />}
              {activeTab === 'locations' && <LocationsContent data={nuzlockeData} />}
              {activeTab === 'partner' && <PartnerContent data={nuzlockeData} />}
              {activeTab === 'rules' && <RulesContent data={nuzlockeData} />}
            </div>
          </main>
        </div>
      </SidebarProvider>
      
      <AddPokemonDialog
        open={showAddPokemon}
        onOpenChange={setShowAddPokemon}
        onAddPokemon={nuzlockeData.addPokemon}
        locations={nuzlockeData.locations}
        runId={nuzlockeData.currentRun?.id || ''}
        userId={user?.id || ''}
      />
      
      <PokemonDeathDialog
        open={showDeathDialog}
        onOpenChange={setShowDeathDialog}
        pokemon={selectedPokemon}
        onConfirmDeath={nuzlockeData.killPokemon}
      />
    </div>
  )
}

function DashboardContent({ data }: { data: ReturnType<typeof useNuzlockeData> }) {
  const { stats, currentRun, activity, loading } = data

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pokemon</CardTitle>
            <Heart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentTeamSize}</div>
            <p className="text-xs text-muted-foreground">Current team size</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deaths</CardTitle>
            <Skull className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeaths}</div>
            <p className="text-xs text-muted-foreground">Pokemon lost</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locationsUsed}/{stats.totalLocations}</div>
            <p className="text-xs text-muted-foreground">Encounters used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Run Duration</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.runDuration}</div>
            <p className="text-xs text-muted-foreground">Time elapsed</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Run Info */}
      {currentRun && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Current Run: {currentRun.name}
            </CardTitle>
            <CardDescription>
              {currentRun.partnerUserId ? 'Soullink run with partner • ' : ''}
              {currentRun.isHardcore ? 'Hardcore rules enabled' : 'Standard rules'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentRun.isRandomizer && <Badge variant="outline">Randomizer</Badge>}
              {currentRun.isHardcore && <Badge variant="outline">Hardcore</Badge>}
              {currentRun.speciesClause && <Badge variant="outline">Species Clause</Badge>}
              {currentRun.setMode && <Badge variant="outline">Set Mode</Badge>}
              {currentRun.noItemsBattle && <Badge variant="outline">No Items</Badge>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              activity.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.activityType === 'caught' ? 'bg-green-500' :
                    entry.activityType === 'died' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-sm">{entry.description}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeamContent({ 
  data, 
  onKillPokemon 
}: { 
  data: ReturnType<typeof useNuzlockeData>
  onKillPokemon: (pokemon: PokemonEncounter) => void 
}) {
  const { alivePokemon, loading } = data

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {alivePokemon.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pokemon in your team</h3>
            <p className="text-muted-foreground mb-4">Start catching Pokemon to build your team!</p>
            <Button onClick={() => {}}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Pokemon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alivePokemon.map((pokemon) => {
            const pokemonData = getPokemonByName(pokemon.speciesName)
            
            return (
              <Card key={pokemon.id} className="relative group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pokemon.nickname}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Lv. {pokemon.currentLevel}</Badge>
                      {pokemon.isStarter && (
                        <Badge variant="outline" className="text-xs">Starter</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {pokemon.speciesName}
                    {pokemon.originalSpecies && pokemon.originalSpecies !== pokemon.speciesName && (
                      <span className="text-muted-foreground"> (was {pokemon.originalSpecies})</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pokemonData && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={pokemonData.imageUrl} 
                          alt={pokemon.speciesName}
                          className="w-8 h-8"
                        />
                        <div className="flex gap-1">
                          {pokemonData.types.map((type, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                backgroundColor: getTypeColor(type) + '20',
                                borderColor: getTypeColor(type),
                                color: getTypeColor(type)
                              }}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>Caught at {pokemon.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Alive</span>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onKillPokemon(pokemon)}
                      >
                        <Skull className="h-3 w-3 mr-1" />
                        Death
                      </Button>
                    </div>
                    
                    {pokemon.levelCaught !== pokemon.currentLevel && (
                      <div className="text-xs text-muted-foreground">
                        Caught at level {pokemon.levelCaught} • Gained {pokemon.currentLevel - pokemon.levelCaught} levels
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GraveyardContent({ data }: { data: ReturnType<typeof useNuzlockeData> }) {
  const { deadPokemon, loading } = data

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 bg-muted rounded w-24 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skull className="h-5 w-5 text-red-500" />
            Fallen Heroes ({deadPokemon.length})
          </CardTitle>
          <CardDescription>Pokemon that have fallen in battle</CardDescription>
        </CardHeader>
        <CardContent>
          {deadPokemon.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No casualties yet</h3>
              <p className="text-muted-foreground">Your Pokemon are all safe and sound!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deadPokemon.map((pokemon) => {
                const pokemonData = getPokemonByName(pokemon.speciesName)
                
                return (
                  <div key={pokemon.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {pokemonData && (
                        <img 
                          src={pokemonData.imageUrl} 
                          alt={pokemon.speciesName}
                          className="w-10 h-10 opacity-60"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-red-900 dark:text-red-100">
                          {pokemon.nickname} ({pokemon.speciesName})
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                          <span>Level {pokemon.currentLevel}</span>
                          {pokemon.originalSpecies && pokemon.originalSpecies !== pokemon.speciesName && (
                            <span>• Originally {pokemon.originalSpecies}</span>
                          )}
                          {pokemon.isStarter && (
                            <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                              Starter
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Caught at {pokemon.location} • Level {pokemon.levelCaught}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Killed by {pokemon.deathCause}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-500">
                        {pokemon.deathLocation}
                      </p>
                      {pokemon.diedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(pokemon.diedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LocationsContent({ data }: { data: ReturnType<typeof useNuzlockeData> }) {
  const { locations, pokemon, loading } = data

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-5 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usedLocations = locations.filter(loc => loc.isUsed)
  const availableLocations = locations.filter(loc => !loc.isUsed)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Available areas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{usedLocations.length}</div>
            <p className="text-xs text-muted-foreground">Encounters claimed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{availableLocations.length}</div>
            <p className="text-xs text-muted-foreground">Ready to explore</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Encounter Locations</CardTitle>
          <CardDescription>Track your encounters across different areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((location) => {
              const locationPokemon = location.pokemonId 
                ? pokemon.find(p => p.id === location.pokemonId)
                : null

              return (
                <div 
                  key={location.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    location.isUsed 
                      ? 'border-green-500/50 bg-green-500/5' 
                      : 'border-border hover:border-blue-500/50 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{location.name}</h3>
                    <Badge variant={location.isUsed ? 'default' : 'secondary'}>
                      {location.isUsed ? 'Used' : 'Available'}
                    </Badge>
                  </div>
                  
                  {locationPokemon && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        locationPokemon.status === 'alive' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <p className="text-sm text-muted-foreground">
                        {locationPokemon.nickname} ({locationPokemon.speciesName})
                        {locationPokemon.status === 'dead' && (
                          <span className="text-red-500 ml-1">† Deceased</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {!location.isUsed && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Ready for encounter
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PartnerContent({ data }: { data: ReturnType<typeof useNuzlockeData> }) {
  const { currentRun, alivePokemon, loading } = data

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasPartner = currentRun?.partnerUserId

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-accent" />
            Soullink Partner
          </CardTitle>
          <CardDescription>
            {hasPartner ? 'Connected with your Nuzlocke partner' : 'Set up a soullink connection'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasPartner ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Partner Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect with a friend to start a soullink run where your Pokemon are linked together!
              </p>
              <Button>
                <Link2 className="mr-2 h-4 w-4" />
                Connect Partner
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-medium">Partner: TrainerAlex</h3>
                  <p className="text-sm text-muted-foreground">Pokemon Ruby Randomizer</p>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Soullink Rules</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>If one Pokemon dies, both linked Pokemon die</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-blue-500" />
                    <span>Pokemon are linked based on encounter order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Communication and coordination allowed</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Your Team & Partner Links</h4>
                <div className="grid grid-cols-1 gap-2">
                  {alivePokemon.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No Pokemon in your team yet</p>
                  ) : (
                    alivePokemon.map((pokemon, index) => (
                      <div key={pokemon.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <span className="font-medium">{pokemon.nickname}</span>
                            <span className="text-muted-foreground ml-2">({pokemon.speciesName})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link2 className="h-3 w-3" />
                          <span>Partner's #{index + 1}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RulesContent({ data }: { data: ReturnType<typeof useNuzlockeData> }) {
  const { currentRun, loading } = data

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 mb-3"></div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-3 bg-muted rounded w-32"></div>
                      <div className="h-5 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentRun) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Run</h3>
            <p className="text-muted-foreground">Start a new Nuzlocke run to configure rules</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Nuzlocke Rules
          </CardTitle>
          <CardDescription>Current rules for {currentRun.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-base">Core Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">Pokemon faint = death</span>
                    <Badge variant="default">Always Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">One catch per area</span>
                    <Badge variant="default">Always Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">Nickname all Pokemon</span>
                    <Badge variant="default">Always Active</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-base">Optional Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">Species Clause</span>
                    <Badge variant={currentRun.speciesClause ? "default" : "secondary"}>
                      {currentRun.speciesClause ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">Set Battle Mode</span>
                    <Badge variant={currentRun.setMode ? "default" : "secondary"}>
                      {currentRun.setMode ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">No Items in Battle</span>
                    <Badge variant={currentRun.noItemsBattle ? "default" : "secondary"}>
                      {currentRun.noItemsBattle ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">Hardcore Mode</span>
                    <Badge variant={currentRun.isHardcore ? "default" : "secondary"}>
                      {currentRun.isHardcore ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {currentRun.partnerUserId && (
              <div className="space-y-3">
                <h4 className="font-medium text-base">Soullink Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent/10">
                    <span className="text-sm">Linked deaths (if one dies, both die)</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent/10">
                    <span className="text-sm">Same encounter order</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent/10">
                    <span className="text-sm">Communication allowed</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            )}
            
            {currentRun.isRandomizer && (
              <div className="space-y-3">
                <h4 className="font-medium text-base">Randomizer Settings</h4>
                <div className="p-4 border border-accent/30 bg-accent/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="font-medium text-sm">Randomizer Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pokemon species are randomized. Track both original and randomized species.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App