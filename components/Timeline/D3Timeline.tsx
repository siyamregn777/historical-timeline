
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
          .translate(dimensions.width / 2, dimensions.height / 2)
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

    // Define clip paths for circular images
    const defs = svg.append('defs');
    defs.append('clipPath')
      .attr('id', 'circle-clip')
      .append('circle')
      .attr('r', 25);
    
    defs.append('clipPath')
      .attr('id', 'circle-clip-pillar')
      .append('circle')
      .attr('r', 35);

    const xScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

    // Y scale for vertical panning
    const yScale = d3.scaleLinear()
      .domain([-1000, 1000])
      .range([dimensions.height + 1000, dimensions.height - 1000]);

    // Layers
    const mainLayer = svg.append('g').attr('class', 'main-layer');
    
    // Axis Layer (Stays at the bottom, not transformed by Y-panning to keep labels visible)
    const axisGroup = svg.append('g').attr('class', 'axis-layer shadow-xl')
      .attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);
    
    axisGroup.append('rect')
      .attr('width', dimensions.width)
      .attr('height', UI_CONFIG.AXIS_HEIGHT)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.9);

    const baselineY = dimensions.height / 2;

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
          const labelWidth = item.title[lang].length * 10 + 80;
          return {
            id: item.id,
            item,
            importance: item.importance,
            width: labelWidth,
            height: 60,
            x: xScale(item.startYear),
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
      
      // Update the main layer to handle both X and Y panning
      mainLayer.attr('transform', transform.toString());

      // Update Axis (only X rescaled, fixed at bottom)
      const axis = d3.axisBottom(newXScale)
        .ticks(dimensions.width / 150)
        .tickFormat(d => formatYear(d as number, lang));
      
      axisGroup.select<SVGGElement>('.axis-content').remove();
      const axisContent = axisGroup.append('g').attr('class', 'axis-content');
      axisContent.call(axis as any);
      axisContent.select('.domain').attr('stroke', '#cbd5e1').attr('stroke-width', 2);
      axisContent.selectAll('.tick text').attr('class', 'font-black text-[12px] fill-slate-400').attr('dy', '20px');

      const visibleNodes = getVisibleNodes(k);

      const simulation = d3.forceSimulation<SimulationNode>(visibleNodes)
        .force('x', d3.forceX<SimulationNode>(d => xScale(d.item.startYear)).strength(5))
        .force('y', d3.forceY(baselineY).strength(0.05))
        .force('collide', d3.forceCollide<SimulationNode>().radius(d => (d.width / 2 / k) + 20).iterations(2))
        .stop();

      for (let i = 0; i < 40; ++i) simulation.tick();

      const nodesSelection = mainLayer.selectAll<SVGGElement, SimulationNode>('.item-node')
        .data(visibleNodes, d => d.id);

      nodesSelection.exit().remove();

      const enter = nodesSelection.enter()
        .append('g')
        .attr('class', 'item-node cursor-pointer')
        .on('click', (e, d) => onSelectItem(d.item));

      enter.append('line')
        .attr('class', 'stem-line')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', (d: any) => 1.5 / k)
        .attr('stroke-dasharray', '4,4');

      const content = enter.append('g').attr('class', 'content-group');

      // Colored Outer Circle
      content.append('circle')
        .attr('class', 'node-circle-outer')
        .attr('stroke-width', (d: any) => 4 / k);

      // Inner Image with Clip Path
      content.append('image')
        .attr('class', 'node-image')
        .attr('preserveAspectRatio', 'xMidYMid slice');

      content.append('text')
        .attr('class', 'node-label font-black fill-slate-900')
        .style('paint-order', 'stroke')
        .style('stroke', 'white')
        .style('stroke-width', (d: any) => `${4 / k}px`);

      const merged = nodesSelection.merge(enter as any);

      merged.attr('transform', d => `translate(${d.x}, ${d.y})`);

      merged.select('.stem-line')
        .attr('x1', 0).attr('x2', 0)
        .attr('y1', 0).attr('y2', d => (baselineY - (d.y || 0)));

      merged.select('.node-circle-outer')
        .attr('fill', d => categories.find(c => c.id === d.item.category)?.color || '#000')
        .attr('stroke', 'white')
        .attr('r', d => (d.importance === 1 ? 40 : 30) / k);

      merged.select('.node-image')
        .attr('xlink:href', d => d.item.imageUrl || `https://picsum.photos/seed/${d.id}/100/100`)
        .attr('x', d => (d.importance === 1 ? -35 : -25) / k)
        .attr('y', d => (d.importance === 1 ? -35 : -25) / k)
        .attr('width', d => (d.importance === 1 ? 70 : 50) / k)
        .attr('height', d => (d.importance === 1 ? 70 : 50) / k)
        .attr('clip-path', d => d.importance === 1 ? 'url(#circle-clip-pillar)' : 'url(#circle-clip)');

      // Update clip path scales dynamically for zoom
      defs.select('#circle-clip circle').attr('r', 25 / k);
      defs.select('#circle-clip-pillar circle').attr('r', 35 / k);

      merged.select('.node-label')
        .attr('dx', isRTL ? -45 / k : 45 / k)
        .attr('dy', 10 / k)
        .attr('text-anchor', isRTL ? 'end' : 'start')
        .style('font-size', d => `${(d.importance === 1 ? 18 : 14) / k}px`)
        .text(d => d.item.title[lang]);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.01, 200])
      .on('zoom', (event) => updateView(event.transform));

    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial View
    const initialT = d3.zoomIdentity
      .translate(dimensions.width / 2, dimensions.height / 2)
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
      
      {/* HUD: Background Label */}
      <div className={`absolute top-24 ${isRTL ? 'right-12 text-right' : 'left-12 text-left'} pointer-events-none opacity-5`}>
        <div className="text-[120px] font-black uppercase tracking-tighter text-slate-900 leading-none select-none">
          {isRTL ? 'היסטוריה' : 'History'}
        </div>
      </div>
    </div>
  );
});

export default D3Timeline;
