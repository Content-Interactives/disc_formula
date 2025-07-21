import { useState } from "react"
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"
import { useMethodConfig } from "./components/3d/hooks/useMethodConfig"

function App() {
    const [showFormula, displayFormula] = useState(false)
    
    // Function and bounds state - now supporting multiple functions
    const [userFunctions, setUserFunctions] = useState(["2*x"])  // Array of functions
    const [lowerBound, setLowerBound] = useState(0)  // Changed to 0 for better visualization
    const [upperBound, setUpperBound] = useState(2)  // Changed to 2 for better visualization
    
    // Animation state
    const [rotationBtn, toggleRotate] = useState(false)
    const [discBtn, toggleDisc] = useState(false)
    
    // Method selection using the new hook
    const { currentMethod, setMethod, availableMethods, methodConfig } = useMethodConfig('disc')

    // Helper function to update specific function in array
    const updateFunction = (index: number, value: string) => {
        const newFunctions = [...userFunctions]
        newFunctions[index] = value
        setUserFunctions(newFunctions)
    }

    // Ensure we have the right number of functions for current method
    const ensureFunctionCount = () => {
        const config = methodConfig
        const needed = config.functionCount
        const current = userFunctions.length
        
        if (current < needed) {
            // Add appropriate default functions if we need more
            const newFunctions = [...userFunctions]
            for (let i = current; i < needed; i++) {
                if (currentMethod === 'washer') {
                    // For washer method: outer function should be larger than inner
                    newFunctions.push(i === 0 ? "2*x" : "x")
                } else {
                    newFunctions.push("x")  // Default function for disc/shell
                }
            }
            setUserFunctions(newFunctions)
        } else if (current > needed) {
            // Remove extra functions if we have too many
            setUserFunctions(userFunctions.slice(0, needed))
        }
    }

    // Update function count when method changes
    const handleMethodChange = (method: typeof currentMethod) => {
        setMethod(method)
        // Small delay to ensure methodConfig is updated
        setTimeout(() => ensureFunctionCount(), 0)
    }

    return (
        <>
            <div className="top-formula-bar"> 
                <button className="open-tab-btn" onClick={() => displayFormula(!showFormula)}>
                    {showFormula ? "Hide" : "Show"} Formula
                </button>
                
                {/* Method Selection */}
                <select 
                    value={currentMethod} 
                    onChange={(e) => handleMethodChange(e.target.value as typeof currentMethod)}
                    className="method-selector"
                >
                    {availableMethods.map(method => (
                        <option key={method} value={method}>
                            {method.charAt(0).toUpperCase() + method.slice(1)} Method
                        </option>
                    ))}
                </select>
                
                <button onClick={() => toggleRotate(!rotationBtn)}>
                    {rotationBtn ? "Stop" : "Start"} Rotation
                </button>

                <button 
                    onClick={() => toggleDisc(!discBtn)}
                    disabled={discBtn === false && rotationBtn === true}
                >
                    {discBtn ? "Hide" : "Show"} {currentMethod === 'disc' ? 'Discs' : currentMethod === 'washer' ? 'Washers' : 'Shells'}
                </button>
            </div>

            {showFormula && (
                <Formula 
                    userFunctions={userFunctions}
                    lowerBound={lowerBound} 
                    upperBound={upperBound}
                    setUserFunctions={setUserFunctions}
                    updateFunction={updateFunction}
                    setLowerBound={setLowerBound}
                    setUpperBound={setUpperBound}
                    selectedMethod={currentMethod}
                    onMethodChange={handleMethodChange}
                />
            )}

            <Plot3D 
                method={currentMethod}
                userFunctions={userFunctions}
                lowerBound={lowerBound}
                upperBound={upperBound}
                rotationBtn={rotationBtn}
                toggleRotate={toggleRotate}
                discBtn={discBtn}
            />
        </>
    )
}

export default App
