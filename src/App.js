import { Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Environment,
  RenderTexture,
  Text,
  PerspectiveCamera
} from "@react-three/drei";
import { LayerMaterial, Displace } from "lamina";

const LINE_1 = "How is it made?";
const LINE_2 = "Displacement";
const SIZE = 14;

// made by wojciech dobry
// https://twitter.com/wojciech_dobry

// inspired by pmndrs collective
// https://twitter.com/pmndrs

export default function App() {
  return (
    <>
      <Canvas>
        <PerspectiveCamera position={[0, 0, 50]} makeDefault />
        <Suspense>
          <Bubble />
          <Typography />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
      {/* Smoke and mirrors – render invisible DOM above canvas*/}
      <Overlay />
    </>
  );
}

const Bubble = () => {
  const ref = useRef(null);
  const displaceRef = useRef(null);

  const { width } = useThree((state) => state.viewport);

  useFrame(({ _ }, dt) => {
    displaceRef.current.offset.x += 4 * dt;
  });

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[width / 8, 128, 128]} />
      <LayerMaterial
        color={"white"}
        lighting={"physical"}
        transmission={1}
        roughness={0}
        thickness={2}
      >
        <Displace ref={displaceRef} strength={3} scale={0.25} />
      </LayerMaterial>
    </mesh>
  );
};

const Typography = () => {
  const { width, height } = useThree((state) => state.viewport);
  const vw = (size) => (width * size) / 100;
  const vh = (size) => (height * size) / 100;

  return (
    <mesh>
      <planeBufferGeometry args={[width, height, 1]} />
      <meshBasicMaterial>
        {/* AFAIK :  */}
        {/* Rendering text into a texture gives the best quality */}
        <RenderTexture attach="map">
          <Text
            font="/IBMPlexSans-Light.ttf"
            fontSize={vw(SIZE / 7)}
            position={[0, vh(10), 0]}
          >
            {LINE_1}
          </Text>
          <Text
            font="/IBMPlexSans-Medium.ttf"
            fontSize={vw(SIZE)}
            position={[0, 0, 0]}
          >
            {LINE_2}
          </Text>
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};

const Overlay = () => (
  <>
    <span
      style={{
        position: "absolute",
        bottom: "50%",
        left: "50%",
        fontSize: `${SIZE}vw`,
        fontFamily: "IBM Plex Sans",
        fontWeight: 500,
        lineHeight: 1,
        color: "hsla(0, 100%, 50%, 0)",
        transform: "translateX(-50%) translateY(50%)",
        whiteSpace: "nowrap"
      }}
    >
      {LINE_2}
    </span>
    <span
      style={{
        position: "absolute",
        bottom: "50%",
        left: "50%",
        fontSize: `2vw`,
        fontFamily: "IBM Plex Sans",
        fontWeight: 200,
        lineHeight: 1,
        color: "hsla(0, 100%, 50%, 0)",
        transform: "translateX(-50%) translateY(calc(50% - 10vh))",
        whiteSpace: "nowrap"
      }}
    >
      {LINE_1}
    </span>
    <span
      style={{
        position: "absolute",
        bottom: "10%",
        left: "50%",
        fontSize: `1.75vw`,
        fontFamily: "IBM Plex Sans",
        fontWeight: 200,
        color: "hsla(0, 0%, 95%, 1)",
        transform: "translateX(-50%) translateY(50%)",
        whiteSpace: "nowrap",
        textAlign: "center"
      }}
    >
      made by{" "}
      <a
        href="https://twitter.com/wojciech_dobry"
        target="_blank"
        rel="noreferrer"
      >
        wojciech dobry
      </a>{" "}
      – inspired by{" "}
      <a href="https://twitter.com/pmndrs" target="_blank" rel="noreferrer">
        pmndrs
      </a>{" "}
      collective
    </span>
  </>
);
