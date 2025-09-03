import { Canvas } from "@react-three/fiber"
import { Suspense,  useMemo, useRef, useState, type JSX } from "react";
import { Environment, Html, OrbitControls, OrthographicCamera } from "@react-three/drei";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { DoubleSide, PerspectiveCamera, type Group, type Mesh } from "three";
import Model from "./routes/Model";
import CharacterMove from "./routes/CharacterMove";
import { FollowCamera } from "./routes/FollowCamera";

type GLTFResult = {
  scene: Group;
};

function SpinningCube(props: JSX.IntrinsicElements['mesh']) {
  const meshRef = useRef<Mesh>(null!)

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
      <meshStandardMaterial color="orange" side={DoubleSide} />
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

  const charRef = useRef<Group>(null);

  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const camera = new OrthographicCamera(
//   -10, 10, 10, -10, 0.1, 1000
// );
// camera.position.set(0, 5, 10);
// camera.lookAt(0, 0, 0);

  const [isActive, setActive] = useState(false)
  camera.position.set( 0 , 0, 30 );
  camera.lookAt( 0, 0, 0 );

  const [arrayRotation, setArrayRotation] = useState<[number, number, number]>([0, 0, 0]);

  const handleArrayRotation = () => {
    setArrayRotation((prev) => {
      const newRotation: [number, number, number] = [
        prev[0] + 0.01, // Increment the first element
        prev[1] + 0.1,  // Increment the second element
        prev[2] + 0.1   // Increment the third element
      ];
      return newRotation;
    });
  };

  return (
    <>
    <Canvas camera={camera} style={{ height: "60vh", width: "60vw", backgroundColor: "#000" }}>
      {/* <OrthographicCamera 
    makeDefault 
    position={[2, 10, 10]}
    rotation={[-.4, .2, 0]}
    // lookAt={[0, 0, 0]}
    zoom={20} 
    near={0.1} 
    far={1000} 
  /> */}
      <SpinningCube onClick={()=>setActive(!isActive)} position={[1, 1, 1]} />
      {isActive &&

      <Popup position={[0, 1.5, 0]} onClose={() => setActive(false)} />
      }
      <CharacterMove scale={5} position={[0,-2,0]} />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
      <Model scale={2} rotation={arrayRotation} />
      </Suspense>
      {/* <directionalLight position={[5, 5, 5]} intensity={1} /> */}
      {/* <directionalLight position={[-5, -5, -5]} intensity={0.5} /> */}
      {/* <pointLight position={[10, 10, 10]} intensity={1} /> */}
      {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} /> */}
      {/* <hemisphereLight groundColor={0x000000} intensity={0.5} /> */}
      {/* <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={2} /> */}
      {/* <FollowCamera target={charRef} /> */}
      <Environment files={["bloem_field_sunrise_1k.hdr"]} background={true} />
      {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
    </Canvas>

     {/* Modal Overlay */}
     
     <button style={{backgroundColor: 'red', color: "white" ,cursor: 'pointer'}} onClick={handleArrayRotation}>Click Me</button>
    </>
  )
}
// useGLTF.preload("/model.glb");
export default App
