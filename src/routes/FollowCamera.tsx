import { useThree, useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";
import { Group, Quaternion, Vector3 } from "three";

export function FollowCamera({
  target,
  offset = new Vector3(0, 2.5, 6), // behind (+Z) and a bit above
  followLerp = 8,                    // higher = snappier follow
}: {
  target: React.RefObject<Group>;
  offset?: Vector3;
  followLerp?: number;
}) {
  const { camera } = useThree();
  const tmpPos = useMemo(() => new Vector3(), []);
  const tmpQuat = useMemo(() => new Quaternion(), []);
  const worldCamPos = useMemo(() => new Vector3(), []);

  useFrame((_, dt) => {
    const t = target.current;
    if (!t) return;

    // get target world transform
    t.getWorldPosition(tmpPos);
    t.getWorldQuaternion(tmpQuat);

    // place camera at target + (local offset rotated to world)
    worldCamPos.copy(offset).applyQuaternion(tmpQuat).add(tmpPos);

    // smooth follow
    const alpha = 1 - Math.exp(-followLerp * dt);
    camera.position.lerp(worldCamPos, alpha);
    camera.lookAt(tmpPos);
  });

  return null;
}