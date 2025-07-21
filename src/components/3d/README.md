# 3D Visualization Architecture

## Overview
This directory contains a modular 3D visualization system for mathematical methods (disc, washer, shell). The architecture is designed for easy extension and maintenance.

## Directory Structure

```
3d/
├── index.ts                 # Main exports
├── Plot3D.tsx              # Entry point component
├── VisualizationManager.tsx # Method routing
├── core/
│   └── Scene.tsx           # 3D scene setup (lighting, camera, axes)
├── methods/
│   ├── DiscMethod.tsx      # Disc method implementation
│   ├── WasherMethod.tsx    # Washer method (placeholder)
│   └── ShellMethod.tsx     # Shell method (placeholder)
├── config/
│   └── methodConfig.ts     # Method types and configurations
└── [individual components] # RotateX, DiscAnimation, etc.
```

## Architecture Layers

### 1. Core Layer (`core/`)
- **Scene.tsx**: Handles 3D scene infrastructure
  - Lighting setup
  - Camera configuration
  - Coordinate system (axes, grid)
  - OrbitControls

### 2. Method Layer (`methods/`)
- **DiscMethod.tsx**: Complete disc method visualization
- **WasherMethod.tsx**: Future washer method
- **ShellMethod.tsx**: Future shell method

Each method component encapsulates:
- Function rendering
- Rotation animation
- Surface generation
- Element animation (discs/washers/shells)

### 3. Management Layer
- **VisualizationManager.tsx**: Routes to appropriate method
- **Plot3D.tsx**: Main entry point with simplified API

### 4. Configuration Layer (`config/`)
- **methodConfig.ts**: Method definitions and formulas

## Usage

### Basic Usage
```tsx
import { Plot3D } from './components/3d'

<Plot3D
    method="disc"
    userFn="x^2"
    lowerBound={0}
    upperBound={2}
    rotationBtn={isRotating}
    discBtn={showDiscs}
    toggleRotate={setIsRotating}
/>
```

### Advanced Usage
```tsx
import { Scene, DiscMethod } from './components/3d'

<Scene>
    <DiscMethod
        userFn="x^2"
        lowerBound={0}
        upperBound={2}
        isRotating={true}
        showDiscs={false}
        onRotationComplete={() => console.log('done')}
    />
</Scene>
```

## Adding New Methods

1. Create new method component in `methods/`
2. Add method type to `config/methodConfig.ts`
3. Add case to `VisualizationManager.tsx`
4. Export from `index.ts`

Example:
```tsx
// methods/CylinderMethod.tsx
const CylinderMethod: React.FC<CylinderMethodProps> = ({...}) => {
    return (
        <>
            {/* Implementation */}
        </>
    )
}
```

## Benefits

- **Separation of Concerns**: Each layer has clear responsibilities
- **Easy Testing**: Components can be tested in isolation
- **Reusability**: Core components can be reused across methods
- **Extensibility**: New methods require minimal changes to existing code
- **Maintainability**: Bugs are isolated to specific components 