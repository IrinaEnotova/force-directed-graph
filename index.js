'use strict';

// создаем массив с цветами для узлов
const colors = [
  ['#9D4452', '#E6A6B0', '#BE6B78', '#812836', '#5B0D1A'],
  ['#A76C48', '#F4CAAF', '#C99372', '#884E2A', '#602E0E'],
  ['#2E6B5E', '#719D93', '#498175', '#1B584A', '#093E32'],
  ['#538E3D', '#A6D096', '#75AC61', '#3A7424', '#1F520C'],
];

// константы
const MAIN_NODE_SIZE = 40;
const CHILD_NODE_SIZE = 15;
const LEAF_NODE_SIZE = 5;
const DEFAULT_DISTANCE = 20;
const MAIN_NODE_DISTANCE = 90;
const LEAF_NODE_DISTANCE = 30;
const MANY_BODY_STRENGTH = -10;

// массив с узлами
const nodes = [];

// массив со связями
const links = [];

// функция для создания родительских узлов
// i - переменная, созданная, для передачи цвета
let i = 0;
const addMainNode = (node) => {
  node.size = MAIN_NODE_SIZE;
  // зададим цвет из массива выше
  node.color = colors[i++][1];
  nodes.push(node);
}

// функция для создания дочерних узлов
const addChildNode = (parentNode, childNode, size = CHILD_NODE_SIZE, distance = DEFAULT_DISTANCE) => {
  childNode.size = size;
  // задаем цвет в зависимости от родительского узла
  childNode.color = parentNode.color;
  nodes.push(childNode);
  // задаем и связи такой же цвет как у родителя
  links.push({source: parentNode, target: childNode, distance, color: parentNode.color})
}

// функция для добавления дочерних узлов к главным узлам
const assembleChildNode = (parentNode, id, numLeaves = 20) => {
  const childNode = { id };
  addChildNode(parentNode, childNode);
  
  for(let i = 0; i < numLeaves; i++) {
    addChildNode(childNode, {id: ''}, LEAF_NODE_SIZE, LEAF_NODE_DISTANCE);
  }
}

//  функция для добавления связи между главными source и target
const connectMainNodes = (source, target) => {
  links.push({
    source, 
    target, 
    distance: MAIN_NODE_DISTANCE,
    color: source.color
  });
}

const artsWeb = {id: 'Arts Web'};
addMainNode(artsWeb);
assembleChildNode(artsWeb, 'Community Vision');
assembleChildNode(artsWeb, 'Silicon Valley Creates');

const socialImpactCommons = {id: 'Social Impact Commons'};
addMainNode(socialImpactCommons);
assembleChildNode(socialImpactCommons, 'Theatre Bay Area');
assembleChildNode(socialImpactCommons, 'EastSide Arts Alliance');
assembleChildNode(socialImpactCommons, 'Local Color');

const casTrust = {id: 'Community Arts Stabilization Trust'};
addMainNode(casTrust);
assembleChildNode(casTrust, 'Counter Pulse');
assembleChildNode(casTrust, 'Luggage Store Gallery');
assembleChildNode(casTrust, 'Perfoming Arts Workshop');
assembleChildNode(casTrust, '447 Minna St.', 5);
assembleChildNode(casTrust, 'Keeping Space Oakland');

const ambitioUS = {id: 'AmbitioUS'};
addMainNode(ambitioUS);
assembleChildNode(ambitioUS, 'EBPREC');
assembleChildNode(ambitioUS, 'SELC', 0);
assembleChildNode(ambitioUS, 'The Runway Project', 0);
assembleChildNode(ambitioUS, 'Common Future', 0);
assembleChildNode(ambitioUS, 'Freelancers Union', 0);
assembleChildNode(ambitioUS, 'US Federation of Worker Cooperatives', 0);

connectMainNodes(artsWeb, socialImpactCommons);
connectMainNodes(artsWeb, casTrust);
connectMainNodes(socialImpactCommons, casTrust);
connectMainNodes(ambitioUS, casTrust);
connectMainNodes(ambitioUS, socialImpactCommons);
connectMainNodes(ambitioUS, artsWeb);



// выберем контейнер для графа
const svg = d3.select('#container');
// задаем центральные координаты
const width = +svg.attr('width');
const height = +svg.attr('height');
const centerX = width / 2;
const centerY = height / 2;

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(MANY_BODY_STRENGTH)) //для задания расстояния между узлами
  .force('link', d3.forceLink(links).distance(link => link.distance)) // для задания силы связи в виде расстояния между узлами, дефолтное значение - 30 (можно изменить и силу, надо смотреть документацию - через точку после метода можно задать distance и force)
  .force('center', d3.forceCenter(centerX, centerY)); 

// для того, чтобы перемещать узлы - потом см узлы ниже
const dragInteraction = d3.drag().on('drag', (event, node) => {
  // чтобы зафиксировать положение узла после перемещения нужно использовать fx и fy
  node.fx = event.x;
  node.fy = event.y;
  // для того, чтобы наше отображение не зависало
  simulation.alpha(1);
  simulation.restart();
});

// создадим отображение связей: source - начало, target - конец
const lines = svg
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  // задаем цвет линии с помощью функции
  .attr('stroke', link => link.color || 'black');

// создадим круги для отображения узлов
const circles = svg
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  // .attr('r', 10); можно задать размер через радиус, а можно через свойство объекта
  // меняем цвет с помощью функции
  .attr('fill', (node) => node.color || 'gray')
  .attr('r', node => node.size)
  .call(dragInteraction);

  // создадим текст над узлами - чтобы текст создался НАД узлами, нужно создавать переменную после узлов и связей
const text = svg
.selectAll('text')
.data(nodes)
.enter()
.append('text')
// центрируем текст
.attr('text-anchor', 'middle')
.attr('alignment-baseline', 'middle')
// чтобы нельзя было выделить текст при перетаскивании узлов
.style('pointer-events', 'none')
.text(node => node.id);

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