import { useState } from "react";
import Plot3D from "./components/3d/Plot3D"
import Formula from "./components/user_inputs/Formula"

function App() {
    const [showBottomBox, setShowBottomBox] = useState(false);

    return (
        <div className="plot-area">
            <Plot3D />
            
            <button
                className="bottom-right-btn"
                onClick={() => setShowBottomBox(!showBottomBox)}>
                Formula

                {showBottomBox && (
                <div className="bottom-box">
                    <Formula />
                </div>
            )}
            </button>
            
            
        </div>
    )
}

export default App
