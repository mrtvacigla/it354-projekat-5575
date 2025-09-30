import React from 'react';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function PieChart({ data, width = 400, height = 400 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 20);

    const slices = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    const labelArc = d3.arc().innerRadius(radius - 60).outerRadius(radius - 60);
    
    svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text(d => d.data.label);

  }, [data, width, height]);

  return <svg ref={svgRef} className="mx-auto"></svg>;
}