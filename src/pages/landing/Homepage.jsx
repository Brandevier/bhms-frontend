import React from 'react'
import Header from  '../../components/Header'
import HeroSection from '../../components/HeroSection'
import Features from '../../components/Features'
import EarlyAdopterBanner from '../../components/EarlyAdopterBanner'
import NewsletterSignup from '../../components/NewsletterSignup'
import Footer from '../../components/Footer' 
import ComparisonTable from '../../components/ComparismTable'
import SecurityCompliance from '../../components/SecurityCompliance'
import AppComingSoon from '../../components/AppComingSoon'
import ContactUs from '../../components/contactUs'
import TryDemoSection from '../../components/TryDemoSection'




const Homepage = () => {
  return (
    <>
     <Header />
      <HeroSection />
      <Features />
      {/* <EarlyAdopterBanner /> */}
      <ComparisonTable/>
      <TryDemoSection/>
      <SecurityCompliance/>
      <AppComingSoon/>
      <ContactUs/>
      <NewsletterSignup />
      <Footer />
    </>
  )
}

export default Homepage
