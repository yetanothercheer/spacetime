import { useRef } from 'react'
import { useThree, useFrame, extend } from 'react-three-fiber'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

const Control = () => {
  const ref = useRef()
  const { camera, gl } = useThree()

  useFrame(() => {
    ref.current?.update()
  })

  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      enabled={true}
      enableZoom={true}
      zoomSpeed={1.0}
      enableRotate={true}
      rotateSpeed={1.0}
      enablePan={true}
      panSpeed={1.0}
      minDistance={0}
      maxDistance={Infinity}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
    />
  )
}

export default Control