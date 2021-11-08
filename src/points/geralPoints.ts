interface Point {
  name: string;
  point: string;
  position: object;
  icon: string;
}
let AllPoints: Point[];

export default AllPoints = [
  {
    name: "Hercules",
    point: "1",
    position: { x: -1.3, z: -0.1, y: 0.2 },

    icon: "./img/circuito.png"
  },
  {
    name: "Aguieira",
    point: "2",
    position: { x: -2.3, z: 0.5, y: 0.4 },

    icon: "./img/circuito.png"
  },
  {
    name: "Vila Franca de Xira",
    point: "3",
    position: { x: -0.5, z: -1.1, y: 0.2 },

    icon: "./img/circuito.png"
  },
  {
    name: "Quinta de Flamenga",
    point: "4",
    position: { x: -2.2, z: 1, y: 0.3 },

    icon: "./img/quinta.png"
  },
  {
    name: "Quinta do Bulhaço",
    point: "5",
    position: { x: -1.9, z: -0.8, y: 0.3 },

    icon: "./img/quinta.png"
  },
  {
    name: "Igreja Matriz de São Pedro",
    point: "6",
    position: { x: -1.7, z: 0.7, y: 0.1 },

    icon: "./img/monumento.jpg"
  },
  {
    name: "Igreja Matriz de São João Batista",
    point: "7",
    position: { x: -1, z: -0.3, y: 0.2 },

    icon: "./img/monumento.jpg"
  },
  {
    name: "Convento Santo António",
    point: "8",
    position: { x: -0.9, z: -1.9, y: 0.3 },

    icon: "./img/monumento.jpg"
  }
];
