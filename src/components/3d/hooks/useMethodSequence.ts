import { useState, useCallback } from 'react'
import type { MethodType } from '../config/methodConfig'

interface MethodSequenceState {
    isRotating: boolean
    rotationCompleted: boolean
    showElements: boolean
    canShowElements: boolean
}

export const useMethodSequence = (method: MethodType) => {
    const [sequenceState, setSequenceState] = useState<MethodSequenceState>({
        isRotating: false,
        rotationCompleted: false,
        showElements: false,
        canShowElements: false
    })

    // Start rotation (Show Volume)
    const startRotation = useCallback(() => {
        setSequenceState(prev => ({
            ...prev,
            isRotating: true,
            rotationCompleted: false,
            canShowElements: false
        }))
    }, [])

    // Stop rotation (Hide Volume)
    const stopRotation = useCallback(() => {
        setSequenceState(prev => ({
            ...prev,
            isRotating: false,
            rotationCompleted: false,
            showElements: false,
            canShowElements: false
        }))
    }, [])

    // Called when rotation animation completes
    const onRotationComplete = useCallback(() => {
        setSequenceState(prev => ({
            ...prev,
            isRotating: false,
            rotationCompleted: true,
            canShowElements: true
        }))
    }, [])

    // Toggle elements (discs/washers/shells)
    const toggleElements = useCallback(() => {
        if (!sequenceState.canShowElements) return // Prevent if rotation not complete
        
        setSequenceState(prev => ({
            ...prev,
            showElements: !prev.showElements
        }))
    }, [sequenceState.canShowElements])

    // Reset sequence (when method changes)
    const resetSequence = useCallback(() => {
        setSequenceState({
            isRotating: false,
            rotationCompleted: false,
            showElements: false,
            canShowElements: false
        })
    }, [])

    // Get button states for UI
    const getButtonStates = useCallback(() => {
        return {
            // Show Volume button
            volumeButton: {
                text: sequenceState.isRotating ? 'Hide Volume' : 'Show Volume',
                disabled: false,
                onClick: sequenceState.isRotating ? stopRotation : startRotation
            },
            
            // Show Elements button (Discs/Washers/Shells)
            elementsButton: {
                text: sequenceState.showElements 
                    ? `Hide ${getElementName(method)}` 
                    : `Show ${getElementName(method)}`,
                disabled: !sequenceState.canShowElements,
                onClick: toggleElements,
                tooltip: !sequenceState.canShowElements 
                    ? 'Complete "Show Volume" first' 
                    : undefined
            }
        }
    }, [sequenceState, method, startRotation, stopRotation, toggleElements])

    return {
        // State
        isRotating: sequenceState.isRotating,
        rotationCompleted: sequenceState.rotationCompleted,
        showElements: sequenceState.showElements,
        canShowElements: sequenceState.canShowElements,
        
        // Actions
        onRotationComplete,
        resetSequence,
        
        // UI helpers
        getButtonStates
    }
}

// Helper function to get element names
const getElementName = (method: MethodType): string => {
    switch (method) {
        case 'disc': return 'Discs'
        case 'washer': return 'Washers' 
        case 'shell': return 'Shells'
        default: return 'Elements'
    }
} 