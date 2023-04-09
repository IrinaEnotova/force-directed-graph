'use strict';

// массив со связями
const links = [];

// константы
const MAIN_NODE_SIZE = 50;
const CHILD_NODE_SIZE = 20;
const LEAF_NODE_SIZE = 10;

// массив с узлами
const nodes = [];

// функция для создания родительских узлов
const addMainNode = (node) => {
  node.size = MAIN_NODE_SIZE;
  nodes.push(node);
}

const parentNode = {id: 'Arts Web'};
addMainNode(parentNode);

// функция для создания дочерних узлов
const addChildNode = (parentNode, childNode, size = CHILD_NODE_SIZE) => {
  childNode.size = size;
  nodes.push(childNode);
  links.push({source: parentNode, target: childNode})
}

const childNode = {id: 'Community Vision'};
addChildNode(parentNode, childNode);

for(let i = 0; i < 20; i++) {
  addChildNode(childNode, {id: ''}, LEAF_NODE_SIZE);
}

addChildNode(parentNode, {id: 'Silicon Valley Creates'});

// выберем контейнер для графа
const svg = d3.select('#container');
// задаем центральные координаты
const width = +svg.attr('width');
const height = +svg.attr('height');

const centerX = width / 2;
const centerY = height / 2;

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-2000)) //для задания расстояния между узлами
  .force('link', d3.forceLink(links))
  .force('center', d3.forceCenter(centerX, centerY)); 

// создадим круги для отображения узлов
const circles = svg
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  // .attr('r', 10); можно задать размер через радиус, а можно через свойство объекта
  // меняем цвет
  .attr('fill', 'gray')
  .attr('r', node => node.size);

// создадим текст над узлами
const text = svg
  .selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  // центрируем текст
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')

  .text(node => node.id);

// создадим отображение связей: source - начало, target - конец
const lines = svg
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('stroke', 'black');

// для начала симуляции вводим on и 
simulation.on('tick', () => {
  circles
    .attr('cx', node => node.x)
    .attr('cy', node => node.y);
  text
    .attr('x', node => node.x)
    .attr('y', node => node.y);
  lines
    .attr('x1', link => link.source.x)
    .attr('y1', link => link.source.y)
    .attr('x2', link => link.target.x)
    .attr('y2', link => link.target.y);
})