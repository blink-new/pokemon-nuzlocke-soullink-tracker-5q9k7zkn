import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { PokemonEncounter, Location } from '../types/nuzlocke'
import { searchPokemon } from '../data/pokemon'

interface AddPokemonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPokemon: (pokemon: Omit<PokemonEncounter, 'id' | 'createdAt' | 'updatedAt'>) => void
  locations: Location[]
  runId: string
  userId: string
}

export function AddPokemonDialog({ 
  open, 
  onOpenChange, 
  onAddPokemon, 
  locations, 
  runId, 
  userId 
}: AddPokemonDialogProps) {
  const [nickname, setNickname] = useState('')
  const [speciesName, setSpeciesName] = useState('')
  const [originalSpecies, setOriginalSpecies] = useState('')
  const [levelCaught, setLevelCaught] = useState('')
  const [currentLevel, setCurrentLevel] = useState('')
  const [location, setLocation] = useState('')
  const [isStarter, setIsStarter] = useState(false)
  const [speciesSuggestions, setSpeciesSuggestions] = useState<string[]>([])
  const [originalSuggestions, setOriginalSuggestions] = useState<string[]>([])

  const availableLocations = locations.filter(loc => !loc.isUsed)

  const handleSpeciesSearch = (value: string) => {
    setSpeciesName(value)
    if (value.length > 1) {
      const results = searchPokemon(value).slice(0, 5).map(p => p.name)
      setSpeciesSuggestions(results)
    } else {
      setSpeciesSuggestions([])
    }
  }

  const handleOriginalSpeciesSearch = (value: string) => {
    setOriginalSpecies(value)
    if (value.length > 1) {
      const results = searchPokemon(value).slice(0, 5).map(p => p.name)
      setOriginalSuggestions(results)
    } else {
      setOriginalSuggestions([])
    }
  }

  const handleSubmit = () => {
    if (!nickname || !speciesName || !levelCaught || !currentLevel || !location) {
      return
    }

    const newPokemon: Omit<PokemonEncounter, 'id' | 'createdAt' | 'updatedAt'> = {
      runId,
      userId,
      nickname,
      speciesName,
      originalSpecies: originalSpecies || speciesName,
      levelCaught: parseInt(levelCaught),
      currentLevel: parseInt(currentLevel),
      location,
      status: 'alive',
      isStarter,
      caughtAt: new Date().toISOString()
    }

    onAddPokemon(newPokemon)
    
    // Reset form
    setNickname('')
    setSpeciesName('')
    setOriginalSpecies('')
    setLevelCaught('')
    setCurrentLevel('')
    setLocation('')
    setIsStarter(false)
    setSpeciesSuggestions([])
    setOriginalSuggestions([])
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Pokemon</DialogTitle>
          <DialogDescription>
            Add a newly caught Pokemon to your team
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nickname" className="text-right">
              Nickname
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="col-span-3"
              placeholder="Enter nickname"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="species" className="text-right">
              Species
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="species"
                value={speciesName}
                onChange={(e) => handleSpeciesSearch(e.target.value)}
                placeholder="Enter species name"
              />
              {speciesSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-md z-10 max-h-32 overflow-y-auto">
                  {speciesSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                      onClick={() => {
                        setSpeciesName(suggestion)
                        setSpeciesSuggestions([])
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="original" className="text-right">
              Original Species
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="original"
                value={originalSpecies}
                onChange={(e) => handleOriginalSpeciesSearch(e.target.value)}
                placeholder="For randomizers (optional)"
              />
              {originalSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-md z-10 max-h-32 overflow-y-auto">
                  {originalSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                      onClick={() => {
                        setOriginalSpecies(suggestion)
                        setOriginalSuggestions([])
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="levelCaught" className="text-right">
              Level Caught
            </Label>
            <Input
              id="levelCaught"
              type="number"
              value={levelCaught}
              onChange={(e) => setLevelCaught(e.target.value)}
              className="col-span-3"
              placeholder="5"
              min="1"
              max="100"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentLevel" className="text-right">
              Current Level
            </Label>
            <Input
              id="currentLevel"
              type="number"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="col-span-3"
              placeholder="5"
              min="1"
              max="100"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Starter Pokemon
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="starter"
                checked={isStarter}
                onCheckedChange={(checked) => setIsStarter(checked as boolean)}
              />
              <Label htmlFor="starter" className="text-sm">
                This is a starter Pokemon
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!nickname || !speciesName || !levelCaught || !currentLevel || !location}
          >
            Add Pokemon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}