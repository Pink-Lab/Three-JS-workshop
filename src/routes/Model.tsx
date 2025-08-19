import React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useRef, type JSX } from "react";
import type { Group, Mesh } from "three";

type GLTFResult = {
  scene: Group;
};

export default function Model(props: JSX.IntrinsicElements["group"]) {
  // const { scene } = useGLTF("/model.glb") as GLTFResult;
  const { scene } = useGLTF("/model/model.glb") as GLTFResult;
  const ref = useRef<Group>(null);
  const texture = useTexture("/model/hhhh.png");

  // Rotate every frame
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // speed of rotation
    }
  });

  React.useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if ("map" in m) m.map = texture;
          });
        } else {
          if ("map" in mesh.material) {
            mesh.material.map = texture;
          }
        }
      }
    });
  }, [scene, texture]);

  return <primitive dispose={null} object={scene} {...props} ref={ref} />;
}

// Preload to make it faster
// useGLTF.preload("/model.glb");
// useGLTF.preload("/model/model.gltf");