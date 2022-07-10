import Zdog from "zdog";
import { useState, useEffect } from "react";
import SolarSystemFactory from "../data/solarsystem.factory";
import AppData from "../data/app.data";
/* 
Inspired from https://codepen.io/robbobfrh84/pen/pmXYzY
*/
// 🌱 CHARACTERISTICS 🌱
const planet_radius = 125;
const atmosphere_thickness = 16;
let offset_x = 0;
let offset_y = -50;

const TAU = Zdog.TAU;
let isSpinning = true;
let regenerate = false;
let space = null;

const generate_world = (space, randomMass, planetData) => {
  //console.log("generate_world", planetData);
  let planetColor = SolarSystemFactory.getPlanetColor(planetData, 0);
  if (planetData.visType.toLowerCase() === "lavaatmos") {
    planetColor = SolarSystemFactory.getPlanetColor(planetData, 4);
  }
  const query = planetData.planet_type.toLowerCase();
  console.log("planetColor", planetColor);
  // 🌏 PLANET 🌏
  const topHempishere = new Zdog.Hemisphere({
    addTo: space,
    diameter: planet_radius * 2,
    translate: { x: offset_x, y: offset_y },
    color: planetColor, //backface: "blue",
    stroke: false,
  });

  topHempishere.copy({
    rotate: { y: Zdog.TAU / 2 }, //color: "blue", backface: "cornflowerblue",
  });

  // 💈 NORTH / SOUTH POLE 💈
  const north_pole = new Zdog.Shape({
    addTo: space,
    translate: { x: offset_x, y: offset_y },
    path: [{ y: planet_radius * -1 }, { y: (planet_radius + 50) * -1 }],
    stroke: 2,
    color: "firebrick",
  });
  const north_pole_mark = new Zdog.Ellipse({
    addTo: north_pole,
    translate: { y: (planet_radius - 1) * -1 },
    rotate: { x: TAU / 4 },
    diameter: 20,
    stroke: 8,
    fill: true,
    color: "rgba(200,190,190,1)",
  });
  // 🔰 South pole !
  north_pole.copy({
    path: [{ y: planet_radius }, { y: planet_radius + 50 }],
    color: "blue",
  });
  north_pole_mark.copy({
    addTo: north_pole,
    translate: { y: planet_radius - 3 },
    color: "rgba(100,100,255,1)",
  });

  // // 🇪🇨 ⭕️ Equator ⭕️ 🇪🇨
  // set_latitude_marks(0, 400, 3, 0, "rgba(184,134,11,0.5)", "dot")
  // // 🎅 PRIME MERIDIAN 🐧
  // set_longitude_marks(0, 200, 3, 0,"rgba(0,110,0,0.3)", "dot")

  // ☁️☁️☁️ CLOUDS ☁️☁️☁️
  let cloudCount = 0;
  console.log("planetData.visType", planetData.visType);
  if (planetData.visType.toLowerCase() === "lavaatmos") {
    for (var i = 0; i < atmosphere_thickness * Math.random() * 10; i++) {
      create_cloud_cluster({
        lat: random(-50, 50),
        lng: random(-180, 180),
        altitude: random(10, 30),
        count: random(10, 30),
        strokeMaxMin: [8, 25],
      });
    }

    function create_cloud_cluster(cords) {
      for (var i = 0; i < cords.count; i++) {
        set_cordinate_mark({
          lat: cords.lat + random(0, cords.count / 3),
          lng: cords.lng + random(0, cords.count),
          stroke: random(cords.strokeMaxMin[0], cords.strokeMaxMin[1]),
          color: "rgba(200,200,200," + random(0, 5) / 10 + ")",
          altitude: cords.altitude + random(5, 15),
          shape: "dot",
        });
        cloudCount++;
      }
    }
  }

  //  🏔🌋⛰ LAND 🏔🌋⛰
  const interval = 90;
  const stroke = 2;
  const radShift = 0;
  const maxGrow = -1;
  const maxShrink = -3;
  let cols = [
    "rgba(255,255,255,0.1)",
    "rgba(255,255,255,0.2)",
    "rgba(255,255,255,0.3)",
    "rgba(160,130,52,1)",
    "rgba(160,130,52,1)",
    "rgba(0,128,0,1)",
    "rgba(85,107,47,1)",
    "rgba(67,85,37,1)",
    "rgba(160,100,42,1)",
    "rgba(140,80,42,1)",
    "rgba(120,60,42,1)",
    "rgba(170,110,92,1)",
    "rgba(200,180,200,1)",
  ];
  let landMassCount = 0;
  const lngI = 360 / interval;
  const d = (Math.PI * planet_radius) / interval;
  const r = d / 2;
  const r2 = r / 2;
  const pr = Math.sqrt(r * r + r2 * r2);
  const latI = Math.sqrt(r * 2 * (r * 2) - r * r);
  const hexWheel = [
    {
      TR: (s, i, { lat, lng }) => {
        return [latI * s - latI * i, (lngI / 2) * s + (lngI * i) / 2];
      },
    },
    {
      R: (s, i, { lat, lng }) => {
        return [-(latI * i), lngI * s - (lngI * i) / 2];
      },
    },
    {
      BR: (s, i, { lat, lng }) => {
        return [-latI * s, (lngI / 2) * s - lngI * i];
      },
    },
    {
      BL: (s, i, { lat, lng }) => {
        return [-latI * s + latI * i, (-lngI / 2) * s - (lngI * i) / 2];
      },
    },
    {
      L: (s, i, { lat, lng }) => {
        return [latI * i, -lngI * s + (lngI * i) / 2];
      },
    },
    {
      TL: (s, i, { lat, lng }) => {
        return [latI * s, (-lngI / 2) * s + lngI * i];
      },
    },
  ];

  // ⛰🏔🌋⛰🏔 Build land around center mark! ⛰🏔🌋⛰🏔
  function buildLandMass({ sLat, sLng, stages }, colorz, mountains) {
    // 🌋 Center Land Mark
    const landKey = { "0-TR-0": stages };
    set_cordinate_mark({
      lat: sLat,
      lng: sLng,
      radius: pr * 2,
      stroke,
      altitude: stages * 0.75,
      color: colorz ? colorz[stages] : cols[stages],
      shape: "poly",
      sides: 6,
    });

    // ⛰🌋🏔 Build land around center mark!
    for (let stage = 0; stage <= stages; stage++) {
      for (let hw = 0; hw < hexWheel.length; hw++) {
        const key = Object.keys(hexWheel[hw])[0];
        for (let i = 1; i <= stage; i++) {
          let look = i <= 2 ? 0 : i - 2;
          let land =
            stage != 1
              ? landKey[stage - 1 + "-" + key + "-" + look]
              : landKey["0-TR-0"];
          const [lat, lng] = hexWheel[hw][key](stage, i - 1, { sLat, sLng });
          const setStk = stages - stage < 1 ? 0 : stroke;
          let newAlt = land + random(maxShrink, maxGrow);
          if (newAlt > -1) {
            set_cordinate_mark({
              lat: lat + sLat,
              lng: lng + sLng,
              radius: pr * 2 + radShift,
              stroke: setStk,
              altitude: newAlt * 0.75,
              color: colorz ? colorz[newAlt] : cols[newAlt],
              shape: "poly",
              sides: 6,
            });
            landMassCount++;
            // 🏔⬆️ BUILD MOUNTAINS UP!
            if (mountains) {
              for (var a = 0; a < newAlt; a++) {
                set_cordinate_mark({
                  lat: lat + sLat,
                  lng: lng + sLng,
                  radius: pr * 2 + radShift,
                  stroke: setStk,
                  altitude: a,
                  color: colorz ? colorz[newAlt] : cols[newAlt],
                  shape: "poly",
                  sides: 6,
                });
                landMassCount++;
              }
            }
          }
          landKey[stage + "-" + key + "-" + (i - 1)] = newAlt;
        }
      }
    }
  }
  if (randomMass) {
    for (var i = 0; i < 8; i++) {
      buildLandMass({
        sLat: random(-75, 75),
        sLng: random(0, 180),
        stages: random(4, 12),
      });
    }
    for (var i = 0; i < 20; i++) {
      buildLandMass({
        sLat: random(-55, 55),
        sLng: random(-179, 180),
        stages: random(1, 2),
      });
    }
  } else {
    console.log("query", query);
    if (query === "terrestrial") {
      buildLandMass({ sLat: 20, sLng: 37, stages: 12 });
      buildLandMass({ sLat: 40, sLng: -37, stages: 12 });
      buildLandMass({ sLat: 30, sLng: -27, stages: 12 });
      buildLandMass({ sLat: 0, sLng: 150, stages: 8 });
      buildLandMass({ sLat: 60, sLng: -70, stages: 12 });
      buildLandMass({ sLat: 10, sLng: -10, stages: 8 });
      buildLandMass({ sLat: -50, sLng: -130, stages: 9 });
      buildLandMass({ sLat: 20, sLng: -90, stages: 6 });
      buildLandMass({ sLat: -10, sLng: 10, stages: 12 });
      buildLandMass({ sLat: -15, sLng: 180, stages: 12 });
      buildLandMass({ sLat: 35, sLng: 80, stages: 9 });
      // Reefs
      buildLandMass({ sLat: -35, sLng: 80, stages: 3 });
      buildLandMass({ sLat: -40, sLng: 90, stages: 3 });
      buildLandMass({ sLat: -43, sLng: 90, stages: 2 });
      buildLandMass({ sLat: 33, sLng: 180, stages: 2 });
      buildLandMass({ sLat: 30, sLng: 170, stages: 3 });
      buildLandMass({ sLat: 32, sLng: 150, stages: 2 });
      buildLandMass({ sLat: 25, sLng: -130, stages: 3 });
    } else if (query === "neptune-like") {
      /* set_cordinate_mark({
        lat: 90,
        lng: 0,
        radius: 50,
        stroke,
        altitude: 3,
        color: "#353a3d",
        shape: "poly",
        sides: 6,
      }); */
      let neptuneColors = [
        "rgba(0,0,0,0.1)",
        "rgba(0,0,0,0.15)",
        "#6FA5B1",
        "#5E8A93",
        "#6FA5B1",
        "#5E8A93",
        "#697D84",
        "rgba(255,255,255,0.3)",
        "rgba(255,255,255,0.5)",
      ];
      const polarLevel = 1;
      const equatorLevel = 10;
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 110, sLng: index * 10, stages: polarLevel },
          neptuneColors
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 100, sLng: index * 10, stages: 2 },
          neptuneColors
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 120, sLng: index * 10, stages: polarLevel },
          neptuneColors
        );
      }
      //
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 180, sLng: index * 10, stages: 2 },
          neptuneColors
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 170, sLng: index * 10, stages: 1 },
          neptuneColors.reverse()
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 190, sLng: index * 10, stages: 1 },
          neptuneColors.reverse()
        );
      }
      //
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: -100, sLng: index * 10, stages: polarLevel },
          neptuneColors
        );
      }
      //
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: -110, sLng: index * 10, stages: 2 },
          neptuneColors
        );
      }
    } else if (query === "super earth") {
      let superEarthColors = [
        "rgba(0,0,0,0.1)",
        "rgba(255,255,255,0.2)",
        "#6a351a",
        "#824121",
        "#6a351a",
        "#a32e2c",
        "#3c1010",
        "#361b0e",
        "rgba(160,100,42,1)",
        "rgba(140,80,42,1)",
        "rgba(120,60,42,1)",
        "rgba(170,110,92,1)",
        "rgba(200,200,200,0.5)",
      ];
      for (var i = 0; i < 4; i++) {
        buildLandMass(
          {
            sLat: random(-75, 75),
            sLng: random(-180, 0),
            stages: random(2, 6),
          },
          superEarthColors,
          false
        );
      }
      for (var i = 0; i < 10; i++) {
        buildLandMass(
          {
            sLat: random(-75, 75),
            sLng: random(0, 180),
            stages: random(4, 6),
          },
          superEarthColors,
          true
        );
      }
      for (var i = 0; i < 4; i++) {
        buildLandMass(
          {
            sLat: random(-75, 75),
            sLng: random(0, 180),
            stages: random(2, 6),
          },
          superEarthColors,
          false
        );
      }
      for (var i = 0; i < 90; i++) {
        buildLandMass(
          {
            sLat: random(-55, 55),
            sLng: random(-179, 180),
            stages: random(1, 3),
          },
          superEarthColors,
          false
        );
      }
    } else if (query === "gas giant") {
      const gasGiantColors = [
        "rgba(0,0,0,0.1)",
        "#dbc8cf",
        "#e1bda6",
        "#be947b",
        "#a66d65",
        "#e87849",
        "#ab4219",
        "#be5c2a",
        "#a54426",
        "#a54426"
      ];
      const darkColors = ["rgba(0,0,0,0.2)",  "rgba(255,255,255,0.5)", "rgba(0,0,0,0.1)","rgba(0,0,0,0.5)"];
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 180, sLng: index * 10, stages: 2 },
          gasGiantColors
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 120, sLng: index * 10, stages: 1 },
          gasGiantColors
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: 110, sLng: index * 10, stages: 2 },
          gasGiantColors.reverse()
        );
      }
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: -110, sLng: index * 10, stages: 2 },
          gasGiantColors
        );
      }
      //
      for (let index = 0; index < 36; index++) {
        buildLandMass(
          { sLat: -120, sLng: index * 10, stages: 1 },
          gasGiantColors.reverse()
        );
      }
      buildLandMass({ sLat: -10, sLng: -10,  stages: 10 }, gasGiantColors);
    }
  }

  // 🌐 🛠 LATITUDE & LONGITUDE MARKS & TOOLS 🛠 🌐
  function set_latitude_marks(lat, cnt, stroke, altitude, color, shape) {
    for (var j = 0; j < cnt; j++) {
      set_cordinate_mark({
        lng: (360 / cnt) * j,
        lat,
        stroke,
        color,
        altitude,
        shape,
      });
    }
  }

  function set_longitude_marks(lng, cnt, stroke, altitude, color, shape) {
    for (var j = 0; j < cnt; j++) {
      set_cordinate_mark({
        lat: (180 / cnt) * j - 90,
        lng,
        stroke,
        color,
        altitude,
        shape,
      });
    }
  }

  function set_cordinate_mark(mark) {
    const lat_radians = TAU / 4 - mark.lat * (Math.PI / 180) * -1;
    const lng_radians = mark.lng * (Math.PI / 180) * -1;
    var rotor1 = new Zdog.Anchor({
      addTo: space,
      translate: { x: offset_x, y: offset_y },
      rotate: { y: lng_radians },
    });
    var rotor2 = new Zdog.Anchor({
      addTo: rotor1,
      rotate: { x: lat_radians },
    });
    if (mark.shape === "dot") {
      new Zdog.Shape({
        addTo: rotor2,
        translate: { y: planet_radius + (mark.altitude || 0) },
        stroke: mark.stroke,
        color: mark.color,
      });
    } else if (mark.shape === "cone") {
      new Zdog.Cone({
        addTo: rotor2,
        translate: { y: planet_radius + (mark.altitude || 0) },
        rotate: { x: TAU * 0.75 },
        diameter: mark.diameter,
        length: mark.length,
        color: mark.color,
      });
    } else if (mark.shape === "poly") {
      new Zdog.Polygon({
        addTo: rotor2,
        sides: mark.sides,
        radius: mark.radius,
        translate: { y: planet_radius + (mark.altitude || 0) },
        rotate: { x: TAU * 0.75 },
        stroke: mark.stroke,
        fill: true,
        color: mark.color,
        backface: mark.backface,
      });
    }
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  //
  let viewRotation = new Zdog.Vector();
  let dragStartRX, dragStartRY;
  new Zdog.Dragger({
    startElement: space.element,
    onDragStart: function () {
      dragStartRX = viewRotation.x;
      dragStartRY = viewRotation.y;
      isSpinning = false;
    },
    onDragMove: function (pointer, moveX, moveY) {
      // move rotation
      let moveRX = (moveY / space.width) * Zdog.TAU * -1;
      let moveRY = (moveX / space.width) * Zdog.TAU * -1;
      viewRotation.x = dragStartRX + moveRX;
      viewRotation.y = dragStartRY + moveRY;
    },
    onDragEnd: function () {
      isSpinning = true;
    },
  });
  function getRotY(angle) {
    const min = -0.5;
    const max = 0.5;
    if (angle / 10 < min) return min;
    else if (angle / 10 > max) return max;
    else return angle / 10;
  }
  // 🔥🔥🔥🔥 Animate! 🔥🔥🔥🔥
  //space.rotate.z = 0.3;
  //space.rotate.x = -0.5;
  function animate() {
    if (!regenerate) {
      if (isSpinning) {
        space.rotate.y += isSpinning ? 0.01 : 0;
      } else {
        space.rotate.y = viewRotation.y;
      }
      space.rotate.x = getRotY(viewRotation.x);
      space.updateRenderGraph();
      requestAnimationFrame(animate);
    }
  }
  //console.log("total clouds, land: ", cloudCount, landMassCount);

  animate();
};
// ➰ ☁️ Regenerate ☁️ ➰
function regenerate_world() {
  regenerate = true;
  canvasContainer.innerHTML = `
    <canvas id="spaceCanvas" width="430" height="380"></canvas>
  `;
  space = false;
  requestAnimationFrame(() => {
    space = new Zdog.Illustration({
      element: "#spaceCanvas",
      dragRotate: true,
      rotate: { x: TAU * 0.05 },
      onDragStart: function () {
        isSpinning = false;
      },
      onDragEnd: function () {
        isSpinning = true;
      },
    });
    regenerate = false;
    generate_world(space, true);
  });
}
//
//
export default function PlanetView(props) {
  const [space, setSpace] = useState({});
  useEffect(() => {
    // 🐶 ZDOG ILLUSTRATION 🐶
    if (!space.element) {
      setSpace(
        new Zdog.Illustration({
          element: "#spaceCanvas",
          dragRotate: false,
          resize: false,
          rotate: { x: -TAU * 0.05 },
          onDragStart: function () {
            isSpinning = false;
          },
          onDragEnd: function () {
            isSpinning = true;
          },
          onResize: function (width) {
            if (space) {
              space.zoom = width / 500;
            }
          },
        })
      );
    }
    // console.log("space", space);
    if (space.element) generate_world(space, false, props.planet);
  });
  return (
    <div className="flex justify-center overflow-hidden">
      <canvas id="spaceCanvas" className="w-full" height="400"></canvas>
    </div>
  );
}
