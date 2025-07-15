import { useState } from "react"
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"

function App() {
    const [showFormula, displayFormula] = useState(false)
    
    const [userFn, setFn] = useState("2x")
    const [lowerBound, setLowerBound] = useState(-1)
    const [upperBound, setUpperBound] = useState(1)
    const [rotationBtn, toggleRotate] = useState(false)
    const [discBtn, toggleDisc] = useState(false)

    
    return (
        <>
            <div className="top-formula-bar"> 
                <button className="open-tab-btn" onClick={() => displayFormula(!showFormula)}>
                    {showFormula ? "Hide" : "Show"} Formula
                </button>
                
                <button onClick={() => toggleRotate}>
                    {rotationBtn ? "Stop" : "Start"} Rotation
                </button>

                <button 
                    onClick={() => toggleDisc(!discBtn)}
                    disabled={rotationBtn}
                >
                    {discBtn ? "Hide" : "Show"} Discs
                </button>
            </div>

            {showFormula && (
                <Formula 
                    userFn={userFn} 
                    lowerBound={lowerBound} 
                    upperBound={upperBound}
                    setFn={setFn}
                    setLowerBound={setLowerBound}
                    setUpperBound={setUpperBound}
                />
            )}

            <Plot3D 
                userFn={userFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                rotationBtn={rotationBtn}  // pass the toggle directly
                toggleDisc={toggleDisc}
            />
        </>
    )
}

export default App
