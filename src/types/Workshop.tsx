import { Canvas } from "@react-three/fiber";
import { useRef, type JSX } from "react";
import type { Mesh } from "three";

export default function Workshop() {
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

  return (
    <Canvas>

    </Canvas>
  )
}