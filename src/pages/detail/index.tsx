import * as THREE from "three";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import {
  Canvas,
  Camera,
  ThreeElements,
  extend,
  Object3DNode,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  useGLTF,
  PresentationControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";
import { Form, Slider, Card, Input, Switch, Collapse, theme } from "antd";
import { HexColorPicker } from "react-colorful";
import Dragable from "../../components/Dragable";
import { CaretRightOutlined } from "@ant-design/icons";

import "./index.css";

extend({ TextGeometry });
extend({ DragControls });
declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
    dragControls: Object3DNode<DragControls, typeof DragControls>;
  }
}

interface FontProps {
  text: string;
  isAutoRotate: boolean;
  size: number;
  height: number;
  color: string;
}

function Box(props: FontProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const font = new FontLoader().parse(helvetiker);
  const textOptions = {
    font,
    size: props.size,
    height: props.height,
  };
  const textGeo = new TextGeometry(props.text, textOptions);

  // 居中
  textGeo.computeBoundingBox();
  textGeo.center();

  // 自动旋转
  useFrame((state, delta) =>
    props.isAutoRotate
      ? (mesh.current.rotation.x += delta)
      : mesh.current.rotation.x
  );

  return (
    <mesh ref={mesh} position={[0, 0, 0]} geometry={textGeo}>
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

function Detail() {
  const [form] = Form.useForm();
  const text = Form.useWatch("text", form);
  const isAutoRotate = Form.useWatch("isAutoRotate", form);
  const isDragRotate = Form.useWatch("isDragRotate", form);
  const isDragMove = Form.useWatch("isDragMove", form);
  const size = Form.useWatch("size", form);
  const height = Form.useWatch("height", form);
  const [color, setColor] = useState("#aabbcc");

  const { Panel } = Collapse;
  return (
    <>
      <Card className="form">
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Panel header="配置" key="1">
            <Form
              name="controls"
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label="内容"
                name="text"
                tooltip="目前只支持英文字母"
                initialValue={"text"}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="自动旋转"
                name="isAutoRotate"
                initialValue={true}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="拖拽旋转"
                name="isDragRotate"
                initialValue={true}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="拖拽移动"
                name="isDragMove"
                initialValue={true}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item label="字体大小" name="size" initialValue={1}>
                <Slider min={0} max={5} step={0.01} />
              </Form.Item>
              <Form.Item label="字体高度" name="height" initialValue={1}>
                <Slider min={0} max={5} step={0.01} />
              </Form.Item>
              <Form.Item label="字体颜色">
                <HexColorPicker color={color} onChange={setColor} />
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </Card>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          shadow-mapSize={2048}
          castShadow
        />
        <PresentationControls
          enabled={isDragRotate}
          config={{ mass: 2, tension: 500 }}
          // snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          // polar={[-Math.PI / 3, Math.PI / 3]}
          // azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Dragable enabled={isDragMove}>
            <Box
              text={text}
              isAutoRotate={isAutoRotate}
              size={size}
              height={height}
              color={color}
            />
          </Dragable>
        </PresentationControls>
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.75}
          scale={10}
          blur={2.5}
          far={4}
        />
        <Environment preset="city" />
      </Canvas>
    </>
  );
}

export default Detail;
