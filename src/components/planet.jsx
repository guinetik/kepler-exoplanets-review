import Zdog from "zdog";
import { useEffect } from "react";
// 🌱 CHARACTERISTICS 🌱
const planet_radius = 125;
const atmosphere_thickness = 1;
const offset_x = 0;
const offset_y = -50;

const TAU = Zdog.TAU;
let isSpinning = true;
let regenerate = false;
let space = null;

function generate_world(space, randomMass) {
  // 🌏 PLANET 🌏
  const topHempishere = new Zdog.Hemisphere({
    addTo: space,
    diameter: planet_radius * 2,
    translate: { x: offset_x, y: offset_y },
    color: "cornflowerblue", //backface: "blue",
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
    stroke: 7,
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

  //  🏔🌋⛰ LAND 🏔🌋⛰
  const interval = 90;
  const stroke = 2;
  const radShift = 0;
  const maxGrow = -1;
  const maxShrink = -3;
  let cols = [
    "rgba(170,170,255,0.5)",
    "rgba(170,170,255,0.5)",
    "rgba(170,170,255,0.5)",
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
  function buildLandMass({ sLat, sLng, stages }) {
    // 🌋 Center Land Mark
    const landKey = { "0-TR-0": stages };
    set_cordinate_mark({
      lat: sLat,
      lng: sLng,
      radius: pr * 2,
      stroke,
      altitude: stages * 0.75,
      color: cols[stages],
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
              color: cols[newAlt],
              shape: "poly",
              sides: 6,
            });
            landMassCount++;
            // 🏔⬆️ BUILD MOUNTAINS UP!
            // for (var a = 0; a < newAlt; a++) {
            //   set_cordinate_mark({ lat: lat+sLat, lng: lng+sLng, radius: pr*2+radShift, stroke: setStk,
            //   altitude: a, color: cols[newAlt], shape: "poly", sides: 6 })
            //   landMassCount++
            // }
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

  // 🔥🔥🔥🔥 Animate! 🔥🔥🔥🔥
  space.rotate.z = 0.3;
  function animate() {
    if (!regenerate) {
      space.rotate.y += isSpinning ? 0.01 : 0;
      space.updateRenderGraph();
      requestAnimationFrame(animate);
    }
  }
  console.log("total clouds, land: ", cloudCount, landMassCount);

  animate();
}

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
      onDragEnd: function() {
        isSpinning = true;
      }
    });
    regenerate = false;
    generate_world(space, true);
  });
}
//
//
export default function PlanetView() {
  useEffect(() => {
    // 🐶 ZDOG ILLUSTRATION 🐶
    if(!space) {
        space = new Zdog.Illustration({
            element: "#spaceCanvas",
            dragRotate: true,
            resize:true,
            rotate: { x: -TAU * 0.05 },
            onDragStart: function () {
              isSpinning = false;
            },
          });
          // console.log("space", space);
          generate_world(space);
    }
  });
  return (
    <div className="h-[420px]">
      <canvas id="spaceCanvas" className="w-full" height="420"></canvas>
    </div>
  );
}