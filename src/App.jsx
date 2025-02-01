import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import Features from './components/Features'
import EarlyAdopterBanner from './components/EarlyAdopterBanner'
import Footer from './components/Footer'
import NewsletterSignup from './components/NewsletterSignup'


function App() {
  const [count, setCount] = useState(0)

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

export default App
