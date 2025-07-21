import { useState, useEffect, useMemo } from 'react'
import { evalFn3D } from '../../../../utils/mathUtils'
import { WASHER_PHASES } from '../config'
import { calculatePartialWasherVolume } from '../utils/volumeCalculator'
import type { WasherData } from '../types'

export const useWasherAnimation = (
    outerFn: string,
    innerFn: string,
    lowerBound: number,
    upperBound: number,
    showWashers: boolean
) => {
    const [visibleWashers, setVisibleWashers] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [currentVolume, setCurrentVolume] = useState(0)

    // Reset when animation stops
    useEffect(() => {
        if (!showWashers) {
            setVisibleWashers(0)
            setPhase(0)
            setIsComplete(false)
            setCurrentVolume(0)
        }
    }, [showWashers])

    // Generate washers for current phase
    const washers = useMemo((): WasherData[] => {
        if (!showWashers) return []
        
        const stepSize = WASHER_PHASES[phase]?.stepSize || 0.2
        const arr: WasherData[] = []
        
        try {
            for (let x = lowerBound; x <= upperBound; x += stepSize) {
                const outerRadius = Math.abs(evalFn3D(outerFn, x))
                const innerRadius = Math.abs(evalFn3D(innerFn, x))
                
                if (outerRadius > innerRadius) {
                    arr.push({
                        position: [x, 0, 0] as [number, number, number],
                        rotation: [0, 0, Math.PI/2] as [number, number, number],
                        outerRadius,
                        innerRadius,
                        height: stepSize
                    })
                }
            }
        } catch (e) { 
            console.warn('Error generating washers:', e)
        }
        return arr
    }, [outerFn, innerFn, lowerBound, upperBound, phase, showWashers])

    // Animation update function
    const updateAnimation = () => {
        if (!showWashers || isComplete) return

        const currentPhase = WASHER_PHASES[phase]
        
        // Update volume calculation less frequently
        if (visibleWashers % 5 === 0) {
            try {
                const currentX = lowerBound + ((upperBound - lowerBound) * visibleWashers) / 50
                setCurrentVolume(calculatePartialWasherVolume(outerFn, innerFn, lowerBound, currentX, currentPhase.stepSize))
            } catch (e) {
                console.warn('Error in washer animation:', e)
            }
        }

        // Progress animation
        if (visibleWashers < 50) {
            setVisibleWashers(prev => prev + currentPhase.speed)
        } else if (phase < WASHER_PHASES.length - 1) {
            setVisibleWashers(0)
            setPhase(prev => prev + 1)
        } else {
            setIsComplete(true)
        }
    }

    return {
        washers,
        visibleWashers,
        currentVolume,
        updateAnimation
    }
} 