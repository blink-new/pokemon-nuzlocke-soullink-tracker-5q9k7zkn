import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { PokemonEncounter } from '../types/nuzlocke'
import { Skull } from 'lucide-react'

interface PokemonDeathDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pokemon: PokemonEncounter | null
  onConfirmDeath: (pokemonId: string, deathCause: string, deathLocation: string) => void
}

export function PokemonDeathDialog({ 
  open, 
  onOpenChange, 
  pokemon, 
  onConfirmDeath 
}: PokemonDeathDialogProps) {
  const [deathCause, setDeathCause] = useState('')
  const [deathLocation, setDeathLocation] = useState('')

  const handleSubmit = () => {
    if (!pokemon || !deathCause || !deathLocation) {
      return
    }

    onConfirmDeath(pokemon.id, deathCause, deathLocation)
    
    // Reset form
    setDeathCause('')
    setDeathLocation('')
    
    onOpenChange(false)
  }

  if (!pokemon) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <Skull className="h-5 w-5" />
            Pokemon Death
          </DialogTitle>
          <DialogDescription>
            Record the death of {pokemon.nickname} ({pokemon.speciesName})
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Skull className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  {pokemon.nickname}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {pokemon.speciesName} • Level {pokemon.currentLevel}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Caught at {pokemon.location}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deathCause" className="text-right">
              Cause of Death
            </Label>
            <Input
              id="deathCause"
              value={deathCause}
              onChange={(e) => setDeathCause(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Norman's Slaking, Wild Manectric"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deathLocation" className="text-right">
              Location
            </Label>
            <Input
              id="deathLocation"
              value={deathLocation}
              onChange={(e) => setDeathLocation(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Petalburg Gym, Route 118"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit}
            disabled={!deathCause || !deathLocation}
          >
            Confirm Death
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}