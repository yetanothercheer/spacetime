import dynamic from 'next/dynamic'

export const Home = dynamic(() => import('../components/demo'), { ssr: false })

export default Home
