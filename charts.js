/**
 * D3.js Chart Functions
 */
class ChartRenderer {
    static renderCumulativeChart(containerId, dailyData) {
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(`#${containerId}`).selectAll('*').remove();

        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(dailyData, d => new Date(d.date)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dailyData, d => d.cumulativeHours) * 1.1])
            .range([height, 0]);

        // Add area
        const area = d3.area()
            .x(d => x(new Date(d.date)))
            .y0(height)
            .y1(d => y(d.cumulativeHours))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(dailyData)
            .attr('fill', '#E63946')
            .attr('fill-opacity', 0.2)
            .attr('d', area);

        // Add line
        const line = d3.line()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.cumulativeHours))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(dailyData)
            .attr('fill', 'none')
            .attr('stroke', '#E63946')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y')))
            .attr('color', '#A0A0A0');

        g.append('g')
            .call(d3.axisLeft(y))
            .attr('color', '#A0A0A0');

        // Add labels
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .text('Total Hours');

        g.append('text')
            .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 5})`)
            .style('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .text('Date');
    }

    static renderDailyChart(containerId, dailyData) {
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(`#${containerId}`).selectAll('*').remove();

        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(dailyData, d => new Date(d.date)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dailyData, d => d.totalHours) * 1.2])
            .range([height, 0]);

        // Add bars
        g.selectAll('.bar')
            .data(dailyData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(new Date(d.date)))
            .attr('width', Math.max(1, width / dailyData.length - 1))
            .attr('y', d => y(d.totalHours))
            .attr('height', d => height - y(d.totalHours))
            .attr('fill', '#2A9D8F')
            .attr('opacity', 0.7);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')))
            .attr('color', '#A0A0A0');

        g.append('g')
            .call(d3.axisLeft(y))
            .attr('color', '#A0A0A0');

        // Add labels
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .text('Hours');

        g.append('text')
            .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 5})`)
            .style('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .text('Date');
    }

    static renderDurationChart(containerId, history) {
        const buckets = [
            { min: 0, max: 2, label: '0-2 min' },
            { min: 2, max: 5, label: '2-5 min' },
            { min: 5, max: 10, label: '5-10 min' },
            { min: 10, max: 15, label: '10-15 min' },
            { min: 15, max: 20, label: '15-20 min' },
            { min: 20, max: 30, label: '20-30 min' },
            { min: 30, max: 45, label: '30-45 min' },
            { min: 45, max: 60, label: '45-60 min' },
            { min: 60, max: Infinity, label: '60+ min' }
        ];

        const counts = buckets.map(bucket => ({
            label: bucket.label,
            count: history.filter(h => {
                const mins = h.durationMinutes || 0;
                return mins >= bucket.min && mins < bucket.max;
            }).length
        }));

        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(`#${containerId}`).selectAll('*').remove();

        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(counts.map(d => d.label))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(counts, d => d.count) * 1.1])
            .range([height, 0]);

        const colors = ['#06D6A0', '#1B9E87', '#2A9D8F', '#52B788', '#95D5B2', '#E9C46A', '#F4A261', '#E76F51', '#E63946'];

        g.selectAll('.bar')
            .data(counts)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.label))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.count))
            .attr('height', d => height - y(d.count))
            .attr('fill', (d, i) => colors[i % colors.length]);

        // Add value labels
        g.selectAll('.label')
            .data(counts)
            .enter()
            .append('text')
            .attr('x', d => x(d.label) + x.bandwidth() / 2)
            .attr('y', d => y(d.count) - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .text(d => d.count);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .attr('color', '#A0A0A0')
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        g.append('g')
            .call(d3.axisLeft(y))
            .attr('color', '#A0A0A0');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .text('Number of Videos');
    }

    static renderLevelPie(containerId, history) {
        const levelCounts = {};
        history.forEach(h => {
            const level = h.level || 'Unknown';
            levelCounts[level] = (levelCounts[level] || 0) + (h.durationHours || 0);
        });

        const data = Object.entries(levelCounts).map(([level, hours]) => ({
            level,
            hours
        }));

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2 - 40;

        d3.select(`#${containerId}`).selectAll('*').remove();

        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.level))
            .range(['#06D6A0', '#118AB2', '#FFD166', '#EF476F', '#9B5DE5', '#95A5A6']);

        const pie = d3.pie()
            .value(d => d.hours)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.4)
            .outerRadius(radius);

        const arcs = svg.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.level))
            .attr('stroke', '#1a1a2e')
            .attr('stroke-width', 2);

        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('fill', '#EAEAEA')
            .attr('font-size', '12px')
            .text(d => d.data.level);

        // Add legend
        const legend = svg.selectAll('.legend')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(${width / 2 - 100}, ${-height / 2 + 20 + i * 20})`);

        legend.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d => color(d.level));

        legend.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .attr('fill', '#EAEAEA')
            .text(d => `${d.level}: ${d.hours.toFixed(1)}h`);
    }
}
