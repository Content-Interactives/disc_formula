// WORK IN PROGRESS!!!
import {Rnd} from "react-rnd";

interface VolumeWindowProps {
    volume: number;
    phase: number;
    maxPhases: number;
}

export const VolumeWindow = ({ volume, phase, maxPhases }: VolumeWindowProps) => {
    return (
         // @ts-ignore
        <Rnd
            default={{
                x: window.innerWidth - 300,
                y: 20,
                width: 250,
                height: 150
            }}
            minWidth={200}
            minHeight={100}
            bounds="window"
            dragHandleClassName="handle"
        >
            <div className="bg-black/80 p-4 rounded-lg text-white font-system-ui">
                <div className="handle cursor-move border-b border-white/20 pb-2 mb-2">
                    Volume Calculation
                </div>
                <div className="space-y-2">
                    <div>Phase: {phase + 1} of {maxPhases}</div>
                    <div>Volume: {volume.toFixed(2)} cubic units</div>
                </div>
            </div>
        </Rnd>
    );
};