import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Section1 from './components/section1/Section1'
import Section2 from './components/section2/Section2'

function App() {
	return (
		<>
			<Navbar />
			<Hero />
			<Intro />
			<Section1 />
			<Section2 />
		</>
	)
}

export default App
