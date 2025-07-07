import React from "react"
import "katex/dist/katex.min.css"
import "./Formula.css"
import { InlineMath, BlockMath } from "react-katex"

const Formula = () => (
    <div className="formula-container">
        <div>
            <BlockMath math={"V = \\pi \\int_a^b [f(x)]^2 dx"} />
        </div>
        <div>
            <BlockMath math={"y = x^2 + 3x + 2"} />
        </div>
    </div>
)

export default Formula
// CSS styling
