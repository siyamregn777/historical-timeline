
import React, { useRef, useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { TimelineItem, Language, TimelineRef, Category } from '../../types';
import { UI_CONFIG } from '../../constants';
import { calculateLayout, formatYear } from '../../utils/layoutEngine';

interface Props {
  items: TimelineItem[];
  categories: Category[];
  lang: Language;
  selectedCategories: string[];
  onSelectItem: (item: TimelineItem | null) => void;
}

const D3Timeline = forwardRef<TimelineRef, Props>(({ items, categories, lang, selectedCategories, onSelectItem }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const filteredItems = useMemo(() => {
    const filtered = items.filter(item => selectedCategories.includes(item.category));
    return calculateLayout(filtered);
  }, [items, selectedCategories]);

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth,
            height: parent.clientHeight
          });
        }
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    const timer = setTimeout(updateSize, 100);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, []);

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
      if (svgRef.current && zoomRef.current && dimensions.width > 0) {
        const isRTL = lang === 'he';
        const xScale = d3.scaleLinear()
          .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
          .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);
          
        const initialScale = 1.5;
        const targetYear = 0; 
        const initialTranslate = isRTL 
          ? dimensions.width / 2 + xScale(targetYear) * initialScale 
          : dimensions.width / 2 - xScale(targetYear) * initialScale;

        d3.select(svgRef.current).transition().duration(500).call(
          zoomRef.current.transform, 
          d3.zoomIdentity.translate(initialTranslate, 0).scale(initialScale)
        );
      }
    }
  }));

  useEffect(() => {
    if (!svgRef.current || !gRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const mainGroup = d3.select(gRef.current);
    
    mainGroup.selectAll('*').remove();
    svg.select('.axis-group').remove();
    svg.select('.axis-bg').remove();

    const isRTL = lang === 'he';
    const xScale = d3.scaleLinear()
      .domain([UI_CONFIG.MIN_YEAR, UI_CONFIG.MAX_YEAR])
      .range(isRTL ? [dimensions.width, 0] : [0, dimensions.width]);

    svg.append('rect')
      .attr('class', 'axis-bg')
      .attr('x', 0)
      .attr('y', dimensions.height - UI_CONFIG.AXIS_HEIGHT)
      .attr('width', dimensions.width)
      .attr('height', UI_CONFIG.AXIS_HEIGHT)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.9);

    const axisGroup = svg.append('g').attr('class', 'axis-group')
      .attr('transform', `translate(0, ${dimensions.height - UI_CONFIG.AXIS_HEIGHT})`);

    function updateAxis(currentXScale: d3.ScaleLinear<number, number>) {
      const axis = d3.axisBottom(currentXScale)
        .ticks(Math.max(2, Math.floor(dimensions.width / 100)))
        .tickFormat(d => formatYear(d as number, lang));
      axisGroup.call(axis as any);
      axisGroup.select('.domain').attr('stroke', '#e2e8f0').attr('stroke-width', 2);
      axisGroup.selectAll('.tick text')
        .attr('fill', '#64748b')
        .style('font-size', '11px')
        .style('font-weight', '700');
    }

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 100])
      .translateExtent([[-Infinity, -500], [Infinity, 2000]])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform.toString());
        updateAxis(event.transform.rescaleX(xScale));
        
        const baseFontSize = 14;
        const dynamicFontSize = Math.min(32, Math.max(8, (baseFontSize / event.transform.k) * 1.5));
        mainGroup.selectAll('.timeline-item-text')
          .style('font-size', `${dynamicFontSize}px`);
      });

    (zoomRef as any).current = zoom;
    svg.call(zoom);

    const initialScale = 1.8;
    const initialTranslate = isRTL 
      ? dimensions.width * 0.9 
      : -xScale(1850) * initialScale + dimensions.width * 0.1;
    
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslate, 0).scale(initialScale));

    const draw = () => {
      const periods = filteredItems.filter(i => i.type === 'period');
      mainGroup.selectAll('.period').data(periods).enter().append('rect')
        .attr('x', d => Math.min(xScale(d.startYear), xScale(d.endYear || d.startYear)))
        .attr('y', d => d.track * UI_CONFIG.TRACK_HEIGHT + 5)
        .attr('width', d => Math.max(5, Math.abs(xScale(d.endYear || d.startYear) - xScale(d.startYear))))
        .attr('height', UI_CONFIG.TRACK_HEIGHT - 10)
        .attr('rx', 8).attr('fill', d => categories.find(c => c.id === d.category)?.color || '#ccc')
        .attr('opacity', 0.1)
        .attr('stroke', d => categories.find(c => c.id === d.category)?.color || '#ccc')
        .attr('stroke-width', 1.5)
        .attr('class', 'cursor-pointer transition-opacity hover:opacity-20')
        .on('click', (e, d) => onSelectItem(d));

      filteredItems.filter(i => i.type !== 'period').forEach(d => {
        const itemG = mainGroup.append('g').attr('class', 'cursor-pointer group').on('click', () => onSelectItem(d));
        const color = categories.find(c => c.id === d.category)?.color || '#ccc';
        
        if (d.type === 'person') {
          itemG.append('rect')
            .attr('x', Math.min(xScale(d.startYear), xScale(d.endYear || d.startYear)))
            .attr('y', d.track * UI_CONFIG.TRACK_HEIGHT + 26)
            .attr('width', Math.max(6, Math.abs(xScale(d.endYear || d.startYear) - xScale(d.startYear))))
            .attr('height', 8).attr('rx', 4).attr('fill', color)
            .attr('class', 'shadow-sm');
        } else {
          itemG.append('circle')
            .attr('cx', xScale(d.startYear))
            .attr('cy', d.track * UI_CONFIG.TRACK_HEIGHT + 30)
            .attr('r', 5)
            .attr('fill', 'white')
            .attr('stroke', color)
            .attr('stroke-width', 3);
        }

        itemG.append('text')
          .attr('x', xScale(d.startYear))
          .attr('y', d.track * UI_CONFIG.TRACK_HEIGHT + 20)
          .attr('text-anchor', isRTL ? 'end' : 'start')
          .attr('dx', isRTL ? -8 : 8)
          .style('font-weight', '900')
          .style('fill', '#000')
          .attr('class', 'no-select timeline-item-text')
          .text(d.title[lang]);
      });
    };

    draw();
  }, [dimensions, filteredItems, lang, onSelectItem, categories]);

  return (
    <div className="w-full h-full relative bg-white overflow-hidden flex flex-col">
      <svg ref={svgRef} className="w-full h-full timeline-svg flex-1">
        <rect width="100%" height="100%" fill="transparent" />
        <g ref={gRef} />
      </svg>
    </div>
  );
});

export default D3Timeline;
