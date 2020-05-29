import { Canvas, useFrame } from 'react-three-fiber'
import { useRef } from 'react';
import { Mesh, BufferAttribute, InterleavedBufferAttribute, InterleavedBuffer, Group, Line, BufferGeometry } from 'three';

let f = (x: number, y: number) => Math.sqrt(x * x + y * y)

const R = 50;

const data = []
for (let i = 1; i <= R; i += 1) {
  let x = -3 + i * (6 / R)
  for (let j = 1; j <= R; j += 1) {
    let y = -3 + j * (6 / R)
    data.push(x)
    data.push(y)
    data.push(-Math.sin(x + y))
  }
}

const data2 = []
for (let i = 1; i <= R; i += 1) {
  let y = -3 + i * (6 / R)
  for (let j = 1; j <= R; j += 1) {
    let x = -3 + j * (6 / R)
    data2.push(x)
    data2.push(y)
    data2.push(-Math.sin(x + y))
  }
}

const vertices = new Float32Array(data)
const vertices2 = new Float32Array(data2)
const intedata = new InterleavedBuffer(vertices, R * 3)

let passed = 0

const OneLine = () => {
  const lines = useRef<Group>();

  useFrame((_, delta) => {
    passed += delta
    for (let i = 1; i <= R; i += 1) {
      let x = -3 + i * (6 / R)
      for (let j = 1; j <= R; j += 1) {
        let y = -3 + j * (6 / R)
        let index = 3 * ((i-1) * R + j - 1)
        let index2 = 3 * ((j-1) * R + i - 1)
        vertices[index + 2] = Math.sin(x*x + y*y + passed  )
        vertices2[index2 + 2] = Math.sin(x*x + y*y + passed )
      }
    }
    lines.current.children.map((o: Line<BufferGeometry>) => {
      let a = o.geometry.attributes.position
      if (a instanceof BufferAttribute) {
        a.needsUpdate = true
      }
    })
  })

  return (
    <group ref={lines}>
      {Array(R).fill(0).map((_, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry" drawRange={{ start: i * R, count: R }} attributes={{ 'position': new BufferAttribute(vertices, 3) }} />
          <lineBasicMaterial attach="material" color='black' />
        </line>
      ))}
      {Array(R).fill(0).map((_, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry" drawRange={{ start: i * R, count: R }} attributes={{ 'position': new BufferAttribute(vertices2, 3) }} />
          {/* <bufferGeometry attach="geometry" attributes={{ 'position': new InterleavedBufferAttribute(intedata, 3, i * 3) }} /> */}
          <lineBasicMaterial attach="material" color='black' />
        </line>
      ))}
    </group>
  )
}
export default () =>
  <div>
    <pre style={{position: "absolute", fontSize: "2em", padding: "1em 2em"}}>
      f = sin(x*x + y*y + t)
    </pre>
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <OneLine />
    </Canvas>
    <style global jsx>{`
      * { margin: 0; padding: 0; }
    `}</style>
  </div>