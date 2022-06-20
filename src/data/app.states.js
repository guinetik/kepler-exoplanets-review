/*
  To simplify state transitions, I'm creating this "master" js file that will have all available states for the app.
  Components will reference AppState to get props and we'll need to manage this object as data gets loaded in.
 */
import Zdog from "zdog";
const { TAU } = Zdog;
const PLANET_DATA = [
  {
    name: "Host",
    value: "Sol"
  },
  {
    name: "Disovery Year",
    value: "2020"
  },
  {
    name: "Reference",
    value: "Shporer et al. 2020",
    link: true,
    href: "https://ui.adsabs.harvard.edu/abs/2020ApJ...890L...7S/abstract"
  },
  {
    name: "Disposition",
    value: "Confirmed Planet"
  },
  {
    name: "Orbital Period",
    value: "0.5182349"
  },
  {
    name: "Planet Radius",
    value: "1.193±0.074"
  },
  {
    name: "Transit Duration",
    value: "0.734"
  },
  {
    name: "Planet Mass",
    value: "2.09±0.56"
  },
  {
    name: "Inclination",
    value: "85.0"
  },
  {
    name: "Radial Velocity",
    value: "3.17±0.85"
  }
];
//
const SOLAR_SYSTEM = [
  {
    name: "sun",
    displayName: "Sol",
    diameter: 8,
    color: "#eb710b",
    orbitDiameter: 0,
    starLight: 1.2,
    starColor: "#eb710b66",
    type:"star"
  },
  {
    name: "mercury",
    id:1,
    displayName: "Mercury",
    diameter: 1,
    color: "#ada8a5",
    orbitDiameter: 12,
    orbitPeriod: 88 / 2,
    orbitTilt: -TAU * 0.019,
    orbitNode: -TAU * 0.314,
    satelliteOf: "sun",
    type:"planet"
  },
  
  {
    name: "venus",
    id:2,
    displayName: "Venus",
    diameter: 1.5,
    color: "#c18f17",
    orbitDiameter: 16,
    orbitPeriod: 225 / 3,
    orbitTilt: -TAU * 0.009,
    orbitNode: -TAU * 0.213,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "earth",
    id:3,
    displayName: "Earth",
    diameter: 2,
    color: "#4f4cb0",
    orbitDiameter: 21,
    orbitPeriod: 365 / 4,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "mars",
    id:4,
    displayName: "Mars",
    diameter: 1.25,
    color: "#bc420e",
    orbitDiameter: 26,
    orbitPeriod: 687 / 5,
    orbitTilt: -TAU * 0.005,
    orbitNode: -TAU * 0.138,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "jupiter",
    id:5,
    displayName: "Jupiter",
    diameter: 4,
    color: "#ad7b5a",
    orbitDiameter: 40,
    orbitPeriod: 4333 / 7,
    orbitTilt: -TAU * 0.004,
    orbitNode: -TAU * 0.279,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "saturn",
    id:6,
    displayName: "Saturn",
    diameter: 3,
    color: "#a37c33",
    orbitDiameter: 56,
    orbitPeriod: 10759 / 9,
    orbitTilt: -TAU * 0.007,
    orbitNode: -TAU * 0.316,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "uranus",
    id:7,
    displayName: "Uranus",
    diameter: 2.75,
    color: "#5dacde",
    orbitDiameter: 72,
    orbitPeriod: 30689 / 13,
    orbitTilt: -TAU * 0.002,
    orbitNode: -TAU * 0.206,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "neptune",
    id:8,
    displayName: "Neptune",
    diameter: 2.5,
    color: "#3d52b5",
    orbitDiameter: 88,
    orbitPeriod: 60182 / 17,
    orbitTilt: -TAU * 0.005,
    orbitNode: -TAU * 0.366,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "pluto",
    id:9,
    displayName: "Pluto",
    diameter: 0.5,
    color: "#826e57",
    orbitDiameter: 106,
    orbitPeriod: 90560 / 25,
    orbitTilt: -TAU * 0.048,
    orbitNode: -TAU * 0.306,
    orbitTranslateZ: -5,
    satelliteOf: "sun",
    type:"planet"
  },
  {
    name: "moon",
    id:10,
    displayName: "Moon",
    diameter: 0.5,
    color: "#d6d6d6",
    orbitDiameter: 3,
    orbitPeriod: 27 / 2,
    orbitTilt: -TAU * 0.065,
    orbitNode: -TAU * 0.347,
    satelliteOf: "earth",
    type:"moon"
  },
  {
    name: "io",
    id:11,
    displayName: "Io",
    diameter: 0.5,
    color: "#eae565",
    orbitDiameter: 5,
    orbitPeriod: 1 * 20,
    orbitTilt: 0,
    satelliteOf: "jupiter",
    type:"moon"
  },
  {
    name: "europa",
    id:12,
    displayName: "Europa",
    diameter: 0.5,
    color: "#9c7e5c",
    orbitDiameter: 6.5,
    orbitPeriod: 4 * 8,
    orbitTilt: -TAU * 0.001,
    satelliteOf: "jupiter",
    type:"moon"
  },
  {
    name: "ganymede",
    id:13,
    displayName: "Ganymede",
    diameter: 0.75,
    color: "#a1907e",
    orbitDiameter: 8,
    orbitPeriod: 7 * 6,
    orbitTilt: -TAU * 0.001,
    satelliteOf: "jupiter",
    type:"moon"
  },
  {
    name: "callisto",
    id:14,
    displayName: "Callisto",
    diameter: 0.5,
    color: "#4a4e4f",
    orbitDiameter: 10,
    orbitPeriod: 17 * 3,
    orbitTilt: -TAU * 0.01,
    satelliteOf: "jupiter",
    type:"moon"
  },
  {
    name: "ringSaturn",
    color: "#edc98566",
    orbitDiameter: 4,
    orbitTilt: -TAU * 0.05,
    satelliteOf: "saturn",
    ring: 4,
  },
];

