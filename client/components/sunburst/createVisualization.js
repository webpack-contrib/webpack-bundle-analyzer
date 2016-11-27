import * as d3 from 'd3';

const fadeOpacity = 0.5;
let svg;

const color = d3.scaleOrdinal(d3.schemeCategory20);
const getColor = (d) => {
  const colorData = (d.children ? d : d.parent).data;
  return color(colorData.path || colorData.label);
};

function calculateChartSize() {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

  return { chartWidth: x, chartHeight: y };
}

export default function createVisualization({
  svgElement,
  responsiveClassName,
  data,
  onMouseOver,
  onMouseLeave
}) {
  const { chartWidth, chartHeight } = calculateChartSize();

  const radius = Math.min(chartWidth, chartHeight) / 2;

  const x = d3.scaleLinear().range([0, 2 * Math.PI]);
  const y = d3.scaleSqrt().range([0, radius]);

  const partition = d3.partition();

  const arc = d3.arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

  if (svg) {
    svgElement.innerHTML = '';
  }

  svg = d3.select(svgElement)
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .append('g')
    .attr(
      'transform',
      `translate(${chartWidth / 2},${chartHeight / 2})`
    )
    .on('mouseleave', () => mouseleave(onMouseLeave));

  const appData = {
    groups: data,
    type: '@@root'
  }
  const root = d3.hierarchy(appData, (d => d.groups));
  root.sum(d => d.statSize); // TODO: Other sizes besides `statSize`

  svg.selectAll('path')
      .data(partition(root).descendants())
    .enter()
    .append('path')
      .attr('d', arc)
      .style('stroke-width', 1)
      .style('stroke', '#000')
      .style('fill', getColor)
      .on('mouseover', (object) => mouseover(object, onMouseOver))
      .on('click', click);

  function click(d) {
    svg.transition()
      .duration(750)
      .tween('scale', () => {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]);
        const yd = d3.interpolate(y.domain(), [d.y0, 1]);
        const yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);

        return (t) => {
          x.domain(xd(t));
          y.domain(yd(t)).range(yr(t));
        }
      })
      .selectAll('path')
      .attrTween('d', (d) => () => arc(d));
  }
}

const allChildren = (object) => {
  return object.reduce((acc, child) => {
    if (child.children) {
      return acc.concat(child, allChildren(child.children));
    }
    return acc.concat(child);
  }, []);
}

function mouseover(object, callback) {
  const childrenArray = allChildren([object]);

  const paths = svg.selectAll('path');

  // Fade all the segments.
  paths.style('opacity', fadeOpacity);
  paths.style('stroke-width', fadeOpacity);

  // Highlight only those that are children of the current segment.
  const filteredPaths = paths.filter(node => {
    return childrenArray.indexOf(node) >= 0;
  })

  if (filteredPaths.size()) {
    filteredPaths.style('stroke-width', 2);
    filteredPaths.style('opacity', 1);
  }

  if (object.data.type === '@@root') {
    callback({
      label: 'All bundles',
      statSize: object.children.reduce((sum, d) => sum + d.data.statSize, 0),
      parsedSize: object.children.reduce((sum, d) => sum + d.data.parsedSize, 0),
      gzipSize: object.children.reduce((sum, d) => sum + d.data.gzipSize, 0)
    });
  } else {
    callback({
      label: object.data.label,
      statSize: object.data.statSize,
      parsedSize: object.data.parsedSize,
      gzipSize: object.data.gzipSize,
      path: object.data.path
    });
  }
}

function mouseleave(callback) {
  const paths = svg.selectAll('path');

  paths.style('opacity', 1);
  paths.style('stroke-width', 1);

  callback();
}
