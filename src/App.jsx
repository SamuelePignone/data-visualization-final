import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Sankey, SankeyNode, SankeyLink, AreaChart } from 'reaviz';
import './App.css'

const data = [
  {
    key: new Date('11/29/2019'),
    data: 10
  },
  {
    key: new Date('11/30/2019'),
    data: 14
  },
  {
    key: new Date('12/01/2019'),
    data: 5
  },
  {
    key: new Date('12/02/2019'),
    data: 18
  }
];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div style={{ margin: '55px', textAlign: 'center' }}>
        <Sankey
          height={300}
          width={500}
          nodes={[
            <SankeyNode title="A1" id="1" />,
            <SankeyNode title="A2" id="2" />,
            <SankeyNode title="B1" id="3" />,
            <SankeyNode title="B2" id="4" />
          ]}
          links={[
            <SankeyLink source="1" target="3" value="8" gradient={false} />,
            <SankeyLink source="2" target="4" value="4" gradient={false} />,
            <SankeyLink source="1" target="4" value="2" gradient={false} />
          ]}
        />
      </div>
      <div style={{ margin: '55px', textAlign: 'center' }}>
        <AreaChart width={350} height={250} data={data} />
      </div>
    </>
  )
}

export default App
