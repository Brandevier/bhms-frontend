import React from 'react'
import Header from  '../../components/Header'
import HeroSection from '../../components/HeroSection'
import Features from '../../components/Features'
import EarlyAdopterBanner from '../../components/EarlyAdopterBanner'
import NewsletterSignup from '../../components/NewsletterSignup'
import Footer from '../../components/Footer' 



const Homepage = () => {
  return (
    <>
     <Header />
      <HeroSection />
      <Features />
      <EarlyAdopterBanner />
      <NewsletterSignup />
      <Footer />
    </>
  )
}

export default Homepage
