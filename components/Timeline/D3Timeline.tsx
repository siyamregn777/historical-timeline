
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
  onSelectItem: (item: TimelineItem | null) => void;
  onZoomScaleChange?: (scale: number) => void;
  selectedItemId?: string;
}

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, categories, lang, selectedCategories, onSelectItem, onZoomScaleChange, selectedItemId }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const zoomRef = useRef<any>(null);
  const lastTransform = useRef<any>((d3 as any).zoomIdentity);
  const hasInitialized = useRef(false);
  
  const isRTL = lang === 'he';
  const isMobile = dimensions.width < 768;
  const showDurations = selectedCategories.includes('durations');

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current?.parentElement) {
        const { clientWidth, clientHeight } = svgRef.current.parentElement;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };
    const observer = new ResizeObserver(updateSize);
    if (svgRef.current?.parentElement) observer.observe(svgRef.current.parentElement);
    updateSize();
    return () => observer.disconnect();
  }, []);

  const baseScale = (d3 as any).scaleLinear()
    .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
    .range([0, dimensions.width]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => (d3 as any).select(svgRef.current).transition().duration(400).call(zoomRef.current!.scaleBy, 2),
    zoomOut: () => (d3 as any).select(svgRef.current).transition().duration(400).call(zoomRef.current!.scaleBy, 0.5),
    setZoomScale: (s: number) => (d3 as any).select(svgRef.current).call(zoomRef.current!.scaleTo, s),
    reset: () => (d3 as any).select(svgRef.current).transition().duration(700).call(zoomRef.current!.transform, (d3 as any).zoomIdentity.translate(dimensions.width/2 - baseScale(UI_CONFIG.CENTER_YEAR), 0)),
    jumpToYear: (y: number) => {
        const k = lastTransform.current.k;
        const tx = dimensions.width/2 - baseScale(y) * k;
        (d3 as any).select(svgRef.current).transition().duration(700).call(zoomRef.current!.transform, (d3 as any).zoomIdentity.translate(tx, 0).scale(k));
    }
  }), [dimensions, baseScale]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = (d3 as any).select(svgRef.current);
    
    if (!hasInitialized.current) {
      const xAnchor = baseScale(UI_CONFIG.CENTER_YEAR);
      lastTransform.current = (d3 as any).zoomIdentity.translate(dimensions.width/2 - xAnchor, 0);
      hasInitialized.current = true;
    }

    svg.selectAll('*').remove();
    
    // Setup Global Defs for clipping and shadows
    const defs = svg.append('defs');
    defs.append('clipPath')
      .attr('id', 'circle-clip')
      .append('circle')
      .attr('r', 14); // Size for the image markers

    const durationLayer = svg.append('g').attr('class', 'duration-layer');
    const markerLayer = svg.append('g').attr('class', 'marker-layer');
    const axisLayer = svg.append('g').attr('class', 'axis-layer').attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);

    const update = (transform: any) => {
      const k = transform.k;
      lastTransform.current = transform;
      if (onZoomScaleChange) onZoomScaleChange(k);

      const xScale = transform.rescaleX(baseScale);

      const filtered = items.filter(d => {
        const isPerson = d.type === ItemType.PERSON;
        const typeMatch = selectedCategories.includes(isPerson ? 'person' : 'event');
        const zoomMatch = k >= (d.zoomLevelMin || 0) && k < (d.zoomLevelMax || 1001);
        return typeMatch && zoomMatch;
      }).sort((a, b) => b.importance - a.importance);

      const midY = (dimensions.height - UI_CONFIG.AXIS_HEIGHT) / 2;
      
      const eventLanes: { endPixel: number, lane: number }[] = [];
      const peopleLanes: { endPixel: number, lane: number }[] = [];
      
      const combinedNodes: any[] = [];

      filtered.forEach(item => {
        const isPerson = item.type === ItemType.PERSON;
        const xStart = xScale(item.startYear);
        const xEnd = item.endYear ? xScale(item.endYear) : xStart;
        
        if (xStart > dimensions.width + 500 || (item.endYear ? xEnd < -500 : xStart < -500)) return;

        const labelWidth = isMobile ? 120 : UI_CONFIG.LABEL_WIDTH_PX + 40;
        const footprintEnd = Math.max(xEnd, xStart + labelWidth);

        let assignedLane = 0;
        const targetLanes = isPerson ? peopleLanes : eventLanes;
        
        for (let l = 0; l < 40; l++) {
          const collision = targetLanes.some(tl => tl.lane === l && xStart < tl.endPixel + 20);
          if (!collision) {
            assignedLane = l;
            break;
          }
        }
        targetLanes.push({ endPixel: footprintEnd, lane: assignedLane });

        const trackPadding = 30;
        const laneHeight = isMobile ? 32 : 42; 
        const trackStartY = isPerson ? midY + trackPadding : midY - trackPadding;
        const yPos = isPerson 
          ? trackStartY + (assignedLane * laneHeight)
          : trackStartY - (assignedLane * laneHeight);

        if (yPos < 20 || yPos > dimensions.height - UI_CONFIG.AXIS_HEIGHT - 20) return;

        combinedNodes.push({
          item,
          x: xStart,
          xEnd: xEnd,
          y: yPos,
          hasDuration: !!item.endYear && showDurations && (xEnd - xStart > 2),
          color: isPerson ? '#f43f5e' : '#10b981',
          imageUrl: item.imageUrl || `https://picsum.photos/seed/${item.id}/100/100`
        });
      });

      // RENDER DURATION LINES (Make interactive)
      const lineYOffset = -18; 
      const lines = durationLayer.selectAll('.timeline-bar').data(combinedNodes.filter(n => n.hasDuration), (d: any) => d.item.id);
      lines.exit().remove();
      lines.enter().append('rect')
        .attr('class', 'timeline-bar transition-all duration-300')
        .on('click', (e: any, d: any) => onSelectItem(d.item)) // Now duration lines are clickable
        .merge(lines as any)
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y + lineYOffset - (UI_CONFIG.BAR_HEIGHT / 2)) 
        .attr('width', (d: any) => d.xEnd - d.x)
        .attr('height', UI_CONFIG.BAR_HEIGHT)
        .attr('fill', (d: any) => d.color);

      // RENDER MARKERS AS IMAGES
      const markers = markerLayer.selectAll('.item').data(combinedNodes, (d: any) => d.item.id);
      markers.exit().remove();
      
      const enter = markers.enter().append('g')
        .attr('class', 'item cursor-pointer transition-opacity duration-300')
        .on('click', (e: any, d: any) => onSelectItem(d.item));

      // Image Container Group
      const imgGroup = enter.append('g').attr('class', 'marker-avatar');
      
      // Outer Ring
      imgGroup.append('circle')
        .attr('class', 'halo')
        .attr('r', 16)
        .attr('fill', 'white')
        .attr('stroke-width', 2);

      // Image with clip path
      imgGroup.append('image')
        .attr('xlink:href', (d: any) => d.imageUrl)
        .attr('width', 28)
        .attr('height', 28)
        .attr('x', -14)
        .attr('y', -14)
        .attr('clip-path', 'url(#circle-clip)');

      enter.append('text').attr('class', 'map-label').attr('dy', 5);

      const merged = enter.merge(markers as any);
      merged.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
        .classed('is-selected', (d: any) => d.item.id === selectedItemId);
      
      merged.select('text')
        .attr('text-anchor', isRTL ? 'end' : 'start')
        .attr('dx', isRTL ? -22 : 22)
        .style('font-size', isMobile ? '10px' : '11.5px')
        .text((d: any) => d.item.title[lang]);

      merged.select('.halo').attr('stroke', (d: any) => d.color);

      // RENDER AXIS
      axisLayer.selectAll('.axis-base').remove();
      const axis = (d3 as any).axisBottom(xScale)
        .ticks(dimensions.width / (isMobile ? 80 : 160))
        .tickFormat((d: any) => formatYear(d as number, lang));
      axisLayer.append('g').attr('class', 'axis-base').call(axis);
    };

    const zoom = (d3 as any).zoom()
      .scaleExtent([1, UI_CONFIG.MAX_SCALE])
      .on('zoom', (e: any) => update(e.transform));

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, lastTransform.current);

  }, [dimensions, items, lang, selectedCategories, selectedItemId, showDurations]);

  return (
    <div className="w-full h-full relative bg-[#fafaf9] overflow-hidden select-none">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
       <svg ref={svgRef} className="w-full h-full relative z-10" />
    </div>
  );
});

export default D3Timeline;
