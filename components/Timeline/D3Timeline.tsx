
import React, { useRef, useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { TimelineItem, Language, TimelineRef } from '../../types';
import { UI_CONFIG, CATEGORIES } from '../../constants';
import { calculateLayout, formatYear } from '../../utils/layoutEngine';

interface Props {
  items: TimelineItem[];
  lang: Language;
  selectedCategories: string[];
  onSelectItem: (item: TimelineItem | null) => void;
}

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, lang, selectedCategories, onSelectItem }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: UI_CONFIG.TIMELINE_HEIGHT });

  const filteredItems = useMemo(() => {
    const filtered = items.filter(item => selectedCategories.includes(item.category));
    return calculateLayout(filtered);
  }, [items, selectedCategories]);

  const maxTrack = useMemo(() => filteredItems.reduce((max, item) => Math.max(max, item.track), 0), [filteredItems]);

  useEffect(() => {
    const neededHeight = Math.max(UI_CONFIG.TIMELINE_HEIGHT, (maxTrack + 2) * UI_CONFIG.TRACK_HEIGHT + UI_CONFIG.AXIS_HEIGHT);
    setDimensions(prev => ({ ...prev, height: neededHeight }));
  }, [maxTrack]);

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) setDimensions(prev => ({ ...prev, width: svgRef.current?.parentElement?.clientWidth || 0 }));
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Expose zoom methods
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
      }
    },
    reset: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity.scale(1.5));
      }
    }
  }));

  useEffect(() => {
    if (!svgRef.current || !gRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    const mainGroup = d3.select(gRef.current);
    mainGroup.selectAll('*').remove();
    svg.select('.axis-group').remove();

    const isRTL = lang === 'he';
    const xScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

    const axisGroup = svg.append('g').attr('class', 'axis-group')
      .attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);

    function updateAxis(currentXScale: d3.ScaleLinear<number, number>) {
      const axis = d3.axisBottom(currentXScale)
        .ticks(Math.max(2, Math.floor(dimensions.width / 120)))
        .tickFormat(d => formatYear(d as number, lang));
      axisGroup.call(axis as any);
      axisGroup.select('.domain').attr('stroke', '#cbd5e1');
      axisGroup.selectAll('.tick text').attr('fill', '#94a3b8');
    }

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 150])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform.toString());
        updateAxis(event.transform.rescaleX(xScale));
      });

    (zoomRef as any).current = zoom;
    svg.call(zoom);

    // Modern Era focus
    const initialScale = 1.8;
    const initialTranslate = isRTL ? dimensions.width * 0.9 : -xScale(1800) * initialScale + dimensions.width * 0.1;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslate, 0).scale(initialScale));

    const draw = () => {
      // Periods
      const periods = filteredItems.filter(i => i.type === 'period');
      mainGroup.selectAll('.period').data(periods).enter().append('rect')
        .attr('x', d => Math.min(xScale(d.startYear), xScale(d.endYear || d.startYear)))
        .attr('y', d => d.track * UI_CONFIG.TRACK_HEIGHT + 5)
        .attr('width', d => Math.max(5, Math.abs(xScale(d.endYear || d.startYear) - xScale(d.startYear))))
        .attr('height', UI_CONFIG.TRACK_HEIGHT - 10)
        .attr('rx', 6).attr('fill', d => CATEGORIES.find(c => c.id === d.category)?.color || '#ccc')
        .attr('opacity', 0.08).attr('stroke', d => CATEGORIES.find(c => c.id === d.category)?.color || '#ccc').attr('stroke-width', 1);

      // Bars/Dots
      filteredItems.filter(i => i.type !== 'period').forEach(d => {
        const itemG = mainGroup.append('g').attr('class', 'cursor-pointer').on('click', () => onSelectItem(d));
        const color = CATEGORIES.find(c => c.id === d.category)?.color || '#ccc';
        
        if (d.type === 'person') {
          itemG.append('rect')
            .attr('x', Math.min(xScale(d.startYear), xScale(d.endYear || d.startYear)))
            .attr('y', d.track * UI_CONFIG.TRACK_HEIGHT + 24)
            .attr('width', Math.max(4, Math.abs(xScale(d.endYear || d.startYear) - xScale(d.startYear))))
            .attr('height', 6).attr('rx', 3).attr('fill', color);
        } else {
          itemG.append('circle').attr('cx', xScale(d.startYear)).attr('cy', d.track * UI_CONFIG.TRACK_HEIGHT + 27).attr('r', 4).attr('fill', color);
        }

        itemG.append('text')
          .attr('x', xScale(d.startYear)).attr('y', d.track * UI_CONFIG.TRACK_HEIGHT + 18)
          .attr('text-anchor', isRTL ? 'end' : 'start').attr('dx', isRTL ? -5 : 5)
          .style('font-size', '12px').style('font-weight', '600').style('fill', '#334155')
          .text(d.title[lang]);
      });
    };

    draw();
  }, [dimensions, filteredItems, lang]);

  return (
    <div className="w-full h-full relative bg-white rounded-2xl shadow-inner border border-slate-100 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full timeline-svg">
        <rect width="100%" height="100%" fill="transparent" />
        <g ref={gRef} />
      </svg>
    </div>
  );
});

export default D3Timeline;
