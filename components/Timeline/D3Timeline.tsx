
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
    
    // Initial centering logic - only runs once
    if (!hasInitialized.current) {
      const xAnchor = baseScale(UI_CONFIG.CENTER_YEAR);
      lastTransform.current = (d3 as any).zoomIdentity.translate(dimensions.width/2 - xAnchor, 0);
      hasInitialized.current = true;
    }

    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    defs.append('clipPath')
      .attr('id', 'clip-circle-large')
      .append('circle').attr('r', 14);
    defs.append('clipPath')
      .attr('id', 'clip-circle-small')
      .append('circle').attr('r', 10);
    defs.append('clipPath')
      .attr('id', 'clip-circle-micro')
      .append('circle').attr('r', 8);

    const mainLayer = svg.append('g').attr('class', 'main-layer');
    const axisLayer = svg.append('g').attr('class', 'axis-layer').attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);

    const update = (transform: any) => {
      const k = transform.k;
      lastTransform.current = transform;
      if (onZoomScaleChange) onZoomScaleChange(k);

      const xScale = transform.rescaleX(baseScale);

      // Adaptive UI Constants based on screen size
      const labelWidth = isMobile ? 120 : UI_CONFIG.LABEL_WIDTH_PX;
      const collisionPadding = isMobile ? 8 : UI_CONFIG.COLLISION_PADDING;
      const laneHeight = isMobile ? 38 : 46;
      const maxLanes = dimensions.height < 400 ? 4 : 8;

      // 1. Semantic Filter
      const visible = items.filter(d => 
        k >= d.zoomLevelMin && 
        k <= d.zoomLevelMax && 
        selectedCategories.includes(d.category)
      ).sort((a, b) => b.importance - a.importance);

      // 2. Adaptive Collision Detection
      const occupied: { x1: number, x2: number, y1: number, y2: number }[] = [];
      const nodes = [];

      const startY = (dimensions.height - UI_CONFIG.AXIS_HEIGHT) / 2;

      for (const item of visible) {
        const x = xScale(item.startYear);
        if (x < -200 || x > dimensions.width + 200) continue;

        let foundLane = -1;
        for (let lane = 0; lane < maxLanes; lane++) {
          const y = startY + (lane % 2 === 0 ? 1 : -1) * Math.ceil(lane/2) * laneHeight;
          const rect = {
            x1: x - (isRTL ? labelWidth : 20),
            x2: x + (!isRTL ? labelWidth : 20),
            y1: y - UI_CONFIG.LABEL_HEIGHT_PX,
            y2: y + UI_CONFIG.LABEL_HEIGHT_PX
          };

          const collision = occupied.some(r => 
            rect.x1 < r.x2 && rect.x2 > r.x1 && 
            rect.y1 < r.y2 && rect.y2 > r.y1
          );

          if (!collision) {
            foundLane = lane;
            occupied.push({
              x1: rect.x1 - collisionPadding,
              x2: rect.x2 + collisionPadding,
              y1: rect.y1 - collisionPadding,
              y2: rect.y2 + collisionPadding
            });
            nodes.push({ item, x, y });
            break;
          }
        }
      }

      // 3. Render
      const itemGroup = mainLayer.selectAll('.item').data(nodes, (d: any) => d.item.id);
      
      itemGroup.exit().remove();

      const enter = itemGroup.enter().append('g')
        .attr('class', 'item cursor-pointer')
        .on('click', (e: any, d: any) => onSelectItem(d.item));

      enter.append('circle').attr('class', 'halo');
      enter.append('image')
        .attr('class', 'item-image')
        .attr('preserveAspectRatio', 'xMidYMid slice');

      enter.append('text').attr('class', 'map-label')
        .attr('dy', 5)
        .attr('text-anchor', isRTL ? 'end' : 'start')
        .style('font-weight', '700');

      const merged = enter.merge(itemGroup as any);
      merged.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
        .classed('is-selected', (d: any) => d.item.id === selectedItemId);
      
      const labelOffset = isMobile ? 14 : 18;
      merged.select('text')
        .attr('dx', isRTL ? -labelOffset : labelOffset)
        .style('font-size', isMobile ? '10px' : '12px')
        .text((d: any) => d.item.title[lang]);

      merged.select('.halo')
        .attr('r', (d: any) => d.item.type === ItemType.ERA ? (isMobile ? 12 : 16) : d.item.importance > 50 ? (isMobile ? 9 : 12) : (isMobile ? 8 : 10))
        .attr('fill', (d: any) => categories.find(c => c.id === d.item.category)?.color || '#333');

      merged.select('.item-image')
        .attr('xlink:href', (d: any) => d.item.imageUrl || `https://picsum.photos/seed/${d.item.id}/60/60`)
        .attr('x', (d: any) => {
          const size = d.item.type === ItemType.ERA ? (isMobile ? 22 : 28) : d.item.importance > 50 ? (isMobile ? 16 : 20) : (isMobile ? 14 : 16);
          return -size / 2;
        })
        .attr('y', (d: any) => {
          const size = d.item.type === ItemType.ERA ? (isMobile ? 22 : 28) : d.item.importance > 50 ? (isMobile ? 16 : 20) : (isMobile ? 14 : 16);
          return -size / 2;
        })
        .attr('width', (d: any) => d.item.type === ItemType.ERA ? (isMobile ? 22 : 28) : d.item.importance > 50 ? (isMobile ? 16 : 20) : (isMobile ? 14 : 16))
        .attr('height', (d: any) => d.item.type === ItemType.ERA ? (isMobile ? 22 : 28) : d.item.importance > 50 ? (isMobile ? 16 : 20) : (isMobile ? 14 : 16))
        .attr('clip-path', (d: any) => d.item.type === ItemType.ERA ? 'url(#clip-circle-large)' : d.item.importance > 50 ? 'url(#clip-circle-small)' : 'url(#clip-circle-micro)');

      // Axis Update
      axisLayer.selectAll('.grid-line').remove();
      axisLayer.select('.axis-base').remove();
      
      const axis = (d3 as any).axisBottom(xScale)
        .ticks(dimensions.width / (isMobile ? 80 : 120))
        .tickFormat((d: any) => formatYear(d as number, lang));

      axisLayer.append('g').attr('class', 'axis-base').call(axis);
      axisLayer.selectAll('.tick line')
        .attr('y2', -dimensions.height)
        .attr('stroke', '#e7e5e4')
        .attr('stroke-dasharray', '4,4');
    };

    const zoom = (d3 as any).zoom()
      .scaleExtent([1, UI_CONFIG.MAX_SCALE])
      .translateExtent([[-dimensions.width * 20, 0], [dimensions.width * 20, 0]])
      .on('zoom', (e: any) => update(e.transform));

    zoomRef.current = zoom;
    svg.call(zoom);

    // Apply the last known transform (preserves position on item select/deselect)
    svg.call(zoom.transform, lastTransform.current);

  }, [dimensions, items, lang, selectedCategories, categories, selectedItemId]);

  return (
    <div className="w-full h-full relative bg-[#fafaf9] overflow-hidden select-none">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
       <svg ref={svgRef} className="w-full h-full relative z-10" />
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
          <h1 className="text-[20vw] font-black uppercase tracking-tighter">{isRTL ? 'מפה' : 'MAP'}</h1>
       </div>
    </div>
  );
});

export default D3Timeline;
