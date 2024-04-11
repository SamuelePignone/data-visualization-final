import React, { useState, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Section1 from './components/section1/Section1'
import Section2 from './components/section2/Test'
import Heatmap from './components/section3/Heatmap'
import MultipleBarChart from './components/multiplebarchart/MultipleBarChart'
import LineChart from './components/linechart/LineChart'

function App() {
	return (
		<>
			<Navbar />
			<Hero />
			<Intro />
			<Section1 />
			<Section2 />
			<Heatmap />
			<MultipleBarChart />
			<LineChart />
		</>
	)
}

export default App
