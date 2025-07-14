import { useState } from "react"
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"

function App() {
    const [showBottomTab, setShowBottomTab] = useState(false)
    
    const [userFunction, setUserFunction] = useState("x")
    const [lowerBound, setLowerBound] = useState(0)
    const [upperBound, setUpperBound] = useState(1)
    const [isRotating, setIsRotating] = useState(false)

    
    const handleRotationComplete = () => {
        setIsRotating(false)  // Reset rotation state when complete
    }
    // TODO: SHOW TRAIL
    // TODO: Show disks filling in 1 at a time * Explains WHY its the disc method
    // Do larger disks then smaller disks

    // Later TODO: Show explination for each step

    const handleRotationToggle = () => {
        setIsRotating(!isRotating)  // Toggle rotation
    }

    return (
        <div>
            <div className="top-formula-bar"> 
                <button className="open-tab-btn" onClick={() => setShowBottomTab(!showBottomTab)}>
                    {showBottomTab ? "Hide" : "Show"} Formula
                </button>
                
                <button className="open-tab-btn" onClick={handleRotationToggle}>
                    {isRotating ? "Stop" : "Start"} Rotation
                </button>
            </div>

            {showBottomTab && (
                <Formula 
                    userFunction={userFunction} 
                    lowerBound={lowerBound} 
                    upperBound={upperBound}
                    setUserFunction={setUserFunction}
                    setLowerBound={setLowerBound}
                    setUpperBound={setUpperBound}
                />
            )}

            <Plot3D 
                userFunction={userFunction} 
                lowerBound={lowerBound} 
                upperBound={upperBound}
                isRotating={isRotating}
                onRotationComplete={handleRotationComplete}  // Pass callback
            />
        </div>
    )
}

export default App
