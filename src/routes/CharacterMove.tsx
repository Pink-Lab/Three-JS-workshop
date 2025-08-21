import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { JSX } from "react";
import {
  Group,
  Mesh,
  AnimationAction,
  LoopRepeat,
  LoopOnce,
  LoopPingPong,
  AnimationClip,
  Vector3,
  Euler,
  Quaternion,
} from "three";

type Props = JSX.IntrinsicElements["group"] & {
  /** Optional: override clip names in your GLB */
  actionNames?: { idle: string; walk: string; run: string };
  /** m/s while walking */
  walkSpeed?: number;
  /** m/s while running (Shift) */
  runSpeed?: number;
  /** Rotation smoothing (higher = snappier) */
  turnLerp?: number;
  /** Loop mode for clips */
  loop?: "Loop" | "Once" | "PingPong";
  /** Cross-fade secs */
  fade?: number;
};

const loopMap = {
  Loop: LoopRepeat,
  Once: LoopOnce,
  PingPong: LoopPingPong,
} as const;

// Small keyboard helper
function useKeyboard(keys: string[]) {
  const pressed = useRef<Set<string>>(new Set());
  useEffect(() => {
    const down = (e: KeyboardEvent) => pressed.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => pressed.current.delete(e.key.toLowerCase());
    const blur = () => pressed.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
  return {
    isDown: (k: string) => pressed.current.has(k.toLowerCase()),
  };
}

export default function CharacterMove({
  actionNames = { idle: "Idle", walk: "walk", run: "Run" },
  walkSpeed = 2,
  runSpeed = 5,
  turnLerp = 10,
  loop = "Loop",
  fade = 0.2,
  ...props
}: Props) {
  const group = useRef<Group>(null);

  // Load model + clips
  const { scene, animations } = useGLTF(
    "/model/character_animation.glb"
  ) as unknown as { scene: Group; animations: AnimationClip[] };

  const { actions, mixer } = useAnimations(animations, group);

  // Enable shadows
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const m = obj as Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [scene]);

  // Prepare actions (loop/clamp)
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((a) => {
      if (!a) return;
      a.setLoop(loopMap[loop], loop === "Loop" ? Infinity : 1);
      a.clampWhenFinished = loop !== "Loop";
    });
    return () => mixer?.stopAllAction();
  }, [actions, mixer, loop]);

  // Keyboard
  const kb = useKeyboard(["w", "a", "s", "d", "shift"]);

  // Animation switching helper
  const currentActionRef = useRef<AnimationAction | null>(null);
  const play = (name: string) => {
    if (!actions) return;
    const next = actions[name];
    if (!next) return;
    const cur = currentActionRef.current;
    if (cur === next) return;
    next.reset().fadeIn(fade).play();
    if (cur) cur.crossFadeTo(next, fade, false);
    currentActionRef.current = next;
  };

  // Movement math reuse
  const moveDir = useMemo(() => new Vector3(), []);
  const targetQuat = useMemo(() => new Quaternion(), []);
  const euler = useMemo(() => new Euler(0, 0, 0), []);
  const forward = useMemo(() => new Vector3(0, 0, 1), []); // -Z is forward in three

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    // Build 2D input vector on XZ plane
    let x = 0;
    let z = 0;
    if (kb.isDown("w")) z -= 1;
    if (kb.isDown("s")) z += 1;
    if (kb.isDown("a")) x -= 1;
    if (kb.isDown("d")) x += 1;

    moveDir.set(x, 0, z);
    const hasInput = moveDir.lengthSq() > 0;
    if (hasInput) moveDir.normalize();

    const running = hasInput && kb.isDown("shift");
    const speed = hasInput ? (running ? runSpeed : walkSpeed) : 0;

    // Choose animation
    if (!hasInput) {
      play(actionNames.idle);
    } else if (running) {
      play(actionNames.run);
    } else  {
      play(actionNames.walk);
    }

    // Rotate toward movement direction
    if (hasInput) {
      // Desired facing: along moveDir
      // Convert direction -> yaw (Y axis)
      const desiredYaw = Math.atan2(moveDir.x, moveDir.z); // z forward basis
      euler.set(0, desiredYaw, 0);
      targetQuat.setFromEuler(euler);
      g.quaternion.slerp(targetQuat, 1 - Math.exp(-turnLerp * dt));
    }

    // Move in facing direction
    if (speed > 0) {
      // Use current facing (forward -Z in local space)
      const dir = forward.clone().applyQuaternion(g.quaternion).normalize();
      g.position.addScaledVector(dir, speed * dt);
    }
  });

  return (
    <group ref={group} {...props}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

useGLTF.preload("/model/character_animation.glb");
