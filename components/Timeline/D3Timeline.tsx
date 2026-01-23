
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { TimelineItem, Language, TimelineRef, Category, SimulationNode } from '../../types';
import { UI_CONFIG } from '../../constants';
import { formatYear } from '../../utils/layoutEngine';

interface Props {
  items: TimelineItem[];
  categories: Category[];
  lang: Language;
  selectedCategories: string[];
  onSelectItem: (item: TimelineItem | null) => void;
}

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, categories, lang, selectedCategories, onSelectItem }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null);
  
  const isRTL = lang === 'he';

  // State to track simulated nodes for rendering
  const [nodes, setNodes] = useState<SimulationNode[]>([]);

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current?.parentElement) {
        const { clientWidth, clientHeight } = svgRef.current.parentElement;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.scaleBy, 2);
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.scaleBy, 0.5);
      }
    },
    reset: () => {
      if (svgRef.current && zoomRef.current && dimensions.width > 0) {
        const xScale = d3.scaleLinear()
          .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
          .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

        const initialT = d3.zoomIdentity
          .translate(dimensions.width / 2, 0)
          .scale(0.1) 
          .translate(-xScale(0), 0);
        d3.select(svgRef.current).transition().duration(800).call(zoomRef.current.transform, initialT);
      }
    }
  }), [dimensions, isRTL]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

    // Layers
    const mainLayer = svg.append('g').attr('class', 'main-layer');
    const axisGroup = svg.append('g').attr('class', 'axis-layer')
      .attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);

    const baselineY = dimensions.height / 2;

    // --- Map Decluttering Logic ---
    
    // 1. Semantic Filter
    const getVisibleNodes = (k: number): SimulationNode[] => {
      return items
        .filter(item => selectedCategories.includes(item.category))
        .filter(item => {
          if (item.importance === 1) return true;
          if (item.importance === 2) return k > 0.08;
          if (item.importance === 3) return k > 0.3;
          if (item.importance === 4) return k > 0.8;
          return k > 1.5;
        })
        .map(item => {
          // Estimate bounding boxes for collision detection
          const labelWidth = item.title[lang].length * 10 + (item.imageUrl ? 60 : 0);
          return {
            id: item.id,
            item,
            importance: item.importance,
            width: labelWidth,
            height: 40,
            x: xScale(item.startYear), // Start at timeline pos
            y: baselineY,
            targetX: xScale(item.startYear),
            targetY: baselineY,
            opacity: 0
          } as SimulationNode;
        });
    };

    const updateView = (transform: d3.ZoomTransform) => {
      const k = transform.k;
      const newXScale = transform.rescaleX(xScale);

      // Render Axis
      const axis = d3.axisBottom(newXScale)
        .ticks(dimensions.width / 150)
        .tickFormat(d => formatYear(d as number, lang));
      
      axisGroup.call(axis as any);
      axisGroup.select('.domain').attr('stroke', '#cbd5e1').attr('stroke-width', 2);
      axisGroup.selectAll('.tick text').attr('class', 'font-black text-[12px] fill-slate-400').attr('dy', '20px');

      // Update Simulation Data
      const visibleNodes = getVisibleNodes(k);

      // Force Simulation for Decluttering
      const simulation = d3.forceSimulation<SimulationNode>(visibleNodes)
        .force('x', d3.forceX<SimulationNode>(d => newXScale(d.item.startYear)).strength(2)) // Strong horizontal anchor
        .force('y', d3.forceY(baselineY).strength(0.1)) // Gravity towards baseline
        .force('collide', d3.forceCollide<SimulationNode>().radius(d => {
          // Map-style: radius is effectively the label width
          // We use half-width + padding for circular approximation in D3 force
          return (d.width / 2) + 15; 
        }).iterations(4))
        .stop();

      // Run simulation until stable (tick many times instantly)
      for (let i = 0; i < 60; ++i) simulation.tick();

      // --- Rendering Pass ---
      const nodesSelection = mainLayer.selectAll<SVGGElement, SimulationNode>('.item-node')
        .data(visibleNodes, d => d.id);

      // Exit
      nodesSelection.exit().remove();

      // Enter
      const enter = nodesSelection.enter()
        .append('g')
        .attr('class', 'item-node cursor-pointer')
        .on('click', (e, d) => onSelectItem(d.item));

      // Draw stems (connector lines)
      enter.append('line')
        .attr('class', 'stem-line')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');

      // Draw container
      const content = enter.append('g').attr('class', 'content-group');

      content.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 8)
        .attr('stroke-width', 3);

      content.append('text')
        .attr('class', 'node-label font-black fill-slate-900')
        .attr('dx', isRTL ? -15 : 15)
        .attr('dy', 5)
        .style('paint-order', 'stroke')
        .style('stroke', 'white')
        .style('stroke-width', '4px');

      // Update All (Merge)
      const merged = nodesSelection.merge(enter as any);

      merged.attr('transform', d => `translate(${d.x}, ${d.y})`);

      merged.select('.stem-line')
        .attr('x1', 0).attr('x2', 0)
        .attr('y1', 0).attr('y2', d => baselineY - (d.y || 0));

      merged.select('.node-circle')
        .attr('fill', d => d.importance === 1 ? categories.find(c => c.id === d.item.category)?.color || '#000' : 'white')
        .attr('stroke', d => categories.find(c => c.id === d.item.category)?.color || '#ccc')
        .attr('r', d => d.importance === 1 ? 12 : 7);

      merged.select('.node-label')
        .attr('text-anchor', isRTL ? 'end' : 'start')
        .style('font-size', d => d.importance === 1 ? '16px' : '13px')
        .text(d => d.item.title[lang]);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.01, 100])
      .on('zoom', (event) => updateView(event.transform));

    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial View
    const initialT = d3.zoomIdentity
      .translate(dimensions.width / 2, 0)
      .scale(0.08) 
      .translate(-xScale(0), 0);
    
    svg.call(zoom.transform, initialT);
    updateView(initialT);

  }, [dimensions, lang, items, selectedCategories, categories]);

  return (
    <div className="w-full h-full relative bg-white overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
      
      <div className="absolute left-0 right-0 h-[2px] bg-slate-100 top-1/2 -translate-y-1/2 pointer-events-none" />
      
      <svg ref={svgRef} className="w-full h-full timeline-svg relative z-10" />
      
      {/* HUD: Current Era Label */}
      <div className={`absolute top-24 ${isRTL ? 'right-12 text-right' : 'left-12 text-left'} pointer-events-none opacity-10`}>
        <div className="text-[120px] font-black uppercase tracking-tighter text-slate-900 leading-none select-none">
          {isRTL ? 'היסטוריה' : 'History'}
        </div>
      </div>
    </div>
  );
});

export default D3Timeline;
