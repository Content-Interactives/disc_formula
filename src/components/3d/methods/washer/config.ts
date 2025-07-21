import type { WasherPhase } from './types'

export const WASHER_PHASES: WasherPhase[] = [
    { stepSize: 0.5, speed: 0.1 },    
    { stepSize: 0.25, speed: 0.2 },     
    { stepSize: 0.12, speed: 0.4 },    
    { stepSize: 0.06, speed: 0.8 },
    { stepSize: 0.03, speed: 1.6 }      
]

export const WASHER_ROTATION_SPEED = 2
export const WASHER_TRAIL_COUNT = 720

// Washer-specific colors
export const WASHER_COLORS = {
    outer: '#FF6B6B',     // Red for outer function
    inner: '#4ECDC4',     // Teal for inner function
    surface: '#FF7F50'    // Coral for final surface
} as const 