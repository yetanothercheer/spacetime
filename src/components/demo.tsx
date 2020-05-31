import {
  Canvas,
  useFrame,
  extend,
  useThree,
  ReactThreeFiber,
} from 'react-three-fiber'
import { useRef } from 'react'
import {
  Mesh,
  BufferAttribute,
  InterleavedBufferAttribute,
  InterleavedBuffer,
  Group,
  Line,
  BufferGeometry,
} from 'three'
import Control from './Control'

const f = (x: number, y: number) => 0

const R = 50

const data = []
const data2 = []
for (let i = 1; i <= R; i += 1) {
  const x = -3 + i * (6 / R)
  for (let j = 1; j <= R; j += 1) {
    const y = -3 + j * (6 / R)
    data.push(x)
    data.push(y)
    data.push(f(x, y))

    data2.push(y)
    data2.push(x)
    data2.push(f(y, x))
  }
}

const vertices = new Float32Array(data)
const vertices2 = new Float32Array(data2)
// const intedata = new InterleavedBuffer(vertices, R * 3)

let passed = 0

const vs = `
varying vec3 pos;
void main()	{
    pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
`

const fs = `
varying vec3 pos;
void main()	{
    gl_FragColor = vec4(pos, 1.);
}
`

const OneLine = () => {
  const lines = useRef<Group>()

  useFrame((_, delta) => {
    passed += delta
    for (let i = 1; i <= R; i += 1) {
      const x = -3 + i * (6 / R)
      for (let j = 1; j <= R; j += 1) {
        const y = -3 + j * (6 / R)
        const index = 3 * ((i - 1) * R + j - 1)
        const index2 = 3 * ((j - 1) * R + i - 1)
        vertices[index + 2] = Math.sin(x * x + y * y + passed)
        vertices2[index2 + 2] = Math.sin(x * x + y * y + passed)
      }
    }
    lines.current.children.map((o: Line<BufferGeometry>) => {
      const a = o.geometry.attributes.position
      if (a instanceof BufferAttribute) {
        a.needsUpdate = true
      }
    })
  })

  return (
    <group ref={lines}>
      {Array(R)
        .fill(0)
        .map((_, i) => (
          <line key={i}>
            <bufferGeometry
              attach="geometry"
              drawRange={{ start: i * R, count: R }}
              attributes={{ position: new BufferAttribute(vertices, 3) }}
            />
            {/* <lineBasicMaterial attach="material" color='black' /> */}
            <shaderMaterial
              attach="material"
              vertexShader={vs}
              fragmentShader={fs}
            />
          </line>
        ))}
      {Array(R)
        .fill(0)
        .map((_, i) => (
          <line key={i}>
            <bufferGeometry
              attach="geometry"
              drawRange={{ start: i * R, count: R }}
              attributes={{ position: new BufferAttribute(vertices2, 3) }}
            />
            {/* <bufferGeometry attach="geometry" attributes={{ 'position': new InterleavedBufferAttribute(intedata, 3, i * 3) }} /> */}
            {/* <lineBasicMaterial attach="material" color='black' /> */}
            <shaderMaterial
              attach="material"
              vertexShader={vs}
              fragmentShader={fs}
            />
          </line>
        ))}
    </group>
  )
}

export default () => (
  <div>
    <pre style={{ position: 'absolute', fontSize: '2em', padding: '1em 2em' }}>
      f = sin(x*x + y*y + t)
    </pre>
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <OneLine />
      <Control />
    </Canvas>
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
      }
    `}</style>
  </div>
)
