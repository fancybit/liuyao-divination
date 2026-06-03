'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Users } from 'lucide-react'

interface GraphNode {
  id: string
  username: string
  total_divinations: number
}

interface GraphLink {
  source: string
  target: string
  weight: number
}

export default function NetworkPage() {
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState(0)
  const [connectionCount, setConnectionCount] = useState(0)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [links, setLinks] = useState<GraphLink[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    loadNetworkData()
  }, [])

  const loadNetworkData = async () => {
    // Get all users with public records
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, total_divinations')
      .gt('total_divinations', 0)
      .limit(50)

    // Get all connections
    const { data: connections } = await supabase
      .from('user_connections')
      .select('user_id, connected_user_id, weight')
      .limit(200)

    if (profiles) {
      const nodeList: GraphNode[] = profiles.map(p => ({
        id: p.id,
        username: p.username,
        total_divinations: p.total_divinations,
      }))
      setNodes(nodeList)
      setUserCount(nodeList.length)
    }

    if (connections) {
      const linkList: GraphLink[] = connections.map(c => ({
        source: c.user_id,
        target: c.connected_user_id,
        weight: c.weight,
      }))
      setLinks(linkList)
      setConnectionCount(linkList.length)
    }

    setLoading(false)
  }

  // D3 force simulation using Canvas alternative
  useEffect(() => {
    if (nodes.length === 0 || !svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth || 800
    const height = 500

    // Simple force layout simulation
    const nodePositions: Map<string, { x: number; y: number; vx: number; vy: number }> = new Map()

    // Initialize positions in a circle
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35
    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length
      nodePositions.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      })
    })

    // Simple force simulation
    let frame = 0
    const maxFrames = 100
    const animId = setInterval(() => {
      if (frame >= maxFrames) {
        clearInterval(animId)
        renderFrame()
        return
      }

      // Repulsion between nodes
      const nodeIds = Array.from(nodePositions.keys())
      for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
          const a = nodePositions.get(nodeIds[i])!
          const b = nodePositions.get(nodeIds[j])!
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
          const force = 800 / (dist * dist)
          a.vx -= (dx / dist) * force * 0.1
          a.vy -= (dy / dist) * force * 0.1
          b.vx += (dx / dist) * force * 0.1
          b.vy += (dy / dist) * force * 0.1
        }
      }

      // Attraction along links
      links.forEach(link => {
        const a = nodePositions.get(link.source)
        const b = nodePositions.get(link.target)
        if (!a || !b) return
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const force = dist * 0.01
        a.vx += (dx / dist) * force
        a.vy += (dy / dist) * force
        b.vx -= (dx / dist) * force
        b.vy -= (dy / dist) * force
      })

      // Center gravity
      nodePositions.forEach(pos => {
        pos.vx += (centerX - pos.x) * 0.005
        pos.vy += (centerY - pos.y) * 0.005
        pos.vx *= 0.85
        pos.vy *= 0.85
        pos.x += pos.vx
        pos.y += pos.vy
      })

      frame++
      if (frame % 5 === 0) renderFrame()
    }, 30)

    function renderFrame() {
      const existingLines = svg.querySelectorAll('.network-line')
      const existingNodes = svg.querySelectorAll('.network-node')
      existingLines.forEach(el => el.remove())
      existingNodes.forEach(el => el.remove())

      // Draw lines
      links.forEach(link => {
        const a = nodePositions.get(link.source)
        const b = nodePositions.get(link.target)
        if (!a || !b) return
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', String(a.x))
        line.setAttribute('y1', String(a.y))
        line.setAttribute('x2', String(b.x))
        line.setAttribute('y2', String(b.y))
        line.setAttribute('stroke', '#d4a373')
        line.setAttribute('stroke-width', String(Math.min(link.weight, 3)))
        line.setAttribute('opacity', '0.4')
        line.classList.add('network-line')
        svg.appendChild(line)
      })

      // Draw nodes
      nodePositions.forEach((pos, id) => {
        const node = nodes.find(n => n.id === id)
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        group.classList.add('network-node')
        group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`)

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        const r = Math.min(10 + node!.total_divinations * 2, 30)
        circle.setAttribute('r', String(r))
        circle.setAttribute('fill', '#c47027')
        circle.setAttribute('opacity', '0.8')
        circle.setAttribute('stroke', '#fff')
        circle.setAttribute('stroke-width', '1.5')

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('dy', String(r + 14))
        text.setAttribute('fill', '#666')
        text.setAttribute('font-size', '11')
        text.textContent = node?.username || '...'

        group.appendChild(circle)
        group.appendChild(text)
        svg.appendChild(group)
      })
    }

    return () => clearInterval(animId)
  }, [nodes, links])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-2">六度关系网</h1>
      <p className="text-center text-gray-500 mb-8">可视化用户之间的占卜关联</p>

      {/* Stats */}
      <div className="flex justify-center space-x-8 mb-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600">{userCount}</p>
          <p className="text-sm text-gray-500">占卜者</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600">{connectionCount}</p>
          <p className="text-sm text-gray-500">关联数</p>
        </div>
      </div>

      {/* Graph */}
      <div className="card">
        {nodes.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">暂无关联网数据</p>
            <p className="text-sm text-gray-400 mt-2">用户开始占卜并建立关联后，关系网将在此显示</p>
          </div>
        ) : (
          <svg ref={svgRef} className="w-full" style={{ height: '500px', minHeight: '500px' }} viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" />
        )}
      </div>

      {/* Legend */}
      <div className="text-center mt-4 text-sm text-gray-400">
        节点大小代表占卜次数 | 连线代表占卜关联（如查看/互动）
      </div>
    </div>
  )
}