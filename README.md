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

```bash
$ npm create vite@latest my-3d-app --template react-ts
$ cd my-3d-app
$ npm install three @react-three/fiber @react-three/drei
$ npm run dev
 ```

## Step 2 First Scene

```ts
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"

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
function for create `Box`
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

`<"HTML Tag" args={{x, y, z}}>`

| HTML Tag | 3D Model
| - | -
`<planeGeometry>`| plane object 
`<boxGeometry>`| Cube object 
`<cylinderGeometry>`| cylinder object
`<circleGeometry>`| circle object 
`<sphereGeometry>`| sphere object 

## Step 4 Camera Controls
add this to `<Canvas>`
```ts
<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} >
 ```
## Step 5 Load Model
## Step 6 Interactivity
## Step 7 Textures
## Step 8 Wrap-Up

