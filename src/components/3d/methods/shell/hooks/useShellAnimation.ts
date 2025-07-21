import { useState, useEffect } from 'react'
import { evalFn3D } from '../../../../utils/mathUtils'
import { SHELL_PHASES } from '../config'
import type { ShellData } from '../types'
import { calculatePartialShellVolume } from '../utils/volumeCalculator'

export const useShellAnimation = (
    userFn: string,
    lowerBound: number,
    upperBound: number,
    showShells: boolean
) => {
    const [shells, setShells] = useState<ShellData[]>([])
    const [visibleShells, setVisibleShells] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [currentVolume, setCurrentVolume] = useState(0)

    // Reset when showShells changes
    useEffect(() => {
        if (!showShells) {
            setShells([])
            setVisibleShells(0)
            setPhase(0)
            setIsComplete(false)
            setCurrentVolume(0)
        }
    }, [showShells])

    // Animation update function - follows washer method pattern
    const updateAnimation = () => {
        if (!showShells || isComplete) return

        const currentPhase = SHELL_PHASES[phase]
        const newShells: ShellData[] = []
        
        try {
            // Generate shells dynamically for shell method
            // For shell method: each shell is at x-coordinate, with radius=|x| and height=f(x)
            for (let x = lowerBound; x <= upperBound; x += currentPhase.stepSize) {
                const height = Math.abs(evalFn3D(userFn, x))
                const radius = Math.abs(x) // For shell method, radius = distance from y-axis = |x|
                const thickness = currentPhase.stepSize
                
                // Only create shell if meaningful dimensions
                if (radius > 0.01 && height > 0.01) {
                    newShells.push({
                        position: [x, 0, 0] as [number, number, number], // Position at x-coordinate
                        rotation: [0, 0, 0] as [number, number, number],
                        radius,
                        height,
                        thickness
                    })
                }
            }
            
            // Update shells state
            setShells(newShells)
            
            // Calculate volume for current visible shells
            if (newShells.length > 0) {
                const visibleCount = Math.floor(visibleShells)
                if (visibleCount > 0 && visibleCount <= newShells.length) {
                    const currentX = lowerBound + ((upperBound - lowerBound) * visibleCount) / newShells.length
                    setCurrentVolume(calculatePartialShellVolume(userFn, lowerBound, currentX, currentPhase.stepSize))
                }
            }
        } catch (e) {
            console.warn('Shell animation error:', e)
        }

        // Progress animation
        if (visibleShells < newShells.length) {
            setVisibleShells(prev => prev + currentPhase.speed)
        } else if (phase < SHELL_PHASES.length - 1) {
            setVisibleShells(0)
            setPhase(prev => prev + 1)
        } else {
            setIsComplete(true)
        }
    }

    return {
        shells,
        visibleShells,
        currentVolume,
        updateAnimation
    }
} 