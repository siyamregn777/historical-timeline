
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
        d3.select(svgRef.current).transition().duration(800).call(zoomRef.current.transform, d3.zoomIdentity);
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
      .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

    const mainLayer = svg.append('g').attr('class', 'main-layer');
    const axisGroup = svg.append('g').attr('class', 'axis-layer').attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);
    
    axisGroup.append('rect').attr('width', dimensions.width).attr('height', UI_CONFIG.AXIS_HEIGHT).attr('fill', '#ece9e2').attr('fill-opacity', 0.95);

    const topLaneY = dimensions.height * 0.25;
    const bottomLaneY = dimensions.height * 0.65;

    const getVisibleNodes = (transform: d3.ZoomTransform): SimulationNode[] => {
      const k = transform.k;
      const currentRange = transform.rescaleX(xScale).domain();
      const padding = (currentRange[1] - currentRange[0]) * 0.2;

      return items
        .filter(item => selectedCategories.includes(item.category))
        .filter(item => item.id !== selectedItemId)
        .filter(item => item.startYear >= currentRange[0] - padding && item.startYear <= currentRange[1] + padding)
        .filter(item => {
          if (item.importance === 1) return true;
          if (item.importance === 2) return k > 3;
          if (item.importance === 3) return k > 10;
          if (item.importance === 4) return k > 25;
          return k > 40;
        })
        .map((item, idx) => {
          const textLength = item.title[lang].length;
          const totalWidth = 35 + (textLength * 6);
          const isUpper = idx % 2 === 0;
          const fixedY = isUpper ? topLaneY : bottomLaneY;

          return {
            id: item.id, item, importance: item.importance,
            width: totalWidth, height: 25,
            x: xScale(item.startYear), y: fixedY,
            targetX: xScale(item.startYear), targetY: fixedY,
            opacity: 0
          } as SimulationNode;
        });
    };

    const updateView = (transform: d3.ZoomTransform) => {
      const k = transform.k;
      lastTransform.current = transform; 
      if (onZoomScaleChange && !isInternalUpdate.current) onZoomScaleChange(k);
      
      const newXScale = transform.rescaleX(xScale);
      mainLayer.attr('transform', `translate(${transform.x}, 0) scale(${transform.k}, 1)`);
      
      const axis = d3.axisBottom(newXScale).ticks(Math.max(6, dimensions.width / 150)).tickFormat(d => formatYear(d as number, lang));
      axisGroup.select<SVGGElement>('.axis-content').remove();
      const axisContent = axisGroup.append('g').attr('class', 'axis-content').call(axis as any);
      axisContent.select('.domain').attr('stroke', '#78716c').attr('stroke-width', 2);
      axisContent.selectAll('.tick text').attr('class', 'font-black text-[9px] fill-stone-500').attr('dy', '22px');

      const visibleNodes = getVisibleNodes(transform);

      const simulation = d3.forceSimulation<SimulationNode>(visibleNodes)
        .force('x', d3.forceX<SimulationNode>(d => xScale(d.item.startYear)).strength(10))
        .force('y', d3.forceY<SimulationNode>(d => d.targetY).strength(10))
        .force('collide', d3.forceCollide<SimulationNode>().radius(d => (d.width / k) / 2).iterations(1))
        .stop();

      for (let i = 0; i < 15; ++i) simulation.tick();

      const nodesSelection = mainLayer.selectAll<SVGGElement, SimulationNode>('.item-node').data(visibleNodes, d => d.id);
      nodesSelection.exit().remove();

      const enter = nodesSelection.enter().append('g').attr('class', 'item-node cursor-pointer').on('click', (e, d) => onSelectItem(d.item));
      enter.append('line').attr('class', 'stem-line').attr('stroke', '#a8a29e').attr('stroke-width', (d: any) => 1 / k).attr('stroke-dasharray', '2,4');
      const content = enter.append('g').attr('class', 'content-group');
      content.append('circle').attr('class', 'node-circle-outer').attr('stroke-width', (d: any) => 1 / k);
      content.append('image').attr('class', 'node-image').attr('preserveAspectRatio', 'xMidYMid slice');
      content.append('text').attr('class', 'node-label font-bold fill-stone-900').style('paint-order', 'stroke').style('stroke', '#ece9e2');

      const merged = nodesSelection.merge(enter as any);
      merged.attr('transform', d => `translate(${d.x}, ${d.y})`);
      merged.select('.content-group').attr('transform', `scale(${1/k}, 1)`);
      merged.select('.stem-line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', d => (dimensions.height - UI_CONFIG.AXIS_HEIGHT) - d.y);
      merged.select('.node-circle-outer').attr('fill', d => categories.find(c => c.id === d.item.category)?.color || '#000').attr('stroke', '#fff').attr('r', d => (d.importance === 1 ? 16 : 10));
      merged.select('.node-image').attr('xlink:href', d => d.item.imageUrl || `https://picsum.photos/seed/${d.id}/40/40`).attr('x', d => (d.importance === 1 ? -14 : -8)).attr('y', d => (d.importance === 1 ? -14 : -8)).attr('width', d => (d.importance === 1 ? 28 : 16)).attr('height', d => (d.importance === 1 ? 28 : 16)).attr('clip-path', d => d.importance === 1 ? 'url(#circle-clip-pillar)' : 'url(#circle-clip)');
      merged.select('.node-label').attr('dx', isRTL ? -20 : 20).attr('dy', 4).attr('text-anchor', isRTL ? 'end' : 'start').style('font-size', d => `${(d.importance === 1 ? 10 : 8)}px`).style('stroke-width', '3px').text(d => d.item.title[lang]);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 100]).translateExtent([[0, -100], [dimensions.width, 100]]).on('zoom', (event) => updateView(event.transform));
    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, lastTransform.current);
    updateView(lastTransform.current);

  }, [dimensions, lang, items, selectedCategories, categories, selectedItemId, onZoomScaleChange]);

  return (
    <div className="w-full h-full relative bg-[#ece9e2] overflow-hidden select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div className="text-stone-800 font-black uppercase tracking-tighter text-center opacity-[0.06]" style={{ fontSize: 'min(10vw, 110px)' }}>{isRTL ? 'תולדות ישראל' : 'Jewish History'}</div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <svg ref={svgRef} className="w-full h-full timeline-svg relative z-10" />
    </div>
  );
});

export default D3Timeline;
