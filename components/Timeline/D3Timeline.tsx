
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TimelineItem, Language, RenderableItem, Category } from '../../types';
import { UI_CONFIG, CATEGORIES } from '../../constants';
import { calculateLayout, formatYear } from '../../utils/layoutEngine';

interface Props {
  items: TimelineItem[];
  lang: Language;
  selectedCategories: string[];
  onSelectItem: (item: TimelineItem | null) => void;
}

const D3Timeline: React.FC<Props> = ({ items, lang, selectedCategories, onSelectItem }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: UI_CONFIG.TIMELINE_HEIGHT });

  // Filter items based on selected categories
  const filteredItems = useMemo(() => {
    const filtered = items.filter(item => selectedCategories.includes(item.category));
    return calculateLayout(filtered);
  }, [items, selectedCategories]);

  // Handle Resize
  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        setDimensions(prev => ({ ...prev, width: svgRef.current?.parentElement?.clientWidth || 0 }));
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Main D3 Effect
  useEffect(() => {
    if (!svgRef.current || !gRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    const mainGroup = d3.select(gRef.current);
    
    // Clear previous
    mainGroup.selectAll('*').remove();
    svg.select('.axis-group').remove();

    const isRTL = lang === 'he';

    // Scales
    const xScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 50])
      .translateExtent([[-10000, 0], [10000, dimensions.height]])
      .on('zoom', (event) => {
        const transform = event.transform;
        mainGroup.attr('transform', transform.toString());
        updateAxis(transform.rescaleX(xScale));
      });

    svg.call(zoom);

    // Initial transform - center a bit
    const initialTransform = d3.zoomIdentity.translate(dimensions.width / 4, 0).scale(1.5);
    svg.call(zoom.transform, initialTransform);

    // Axis Rendering
    const axisGroup = svg.append('g')
      .attr('class', 'axis-group')
      .attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);

    const updateAxis = (currentXScale: d3.ScaleLinear<number, number>) => {
      const axis = d3.axisBottom(currentXScale)
        .ticks(10)
        .tickFormat(d => formatYear(d as number, lang));
      
      axisGroup.call(axis as any);
      
      // Style axis
      axisGroup.select('.domain').attr('stroke', '#94a3b8');
      axisGroup.selectAll('.tick line').attr('stroke', '#cbd5e1');
      axisGroup.selectAll('.tick text').attr('fill', '#64748b').style('font-size', '12px');
    };

    updateAxis(initialTransform.rescaleX(xScale));

    // Content Rendering
    const drawTimeline = () => {
      // 1. Periods (Background spans)
      const periods = filteredItems.filter(i => i.type === 'period');
      mainGroup.selectAll('.period-rect')
        .data(periods)
        .enter()
        .append('rect')
        .attr('class', 'period-rect transition-opacity duration-300')
        .attr('x', d => Math.min(xScale(d.startYear), xScale(d.endYear || d.startYear)))
        .attr('y', d => d.track * UI_CONFIG.TRACK_HEIGHT + UI_CONFIG.TRACK_PADDING)
        .attr('width', d => Math.abs(xScale(d.endYear || d.startYear) - xScale(d.startYear)))
        .attr('height', UI_CONFIG.TRACK_HEIGHT - UI_CONFIG.TRACK_PADDING * 2)
        .attr('rx', 4)
        .attr('fill', d => CATEGORIES.find(c => c.id === d.category)?.color || '#ccc')
        .attr('opacity', 0.15)
        .attr('stroke', d => CATEGORIES.find(c => c.id === d.category)?.color || '#ccc')
        .attr('stroke-width', 2);

      // 2. People (Bars)
      const people = filteredItems.filter(i => i.type === 'person');
      mainGroup.selectAll('.person-group')
        .data(people)
        .enter()
        .append('g')
        .attr('class', 'person-group cursor-pointer')
        .on('click', (event, d) => onSelectItem(d))
        .call(g => {
          g.append('rect')
            .attr('x', d => Math.min(xScale(d.startYear), xScale(d.endYear || d.startYear)))
            .attr('y', d => d.track * UI_CONFIG.TRACK_HEIGHT + UI_CONFIG.TRACK_PADDING + 5)
            .attr('width', d => Math.abs(xScale(d.endYear || d.startYear) - xScale(d.startYear)))
            .attr('height', 10)
            .attr('rx', 5)
            .attr('fill', d => CATEGORIES.find(c => c.id === d.category)?.color || '#ccc');
          
          g.append('text')
            .attr('x', d => xScale(d.startYear))
            .attr('y', d => d.track * UI_CONFIG.TRACK_HEIGHT + UI_CONFIG.TRACK_PADDING)
            .attr('text-anchor', isRTL ? 'end' : 'start')
            .attr('dx', isRTL ? -5 : 5)
            .style('font-size', '11px')
            .style('font-weight', '600')
            .style('fill', '#334155')
            .text(d => d.title[lang]);
        });

      // 3. Events (Points)
      const events = filteredItems.filter(i => i.type === 'event');
      mainGroup.selectAll('.event-group')
        .data(events)
        .enter()
        .append('g')
        .attr('class', 'event-group cursor-pointer')
        .on('click', (event, d) => onSelectItem(d))
        .call(g => {
          g.append('circle')
            .attr('cx', d => xScale(d.startYear))
            .attr('cy', d => d.track * UI_CONFIG.TRACK_HEIGHT + UI_CONFIG.TRACK_HEIGHT / 2)
            .attr('r', 5)
            .attr('fill', d => CATEGORIES.find(c => c.id === d.category)?.color || '#ccc')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

          g.append('text')
            .attr('x', d => xScale(d.startYear))
            .attr('y', d => d.track * UI_CONFIG.TRACK_HEIGHT + UI_CONFIG.TRACK_PADDING + 5)
            .attr('text-anchor', isRTL ? 'end' : 'start')
            .attr('dx', isRTL ? -10 : 10)
            .style('font-size', '11px')
            .style('fill', '#475569')
            .text(d => d.title[lang]);
        });
    };

    drawTimeline();

  }, [dimensions, filteredItems, lang, onSelectItem]);

  return (
    <div className="w-full h-full relative bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
      <svg 
        ref={svgRef} 
        className="w-full h-full timeline-svg"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <g ref={gRef} />
      </svg>
    </div>
  );
};

export default D3Timeline;
