import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import TestiMonials from '../components/TestiMonials'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
import { IconCloudDemo } from '../components/IconCloudDemo'

const Home = () => {
  return (
    <div>   
      <Navbar/>
      <Hero/>
      <IconCloudDemo/>
      <AiTools/>
      <TestiMonials/>
      <Plan/>
      <Footer/>
    </div>
  )
}

export default Home