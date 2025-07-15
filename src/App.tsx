import { useState } from "react"
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"

function App() {
    const [showFormula, displayFormula] = useState(false)
    
    const [userFn, setFn] = useState("2x")
    const [lowerBound, setLowerBound] = useState(-1)
    const [upperBound, setUpperBound] = useState(1)
    const [rotationBtn, toggleRotationBtn] = useState(false)
    // Add this with your other state variables in App.tsx
    const [discBtn, toggleDiscBtn] = useState(false)
    const [discAnim, toggleDiscAnim] = useState(false)

    
    const allowDiscBtn = () => {
        toggleRotationBtn(false)  // Reset rotation state when complete
        toggleDiscBtn(true)
    }
    // TODO: SHOW TRAIL
    // TODO: Show disks filling in 1 at a time * Explains WHY its the disc method



    // Do larger disks then smaller disks

    // Later TODO: Show explination for each step


    return (
        <div>
            <div className="top-formula-bar"> 
                <button className="open-tab-btn" onClick={() => displayFormula(!showFormula)}>
                    {showFormula ? "Hide" : "Show"} Formula
                </button>
                
                <button className="open-tab-btn" onClick={() => toggleRotationBtn(!rotationBtn)}>
                    {rotationBtn ? "Stop" : "Start"} Rotation
                </button>

                <button 
                    className="open-tab-btn" 
                    onClick={() => toggleDiscBtn}
                    disabled={!discBtn}  // This disables the button until rotation is complete
                >
                    {discAnim ? "Hide" : "Show"} Discs
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

                // RotateX
                rotationBtn={rotationBtn}
                afterRotateX={allowDiscBtn}  // Pass callback

                //Disc Method
            />
        </div>
    )
}

export default App
