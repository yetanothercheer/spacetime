import dynamic from 'next/dynamic'
import fs from 'fs'
import path from 'path'
import { useState } from 'react'

export const getStaticProps = async () => {
  return {
    props: {
      scenes: fs
        .readdirSync(path.join(process.cwd(), 'src/scenes'))
        .map((n) => n.split('.')[0]),
    },
  }
}

const Overlay = ({ scenes, onSelectScene }) => {
  const [a, sa] = useState(true)

  return (
    <div className="overlay">
      <div onClick={() => sa((a) => !a)}>+</div>
      <div className="scenes">
        {a &&
          scenes.map((s) => (
            <div key={s} onClick={() => onSelectScene(s)}>
              {s}
            </div>
          ))}
      </div>
      <style jsx>
        {`
          .overlay {
            font-size: 1.3em;
            text-align: right;
            font-family: monospace;
            position: absolute;
            top: 0;
            right: 0;
            margin: 2em 4em;
            user-select: none;
          }
          .scenes {
            padding-top: 1em;
          }
          .scenes div {
            padding-top: 1em;
          }
          .overlay div {
            cursor: pointer;
          }
        `}
      </style>
    </div>
  )
}

export default ({ scenes }) => {
  const [s, ss] = useState('demo')

  let scene = <></>
  if (s) {
    const Scene = dynamic(() => import(`../scenes/${s}`), { ssr: false })
    scene = <Scene />
  }

  return (
    <div>
      {scene}
      <Overlay scenes={scenes} onSelectScene={(s) => ss(s)} />
    </div>
  )
}
