declare module '*.css' {
    const content: { [className: string]: string }
    export default content
}

declare module 'katex/dist/katex.css'

interface VolumeWindowProps {
    volumes: number[];      // Array of volumes for each phase
    currentPhase: number;   // Current phase of animation
    maxPhases: number;      // Total number of phases
}