import { FilmGrain, Shader, SineWave, SolidColor, WaveDistortion } from "shaders/react";
import {
  DISTORT,
  GRAIN,
  SOLID,
  WAVE_A,
  WAVE_B,
} from "./ai-intro-synthesis-preset.js";

/** Official Synthesis 1 tree on the AI intro host. */
export default function AiIntroSynthesis({ onReady, onUnavailable }) {
  return (
    <Shader
      className="ai-intro-shader"
      disableTelemetry
      onReady={onReady}
      onUnavailable={onUnavailable}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <FilmGrain
        strength={GRAIN.strength}
        opacity={GRAIN.opacity}
        blendMode={GRAIN.blendMode}
      >
        <WaveDistortion
          angle={DISTORT.angle}
          edges={DISTORT.edges}
          speed={DISTORT.speed}
          strength={DISTORT.strength}
          waveType={DISTORT.waveType}
          frequency={DISTORT.frequency}
          opacity={DISTORT.opacity}
          blendMode={DISTORT.blendMode}
        >
          <SolidColor
            color={SOLID.color}
            opacity={SOLID.opacity}
            blendMode={SOLID.blendMode}
          />
          <SineWave
            angle={WAVE_A.angle}
            color={WAVE_A.color}
            speed={WAVE_A.speed}
            opacity={WAVE_A.opacity}
            position={WAVE_A.position}
            softness={WAVE_A.softness}
            amplitude={WAVE_A.amplitude}
            blendMode={WAVE_A.blendMode}
            frequency={WAVE_A.frequency}
            thickness={WAVE_A.thickness}
          />
          <SineWave
            angle={WAVE_B.angle}
            color={WAVE_B.color}
            speed={WAVE_B.speed}
            opacity={WAVE_B.opacity}
            position={WAVE_B.position}
            softness={WAVE_B.softness}
            amplitude={WAVE_B.amplitude}
            blendMode={WAVE_B.blendMode}
            frequency={WAVE_B.frequency}
            thickness={WAVE_B.thickness}
          />
        </WaveDistortion>
      </FilmGrain>
    </Shader>
  );
}
