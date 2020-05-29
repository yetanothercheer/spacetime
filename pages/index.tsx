import dynamic from 'next/dynamic'

export const Home = dynamic(
  () => import('./demo'),
  { ssr: false }
)

export default Home
