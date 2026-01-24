
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { TimelineItem, Language, TimelineRef, Category, ItemType } from '../../types';
import { UI_CONFIG } from '../../constants';
import { formatYear } from '../../utils/layoutEngine';

interface Props {
  items: TimelineItem[];
  categories: Category[];
  lang: Language;
  selectedCategories: string[];
  selectedItemId?: string | null;
  onSelectItem: (item: TimelineItem | null) => void;
  onZoomScaleChange?: (scale: number) => void;
}

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, categories, lang, selectedCategories, selectedItemId, onSelectItem, onZoomScaleChange }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null);
  const lastTransform = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const isInternalUpdate = useRef(false);
  
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
        d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.scaleBy, 1.5);
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.scaleBy, 0.75);
      }
    },
    setZoomScale: (scale: number) => {
      if (svgRef.current && zoomRef.current) {
        isInternalUpdate.current = true;
        d3.select(svgRef.current).transition().duration(0).call(zoomRef.current.scaleTo, scale);
        isInternalUpdate.current = false;
      }
    },
    reset: () => {
      if (svgRef.current && zoomRef.current && dimensions.width > 0) {
        const xScale = d3.scaleLinear()
          .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
          .range([0, dimensions.width]);
        
        const centerYear = 0;
        const targetX = dimensions.width / 2 - xScale(centerYear);
        
        d3.select(svgRef.current).transition().duration(800)
          .call(zoomRef.current.transform, d3.zoomIdentity.translate(targetX, 0).scale(1));
      }
    }
  }), [dimensions]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    defs.append('clipPath').attr('id', 'circle-clip').append('circle').attr('r', 10);
    defs.append('clipPath').attr('id', 'circle-clip-pillar').append('circle').attr('r', 16);

    const xScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range([0, dimensions.width]);

    const mainLayer = svg.append('g').attr('class', 'main-layer');
    const axisGroup = svg.append('g').attr('class', 'axis-layer').attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);
    
    axisGroup.append('rect').attr('width', dimensions.width).attr('height', UI_CONFIG.AXIS_HEIGHT).attr('fill', '#ece9e2').attr('fill-opacity', 0.95);

    const calculateDynamicLayout = (k: number, currentXScale: d3.ScaleLinear<number, number>) => {
      // 1. Zoom-based Level of Detail Filtering
      let filtered = items
        .filter(item => selectedCategories.includes(item.category))
        .filter(item => {
          if (item.importance === 1) return true; 
          if (k <= 1.2) return false; 
          if (item.importance === 2) return k > 1.5;
          if (item.importance === 3) return k > 6;
          if (item.importance === 4) return k > 15;
          if (item.importance === 5) return k > 35;
          return false;
        });

      // 2. Special Case: Overlap resolution for start view
      if (k <= 1.2) {
        filtered = filtered.sort((a, b) => a.importance - b.importance).slice(0, 5);
      }

      // 3. Lane-Packing with Top-Edge Safety
      const labelWidth = 220; 
      const hBuffer = k < 2 ? 180 : 120 / k; // Higher buffer at low zoom to prevent overlap
      const topSafeBound = 60; // Minimum px from top of SVG to prevent cropping
      const axisY = dimensions.height - UI_CONFIG.AXIS_HEIGHT - 40;
      
      const maxPossibleLanes = 80;
      const occupiedLanes: { [lane: number]: number } = {};

      const finalNodes = [];

      // Sort by Year for greedy left-to-right packing
      const sorted = [...filtered].sort((a, b) => a.startYear - b.startYear);

      // Pre-calculate dynamic lane height based on screen size
      const laneHeight = Math.max(32, Math.min(50, (axisY - topSafeBound) / 12));

      for (const item of sorted) {
        const xPos = currentXScale(item.startYear);
        let lane = 0;
        let found = false;
        
        // Initial view logic: strictly enforce 5 separated lanes
        if (k <= 1.2) {
          const startBands = [4, 8, 12, 16, 20];
          const idx = filtered.indexOf(item);
          lane = startBands[idx % startBands.length] || 0;
          found = true;
        } else {
          // Standard lane packing logic
          while (lane < maxPossibleLanes) {
            const lastX = occupiedLanes[lane] || -Infinity;
            if (xPos > lastX + hBuffer) {
              found = true;
              break;
            }
            lane++;
          }
        }

        if (found) {
          const yPos = axisY - (lane * laneHeight);
          
          // CRITICAL: Filter out any data that is cropped by the top edge
          if (yPos > topSafeBound) {
            occupiedLanes[lane] = xPos + labelWidth;
            finalNodes.push({
              id: item.id,
              item: item,
              x: xPos,
              y: yPos,
              lane: lane
            });
          }
        }
      }

      return finalNodes;
    };

    const updateView = (transform: d3.ZoomTransform) => {
      const k = transform.k;
      lastTransform.current = transform; 
      if (onZoomScaleChange && !isInternalUpdate.current) onZoomScaleChange(k);
      
      const newXScale = transform.rescaleX(xScale);
      
      const axis = d3.axisBottom(newXScale)
        .ticks(Math.max(6, dimensions.width / 150))
        .tickFormat(d => formatYear(d as number, lang));
        
      axisGroup.select<SVGGElement>('.axis-content').remove();
      const axisContent = axisGroup.append('g').attr('class', 'axis-content').call(axis as any);
      axisContent.select('.domain').attr('stroke', '#78716c').attr('stroke-width', 2);
      axisContent.selectAll('.tick text').attr('class', 'font-black text-[10px] fill-stone-500').attr('dy', '22px');

      const nodes = calculateDynamicLayout(k, newXScale);

      const nodesSelection = mainLayer.selectAll<SVGGElement, any>('.item-node')
        .data(nodes, d => d.id);
        
      nodesSelection.exit().remove();

      const enter = nodesSelection.enter().append('g')
        .attr('class', 'item-node cursor-pointer group')
        .on('click', (e, d) => onSelectItem(d.item));
        
      enter.append('line').attr('class', 'stem-line')
        .attr('stroke', '#a8a29e')
        .attr('stroke-dasharray', '2,4')
        .attr('opacity', 0.4);
        
      const content = enter.append('g').attr('class', 'content-group');
      content.append('circle').attr('class', 'node-circle-outer');
      content.append('image').attr('class', 'node-image').attr('preserveAspectRatio', 'xMidYMid slice');
      content.append('text').attr('class', 'node-label font-bold fill-stone-900').style('paint-order', 'stroke').style('stroke', '#ece9e2');

      const merged = nodesSelection.merge(enter as any);
      
      merged.attr('transform', d => `translate(${d.x}, ${d.y})`);
      
      merged.select('.stem-line')
        .attr('x1', 0).attr('x2', 0)
        .attr('y1', 0).attr('y2', d => (dimensions.height - UI_CONFIG.AXIS_HEIGHT) - d.y)
        .attr('stroke-width', 1.5);
        
      merged.select('.node-circle-outer')
        .attr('fill', d => categories.find(c => c.id === d.item.category)?.color || '#000')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('r', d => (d.item.importance === 1 ? 16 : 10));
        
      merged.select('.node-image')
        .attr('xlink:href', d => d.item.imageUrl || `https://picsum.photos/seed/${d.id}/40/40`)
        .attr('x', d => (d.item.importance === 1 ? -14 : -8))
        .attr('y', d => (d.item.importance === 1 ? -14 : -8))
        .attr('width', d => (d.item.importance === 1 ? 28 : 16))
        .attr('height', d => (d.item.importance === 1 ? 28 : 16))
        .attr('clip-path', d => d.item.importance === 1 ? 'url(#circle-clip-pillar)' : 'url(#circle-clip)');
      
      merged.select('.node-label')
        .attr('dx', isRTL ? -24 : 24)
        .attr('dy', 5)
        .attr('text-anchor', isRTL ? 'end' : 'start')
        .style('font-size', d => `${(d.item.importance === 1 ? 14 : 11)}px`)
        .style('stroke-width', '5px')
        .text(d => d.item.title[lang]);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 100])
      .translateExtent([[-dimensions.width * 100, -100], [dimensions.width * 100, 100]])
      .on('zoom', (event) => updateView(event.transform));

    zoomRef.current = zoom;
    svg.call(zoom);
    
    if (lastTransform.current.k === 1 && lastTransform.current.x === 0) {
      const centerYear = 0;
      const initialOffset = dimensions.width / 2 - xScale(centerYear);
      const initialTransform = d3.zoomIdentity.translate(initialOffset, 0).scale(1);
      lastTransform.current = initialTransform;
      svg.call(zoom.transform, initialTransform);
    } else {
      svg.call(zoom.transform, lastTransform.current);
    }
    
    updateView(lastTransform.current);

  }, [dimensions, lang, items, selectedCategories, categories, selectedItemId, onZoomScaleChange]);

  return (
    <div className="w-full h-full relative bg-[#ece9e2] overflow-hidden select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div className="text-stone-800 font-black uppercase tracking-tighter text-center opacity-[0.06] select-none pointer-events-none" style={{ fontSize: 'min(10vw, 110px)' }}>
           {isRTL ? 'תולדות ישראל' : 'Jewish History'}
         </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <svg ref={svgRef} className="w-full h-full timeline-svg relative z-10" />
    </div>
  );
});

export default D3Timeline;