const STAR_DATA = {
  id: 1,
  name: "Star Name",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  data: [
    {
      name: "Distance",
      col: "distance",
      value: "20.3730±0.0192 pc",
    },
    {
      name: "Number of Planets",
      col: "planets",
      value: 2,
    },
    {
      name: "Discovery Method",
      value: "Transit",
    },
    {
      name: "Discovery Year",
      value: 2020,
    },
    {
      name: "Spectral Type",
      col: "type",
      value: "G6V",
    },
    {
      name: "Effective Temperature [K]",
      value: "5428±80",
    },
    {
      name: "Stellar Radius",
      value: "0.964±0.029",
    },
    {
      name: "Stellar Mass",
      value: "1.01±0.06",
    },
    {
      name: "Stellar Metallicity",
      value: "0.1±0.1",
    },
    {
      name: "Stellar Metallicity Ratio",
      value: "[Fe/H]",
    },
  ],
};

const AppStates = {
  solarSystem: SOLAR_SYSTEM,
  stars: [
    { ...STAR_DATA, id: 1 },
    { ...STAR_DATA, id: 2 },
    { ...STAR_DATA, id: 3 },
    { ...STAR_DATA, id: 4 },
    { ...STAR_DATA, id: 5 },
    { ...STAR_DATA, id: 6 },
    { ...STAR_DATA, id: 7 },
    { ...STAR_DATA, id: 8 },
  ],
  star: STAR_DATA,
  planet: { data: PLANET_DATA},
  getStarProp: (star, name) => {
    let filtered = star.data.filter((p) => {
      return p.col === name;
    });
    if (filtered.length > 0) return filtered[0].value;
    else return "Unknown";
  },
  getStarLabel: (star, name) => {
    let filtered = star.data.filter((p) => {
      return p.col === name;
    });
    if (filtered.length > 0) return filtered[0].name;
    else return "Unknown";
  }
};
export default AppStates;
