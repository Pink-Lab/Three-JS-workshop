import { Canvas, useLoader, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState, type JSX } from "react";
// import  RGBELoader  from "../public/";
import * as THREE from "three"
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'

function SpinningCube(props: JSX.IntrinsicElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <mesh
      {...props}
      ref={meshRef}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

function TextMesh() {
  const font = useMemo(() => new FontLoader().parse(helvetiker), []);
  
  const textGeometry = useMemo(() => new TextGeometry('Hello World', {
    font,
    size: 1,
    height: 0.2,
    curveSegments: 12,
  }), [font]);

  return (
    <mesh geometry={textGeometry} position={[-2.5, 0, 0]}>
      <meshStandardMaterial color="orange" side={THREE.DoubleSide} />
    </mesh>
  )
}

function Popup({ position, onClose }) {
  return (
    <Html position={position} center>
      <div style={{
        background: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        color: "black"
      }}>
        <p>Hello World!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </Html>
  )
}


function App() {

  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const [isActive, setActive] = useState(false)
  camera.position.set( 0 , 0, 100 );
  camera.lookAt( 0, 0, 0 );


  return (
    <>
    <Canvas camera={camera} style={{ height: "100vh", width: "100vw", backgroundColor: "#000" }}>
      <SpinningCube onClick={()=>setActive(!isActive)} position={[1, 1, 1]} />
      {isActive &&

      <Popup position={[0, 1.5, 0]} onClose={() => setActive(false)} />
      }
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <hemisphereLight groundColor={0x000000} intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
      <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={2} />
      <Environment files={["bloem_field_sunrise_1k.hdr"]} background={true} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>

     {/* Modal Overlay */}
     
    </>
  )
}

export default App
