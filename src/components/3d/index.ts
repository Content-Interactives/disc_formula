// Main 3D visualization entry point
export { default as Plot3D } from './Plot3D'

// Core infrastructure
export { default as Scene } from './core/Scene'
export { default as Axis } from './Axis'

// Visualization management
export { default as VisualizationManager } from './VisualizationManager'

// Method implementations (from modular folders)
export { DiscMethod } from './methods/disc'
export { WasherMethod } from './methods/washer'  
export { ShellMethod } from './methods/shell'

// Hooks and utilities
export { useMethodConfig } from './hooks/useMethodConfig'

// Configuration and types
export type { MethodType, MethodConfig } from './config/methodConfig'
export { METHOD_CONFIGS } from './config/methodConfig' 