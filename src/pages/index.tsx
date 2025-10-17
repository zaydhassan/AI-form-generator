import type { NextPage } from 'next'
import Hero from '../components/Hero'
import Features from '../components/Features'

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}

export default Home