
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
  selectedItemId?: string | null;
  onSelectItem: (item: TimelineItem | null) => void;
}

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, categories, lang, selectedCategories, selectedItemId, onSelectItem }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null);
  const [currentK, setCurrentK] = useState(0.08);
  
  // Persistence: Store the last transform to avoid resetting when the detail panel opens/closes
  const lastTransform = useRef<d3.ZoomTransform | null>(null);
  
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
          .translate(dimensions.width / 2, dimensions.height - 200)
          .scale(0.08) 
          .translate(-xScale(0), 0);
        
        lastTransform.current = initialT;
        d3.select(svgRef.current).transition().duration(800).call(zoomRef.current.transform, initialT);
      }
    }
  }), [dimensions, isRTL]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

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

    const mainLayer = svg.append('g').attr('class', 'main-layer');
    
    // Axis Layer (Fixed at bottom)
    const axisGroup = svg.append('g').attr('class', 'axis-layer')
      .attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);
    
    axisGroup.append('rect')
      .attr('width', dimensions.width)
      .attr('height', UI_CONFIG.AXIS_HEIGHT)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.95);

    const baselineY = dimensions.height - UI_CONFIG.AXIS_HEIGHT - 60;

    const getVisibleNodes = (k: number): SimulationNode[] => {
      return items
        .filter(item => selectedCategories.includes(item.category))
        .filter(item => item.id !== selectedItemId)
        .filter(item => {
          if (item.importance === 1) return k > 0.04 && k < 1.5;
          if (item.importance === 2) return k > 0.35 && k < 6.0;
          if (item.importance === 3) return k > 1.2;
          if (item.importance === 4) return k > 3.0;
          return k > 6.0;
        })
        .map(item => {
          const textWidth = item.title[lang].length * 12;
          const totalWidth = (item.importance === 1 ? 100 : 70) + textWidth;
          
          return {
            id: item.id,
            item,
            importance: item.importance,
            width: totalWidth,
            height: 120,
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
      setCurrentK(k);
      lastTransform.current = transform; // Persist state
      
      const newXScale = transform.rescaleX(xScale);
      mainLayer.attr('transform', transform.toString());
      
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
        .force('y', d3.forceY(baselineY).strength(0.15))
        .force('collide', d3.forceCollide<SimulationNode>().radius(d => {
          const visualWidth = d.width + 40; 
          return (visualWidth / k) / 1.5;
        }).iterations(5))
        .stop();

      for (let i = 0; i < 80; ++i) simulation.tick();

      const nodesSelection = mainLayer.selectAll<SVGGElement, SimulationNode>('.item-node')
        .data(visibleNodes, d => d.id);

      nodesSelection.exit().remove();

      const enter = nodesSelection.enter()
        .append('g')
        .attr('class', 'item-node cursor-pointer')
        .on('click', (e, d) => onSelectItem(d.item));

      enter.append('line')
        .attr('class', 'stem-line')
        .attr('stroke', '#f1f5f9')
        .attr('stroke-width', (d: any) => 2 / k)
        .attr('stroke-dasharray', '4,4');

      const content = enter.append('g').attr('class', 'content-group');

      content.append('circle')
        .attr('class', 'node-circle-outer')
        .attr('stroke-width', (d: any) => 4 / k);

      content.append('image')
        .attr('class', 'node-image')
        .attr('preserveAspectRatio', 'xMidYMid slice');

      content.append('text')
        .attr('class', 'node-label font-black fill-slate-900')
        .style('paint-order', 'stroke')
        .style('stroke', 'white')
        .style('stroke-width', (d: any) => `${6 / k}px`);

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

    // PERSISTENCE: Apply last known transform if it exists, otherwise use initial
    const initialT = d3.zoomIdentity
      .translate(dimensions.width / 2, dimensions.height - 200)
      .scale(0.08) 
      .translate(-xScale(0), 0);
    
    const targetT = lastTransform.current || initialT;
    
    svg.call(zoom.transform, targetT);
    updateView(targetT);

  }, [dimensions, lang, items, selectedCategories, categories, selectedItemId]);

  return (
    <div className="w-full h-full relative bg-white overflow-hidden select-none">
      {/* HUD: FIXED CENTER LABEL - FIXED SIZE AND INDEPENDENT OF ZOOM */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div 
          className="text-slate-900 font-black uppercase tracking-tighter text-center select-none whitespace-nowrap opacity-[0.05]"
          style={{ 
            fontSize: 'min(14vw, 160px)',
          }}
         >
           {isRTL ? 'תולדות ישראל' : 'Jewish History'}
         </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
      
      <svg ref={svgRef} className="w-full h-full timeline-svg relative z-10" />
    </div>
  );
});

export default D3Timeline;
