import About from '@/components/About'
import AIToolListing from '@/components/AIToolListing'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import HeroSection from '@/components/HeaderSection'
import React from 'react'

function HomePage() {
  return (
    <div>
        <Header/>
        <HeroSection/>
        <AIToolListing/>
        <About/>
        <Footer/>
    </div>
  )
}

export default HomePage