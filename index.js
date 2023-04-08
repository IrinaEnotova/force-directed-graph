'use strict';

// массив с узлами
const nodes = [
  {id: 'Alice'},
  {id: 'Bob'},
  {id: 'Carol'}
];

// массив со связями
const links = [
  {source: 0, target: 1},
  {source: 1, target: 2} 
];

// выберем контейнер для графа
const svg = d3.select('#container');
// задаем центральные координаты
const width = +svg.attr('width');
const height = +svg.attr('height');

const centerX = width / 2;
const centerY = height / 2;

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody())
  .force('link', d3.forceLink(links))
  .force('center', d3.forceCenter(centerX, centerY)); 

// создадим круги для отображения узлов
const circles = svg
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('r', 10);

// создадим отображение связей: source - начало, target - конец
const lines = svg
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('stroke', 'black');

// для начала симуляции вводим on и 
simulation.on('tick', () => {
  // console.log('tick');
  circles
    .attr('cx', node => node.x)
    .attr('cy', node => node.y);
  lines
    .attr('x1', link => link.source.x)
    .attr('y1', link => link.source.y)
    .attr('x2', link => link.target.x)
    .attr('y2', link => link.target.y);
})