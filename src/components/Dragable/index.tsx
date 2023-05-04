import * as THREE from "three";

import React, { useRef,useState, useEffect } from "react";
import {
  useThree
} from "@react-three/fiber";

interface Props {
  enabled: boolean;
  children: Element
}

const Dragable = (props: any) => {
  const { camera, gl } = useThree();
  const [children, setChildren] = useState([]);
  const groupRef = useRef<any>(null);
  useEffect(() => {
    if (groupRef.current) {
      setChildren(groupRef.current.children);
    }
  }, []);

  return (
    <group ref={groupRef}>
      <dragControls enabled={props.enabled} args={[children, camera, gl.domElement]}/>
      {props.children}
    </group>
  );
};

export default Dragable;