# React + TypeScript + Vite + Three JS

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Step 1 Setup

In this step, we create a new React project using Vite with TypeScript support and set up the necessary dependencies for building a 3D application with Three.js.

### 1. Create a new Vite Project template react typescript
```bash 
$ npm create vite@latest my-3d-app --template react-ts
```
This initializes a new React project named `my-3d-app` using TypeScript.

### 2. Navigate into the project folder
```bash 
$ cd my-3d-app
```
Move into your project directory to start installing dependencies and running the app.

### 3. Install 3D dependencies
```bash 
$ npm install three @react-three/fiber @react-three/drei
```

### 4. Start the development server
```bash
$ npm run dev
 ```
 Runs the project locally so you can view and develop your 3D application in the browser.

## Step 2 First Scene
In this step, we set up a basic 3D scene using React Three Fiber and Three.js. This provides the foundation to start adding objects, lights, and animations.

### 1. Import dependencies
Have 2 way of import

first way `import * as THREE from "three"` 
```tsx
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
 ```
 second way `import {attribute} as @react-three/drei` or `import {attribute} as @react-three/fiber`

 ```tsx
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
  ```
`THREE` provides core 3D functionalities like cameras, geometries, and materials.

`Canvas` is the React Three Fiber component that renders the 3D scene in React.

### 2. Create a Perspective Camera and Render the Canvas
```ts
export default function App () {

  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set( 0 , 0, 100 );
  camera.lookAt( 0, 0, 0 );

  return (
    <Canvas camera={camera} style={{height: "100vh", width: "100vw", backgroundColor: "#000"}}>
    
    </Canvas>
  )
}
 ```
## Step 3 Lights & Materials
function for create `<"HTML Tag" args={{x, y, z}}>` 
```ts 
function SpinningCube(props: JSX.IntrinsicElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <mesh
      {...props}
      ref={meshRef}
    >
      <boxGeometry args={[1, 10, 10]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

| HTML Tag | 3D Model
| - | -
`<planeGeometry>`| plane object 
`<boxGeometry>`| Cube object 
`<cylinderGeometry>`| cylinder object
`<circleGeometry>`| circle object 
`<sphereGeometry>`| sphere object 

```tsx 
<directionalLight position={[-5, -5, -5]} intensity={0.5} />
<pointLight position={[10, 10, 10]} intensity={1} />
<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
```

`intensity` light intensity can add in tag HTML
| HTML Tag | type of Light
| - | -
`<directionalLight>`| plane object 
`<pointLight>`| Cube object 
`<spotLight>`| cylinder object

## Step 4 Camera Controls
To make your 3D scene interactive, you can allow users to rotate, zoom, and pan the camera. This is done with `OrbitControls` from `@react-three/drei`.

By adding it to your `<Canvas>`:
```ts
<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} >
 ```

`enableRotate`: Allows the user to rotate the camera around the scene by dragging the mouse.

`enableZoom`: Lets the user zoom in and out using the scroll wheel or pinch gestures.

`enablePan`: Lets the user move the camera side-to-side or up-and-down to explore the scene.

## Step 5 Load Model
In this step start by create file name `Model` in folder assets 
### 1. Import dependencies
```tsx
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useRef, type JSX } from "react";
import type { Group, Mesh } from "three";
```
### 2. make type GLTFResult and assign atribult scene type Group 
```ts
type GLTFResult = {
  scene: Group;
};
 ```
### 3. Import model
assign model to scene
 ``` ts
 const  { scene }  = useGLTF("/model.glb") as GLTFResult;
 ```
### 4. Render model in scene
  ``` ts
<primitive object={scene} scale={2} />
 ```
## Step 6 Interactivity
this code function for rotate object 1 time per click
``` ts
  const [arrayRotation, setArrayRotation] = useState([0, 0, 0]);

  const handleArrayRotation = () => {
    setArrayRotation((prev) => {
      const newRotation = [...prev];
      newRotation[0] += 0.01; // Increment the first element
      newRotation[1] += 0.1; // Increment the second element
      newRotation[2] += 0.1; // Increment the third element
      return newRotation;
    });
  };
```
this code for loop rotation object by Y Axis
```tsx
  // Rotate every frame
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // speed of rotation
    }
  });
```
```ts
rotation={arrayRotation} 
``` 
## Step 7 Textures & Environment Maps
1 assign texture picture to texture const
``` ts 
const texture = useTexture("/model/hhhh.png");
```
2 map texture in model glb
``` ts
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
  ```

