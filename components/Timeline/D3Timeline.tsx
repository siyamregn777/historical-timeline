
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { TimelineItem, Language, TimelineRef, Category } from '../../types';
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

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, categories, lang, selectedCategories, onSelectItem, onZoomScaleChange }, ref) => {
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
        d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.scaleBy, 2);
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.scaleBy, 0.5);
      }
    },
    setZoomScale: (scale: number) => {
      if (svgRef.current && zoomRef.current) {
        isInternalUpdate.current = true;
        d3.select(svgRef.current).transition().duration(0).call(zoomRef.current.scaleTo, scale);
        isInternalUpdate.current = false;
      }
    },
    jumpToYear: (year: number) => {
       if (svgRef.current && zoomRef.current && dimensions.width > 0) {
          const xScale = d3.scaleLinear().domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR]).range([0, dimensions.width]);
          d3.select(svgRef.current).transition().duration(800).call(zoomRef.current.translateTo, xScale(year), dimensions.height / 2);
       }
    },
    reset: () => {
      if (svgRef.current && zoomRef.current && dimensions.width > 0) {
        const xScale = d3.scaleLinear().domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR]).range([0, dimensions.width]);
        const initialTransform = d3.zoomIdentity.translate(dimensions.width / 2 - xScale(0), 0).scale(1);
        d3.select(svgRef.current).transition().duration(800).call(zoomRef.current.transform, initialTransform);
      }
    }
  }), [dimensions]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    defs.append('clipPath')
      .attr('id', 'marker-clip')
      .append('circle')
      .attr('r', UI_CONFIG.MARKER_SIZE / 2);

    const baseScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range([0, dimensions.width]);

    const mainLayer = svg.append('g').attr('class', 'main-layer');
    const axisGroup = svg.append('g').attr('class', 'axis-layer').attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);
    
    axisGroup.append('rect').attr('width', dimensions.width).attr('height', UI_CONFIG.AXIS_HEIGHT).attr('fill', '#fcfcfd');

    const resolveMapModel = (k: number, currentXScale: d3.ScaleLinear<number, number>) => {
      const [minYear, maxYear] = currentXScale.domain();
      const inViewport = items.filter(d => 
        d.startYear >= minYear && 
        d.startYear <= maxYear && 
        selectedCategories.includes(d.category)
      );

      // Find relevant tier
      const tier = UI_CONFIG.TIERS.find(t => k <= t.max) || UI_CONFIG.TIERS[UI_CONFIG.TIERS.length - 1];
      
      // Limit data as requested
      const limited = inViewport.slice(0, tier.count);
      
      const resolved: any[] = [];
      const laneOccupancy: { [lane: number]: number } = {};
      const spacing = UI_CONFIG.MARKER_SIZE + UI_CONFIG.MARKER_PADDING;

      // Sort items by year for collision pass
      limited.sort((a, b) => a.startYear - b.startYear).forEach(item => {
        const x = currentXScale(item.startYear);
        const hash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Strategy: Use hash to determine preferred vertical starting position, 
        // then find nearest available lane to create a scattered but non-overlapping look.
        const preferredLane = hash % UI_CONFIG.VERTICAL_LANES;
        let assignedLane = -1;

        // Search for nearest available lane
        for (let offset = 0; offset < UI_CONFIG.VERTICAL_LANES; offset++) {
          const checkLanes = [
            (preferredLane + offset) % UI_CONFIG.VERTICAL_LANES,
            (preferredLane - offset + UI_CONFIG.VERTICAL_LANES) % UI_CONFIG.VERTICAL_LANES
          ];

          for (const l of checkLanes) {
            const lastX = laneOccupancy[l] || -Infinity;
            if (x > lastX + spacing) {
              assignedLane = l;
              break;
            }
          }
          if (assignedLane !== -1) break;
        }

        if (assignedLane !== -1) {
          resolved.push({
            id: item.id,
            item,
            title: item.title[lang],
            startYear: item.startYear,
            lane: assignedLane,
            color: categories.find(c => c.id === item.category)?.color || '#94a3b8',
            imageUrl: item.imageUrl || `https://picsum.photos/seed/${item.id}/100/100`
          });
          laneOccupancy[assignedLane] = x;
        }
      });

      return resolved;
    };

    const getY = (d: any) => {
      const topPadding = 50;
      const bottomPadding = 80; // Extra room for axis
      const availableHeight = dimensions.height - UI_CONFIG.AXIS_HEIGHT - topPadding - bottomPadding;
      const laneHeight = availableHeight / UI_CONFIG.VERTICAL_LANES;
      return topPadding + (d.lane * laneHeight);
    };

    const updateView = (transform: d3.ZoomTransform) => {
      const k = transform.k;
      lastTransform.current = transform;
      if (onZoomScaleChange && !isInternalUpdate.current) onZoomScaleChange(k);
      
      const newXScale = transform.rescaleX(baseScale);
      
      const axis = d3.axisBottom(newXScale)
        .ticks(Math.max(2, dimensions.width / 200))
        .tickFormat(d => formatYear(d as number, lang));
        
      axisGroup.select<SVGGElement>('.axis-content').remove();
      const axisContent = axisGroup.append('g').attr('class', 'axis-content').call(axis as any);
      axisContent.select('.domain').remove();
      axisContent.selectAll('.tick line').attr('y2', -dimensions.height).attr('stroke-dasharray', '2,4').attr('opacity', 0.05);

      const data = resolveMapModel(k, newXScale);

      const nodes = mainLayer.selectAll<SVGGElement, any>('.node-group')
        .data(data, d => d.id);

      nodes.exit().transition().duration(150).attr('opacity', 0).remove();

      const enter = nodes.enter().append('g')
        .attr('class', 'node-group cursor-pointer')
        .attr('opacity', 0)
        .on('click', (e, d) => onSelectItem(d.item));

      // Circular Image Marker
      const marker = enter.append('g').attr('class', 'marker-container');
      
      marker.append('circle')
        .attr('r', UI_CONFIG.MARKER_SIZE / 2 + 3)
        .attr('fill', '#fff')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2.5)
        .attr('class', 'marker-halo');

      marker.append('image')
        .attr('xlink:href', d => d.imageUrl)
        .attr('x', -UI_CONFIG.MARKER_SIZE / 2)
        .attr('y', -UI_CONFIG.MARKER_SIZE / 2)
        .attr('width', UI_CONFIG.MARKER_SIZE)
        .attr('height', UI_CONFIG.MARKER_SIZE)
        .attr('clip-path', 'url(#marker-clip)');

      // Map Label
      enter.append('text')
        .attr('class', 'label-text')
        .attr('dx', isRTL ? -22 : 22)
        .attr('dy', 5)
        .attr('text-anchor', isRTL ? 'end' : 'start')
        .text(d => d.title.toUpperCase());

      const merged = nodes.merge(enter as any);
      
      merged.attr('transform', d => `translate(${newXScale(d.startYear)}, ${getY(d)})`)
        .transition().duration(250).attr('opacity', 1);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, UI_CONFIG.MAX_SCALE])
      .on('zoom', (event) => updateView(event.transform));

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, lastTransform.current);
    updateView(lastTransform.current);

  }, [dimensions, lang, items, categories, selectedCategories]);

  return (
    <div className="w-full h-full relative bg-[#fcfcfd] overflow-hidden select-none">
      <svg ref={svgRef} className="w-full h-full timeline-svg relative z-10" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.012] z-0">
         <span className="text-[25vw] font-black uppercase tracking-tighter">
           {isRTL ? 'תולדות' : 'CHRONOS'}
         </span>
      </div>
    </div>
  );
});

export default D3Timeline;
