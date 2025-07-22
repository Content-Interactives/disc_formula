import { useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { evalFn3D } from '../../../../utils/mathUtils'
import { calculatePartialWasherVolume } from '../utils/volumeCalculator'
import { WASHER_PHASES } from '../config'
import type { WasherData } from '../types'

interface UseWasherAnimationProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
    showWashers: boolean
}

export const useWasherAnimation = ({
    outerFn,
    innerFn,
    lowerBound,
    upperBound,
    showWashers
}: UseWasherAnimationProps) => {
    // Ensure proper bounds order (swap if needed)
    const minBound = Math.min(lowerBound, upperBound)
    const maxBound = Math.max(lowerBound, upperBound)
    
    const [visibleWashers, setVisibleWashers] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [currentVolume, setCurrentVolume] = useState(0)

    // Reset when showWashers changes
    useEffect(() => {
        if (!showWashers) {
            setVisibleWashers(0)
            setPhase(0)
            setIsComplete(false)
            setCurrentVolume(0)
        }
    }, [showWashers])

    // Generate washers for current phase
    const washers = useMemo(() => {
        if (!showWashers) return []
        
        const arr: WasherData[] = []
        const stepSize = WASHER_PHASES[phase]?.stepSize || 0.1
        
        try {
            for (let x = minBound; x <= maxBound; x += stepSize) {
                const func1Value = Math.abs(evalFn3D(outerFn, x))
                const func2Value = Math.abs(evalFn3D(innerFn, x))
                
                const outerRadius = Math.max(func1Value, func2Value)
                const innerRadius = Math.min(func1Value, func2Value)
                
                if (outerRadius - innerRadius > 0.01) {
                    arr.push({
                        position: [x, 0, 0] as [number, number, number],
                        rotation: [0, 0, Math.PI/2] as [number, number, number],
                        outerRadius,
                        innerRadius,
                        height: stepSize
                    })
                }
            }
            return arr
        } catch (e) { 
            return [] 
        }
    }, [outerFn, innerFn, minBound, maxBound, phase, showWashers])

    // Animation frame logic
    useFrame(() => {
        if (showWashers && !isComplete) {
            const currentPhase = WASHER_PHASES[phase]
            
            try {
                // Calculate current volume using washer formula
                if (washers.length > 0) {
                    const currentX = minBound + ((maxBound - minBound) * visibleWashers) / washers.length
                    setCurrentVolume(calculatePartialWasherVolume(outerFn, innerFn, minBound, currentX, currentPhase.stepSize))
                }
            } catch (e) {
                // Handle function evaluation errors
            }

            if (visibleWashers < washers.length) {
                setVisibleWashers(prev => prev + currentPhase.speed)
            } else if (phase < WASHER_PHASES.length - 1) {
                setVisibleWashers(0)
                setPhase(prev => prev + 1)
            } else {
                setIsComplete(true)
            }
        }
    })

    return {
        washers,
        visibleWashers,
        phase,
        isComplete,
        currentVolume
    }
} 