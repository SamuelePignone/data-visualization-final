import React, { useState, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Section1 from './components/section1/Section1'
import Section2 from './components/section2/Test'
import Heatmap from './components/section3/Heatmap'
import MultipleBarChart from './components/multiplebarchart/MultipleBarChart'
import LineChart from './components/linechart/Linechart'
import PackedBubble from './components/packed_bubble/packed_bubble'
import AreaChart from './components/areachart/Areachart'
import StackedBarChart from './components/stackedbarchart/Stackedbarchart'
import SpiderChart from './components/spiderchart/SpiderChart'
import BarChart from './components/barchart/Barchart'
import Team from './components/Team'
import Footer from './components/Footer'

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
			<PackedBubble />
			<AreaChart />
			<StackedBarChart />
			<SpiderChart />
			<BarChart />

			<Team />
			<Footer />
		</>
	)
}

export default App
