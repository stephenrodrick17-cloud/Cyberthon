import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'
import { motion } from 'framer-motion'
import { Search, ZoomIn, ZoomOut, RefreshCw, Maximize, Filter, Info } from 'lucide-react'
import { graphApi, predictApi } from '../api'
import { cytoscapeStyles } from '../utils/cytoscapeStyles'
import { useQuery } from '@tanstack/react-query'
import RiskBadge from '../components/RiskBadge'

cytoscape.use(fcose)

export default function GraphExplorer() {
  const containerRef = useRef(null)
  const cyRef = useRef(null)
  const [searchId, setSearchId] = useState('230425980') // Default sample
  const [selectedNode, setSelectedNode] = useState(null)
  const [hops, setHops] = useState(2)

  const { data: graphData, refetch, isFetching } = useQuery({
    queryKey: ['graph', searchId, hops],
    queryFn: () => graphApi.getDatasetGraph(searchId, hops),
    enabled: !!searchId
  })

  const { data: nodeDetail } = useQuery({
    queryKey: ['node-predict', selectedNode],
    queryFn: () => predictApi.getDatasetTx(selectedNode),
    enabled: !!selectedNode
  })

  useEffect(() => {
    if (!containerRef.current || !graphData) return

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: graphData,
      style: cytoscapeStyles,
      layout: {
        name: 'fcose',
        animate: true,
        randomize: true,
        fit: true,
        padding: 50
      }
    })

    cyRef.current.on('tap', 'node', (evt) => {
      setSelectedNode(evt.target.id())
    })

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) setSelectedNode(null)
    })

    return () => {
      if (cyRef.current) cyRef.current.destroy()
    }
  }, [graphData])

  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.fit()
      cyRef.current.layout({ name: 'fcose', animate: true }).run()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col space-y-8 z-10">
        <div>
          <h2 className="text-xl font-bold mb-1">Graph Explorer</h2>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Dataset Mode</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">Search Transaction ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refetch()}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="txid..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-slate-400">Hop Depth</label>
              <span className="text-xs font-mono text-blue-400">{hops}</span>
            </div>
            <input
              type="range" min="1" max="4" step="1"
              value={hops} onChange={(e) => setHops(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            <span>{isFetching ? 'Loading...' : 'Update Graph'}</span>
          </button>
        </div>

        {/* Legend */}
        <div className="pt-8 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Legend</h3>
          <div className="space-y-2">
            {[
              { label: 'Licit', color: 'bg-green-500' },
              { label: 'Illicit', color: 'bg-red-500' },
              { label: 'Unknown / Predicted', color: 'bg-slate-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Detail */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-grow pt-8 border-t border-slate-800 space-y-4 overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-sm">Node Info</h3>
              <RiskBadge level={nodeDetail?.label === 'illicit' ? 'HIGH' : 'LOW'} />
            </div>
            
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Transaction ID</p>
              <p className="font-mono text-xs text-blue-400 break-all">{selectedNode}</p>
            </div>

            {nodeDetail && (
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Risk Prob</span>
                  <span className="font-mono text-blue-400">{(nodeDetail.illicit_prob * 100).toFixed(2)}%</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Top Drivers</p>
                  <div className="flex flex-wrap gap-1">
                    {nodeDetail.top_features.map(f => (
                      <span key={f} className="px-2 py-1 bg-slate-800 rounded text-[9px] text-slate-300 border border-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-grow relative bg-slate-950">
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-8 right-8 flex flex-col space-y-2">
          <button onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)} className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-400"><ZoomIn size={20}/></button>
          <button onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)} className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-400"><ZoomOut size={20}/></button>
          <button onClick={handleReset} className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-400"><Maximize size={20}/></button>
        </div>

        {isFetching && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3">
              <Loader2 className="animate-spin text-blue-500" size={18} />
              <span className="text-sm font-medium">Reconstructing Subgraph...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Loader2(props) {
  return <RefreshCw {...props} />
}
