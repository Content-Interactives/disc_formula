import { useState } from "react"
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"


function App() {
    const [showBottomTab, setShowBottomTab] = useState(false)
    
    const [userFunction, setUserFunction] = useState("x^2")
    const [lowerBound, setLowerBound] = useState(0)
    const [upperBound, setUpperBound] = useState(1)

    return (
        <div>
            <div className="top-formula-bar"> 
                <button className="open-tab-btn" onClick={() => setShowBottomTab(!showBottomTab)}>
                    {showBottomTab ? "Close Formula" : "Open Formula"}
                </button>
                {showBottomTab && (<div className="formula-in-bar"> 
                    <Formula 
                        userFunction={userFunction}
                        lowerBound={lowerBound}
                        upperBound={upperBound}
                        setUserFunction={setUserFunction}
                        setLowerBound={setLowerBound}
                        setUpperBound={setUpperBound}
                    />
                    </div>
                )}
            </div>
            <div className="plot-area">
                <Plot3D 
                    userFunction={userFunction}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                />
                
            </div>
        </div>
    )
}

export default App
