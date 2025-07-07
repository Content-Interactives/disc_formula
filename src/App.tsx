import { useState } from "react"
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"

function App() {
    const [showBottomTab, setShowBottomTab] = useState(false)

    return (
        <div>
            <div className="top-formula-bar">
                <button
                    className="open-tab-btn"
                    onClick={() => setShowBottomTab(!showBottomTab)}
                >
                    {showBottomTab ? "Close Formula" : "Open Formula"}
                </button>
                {showBottomTab && (
                    <div className="formula-in-bar">
                        <Formula />
                    </div>
                )}
            </div>
            <div className="plot-area">
                <Plot3D />
            </div>
        </div>
    )
}

export default App
