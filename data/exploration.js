/**
 * This is a Jupyter notebook-like data exploration with the stars and planet data from NASA.
 * The JSON files were generated from https://exoplanets.nasa.gov/eyes-on-exoplanets/.
 * I just ran some console commands until I got them 4HEAD.
 * Turns out the NASA API is pretty fragmented and the awesome devs behind that project did a very good job on cleaning it up.
 * However, this data is too much for the scope of the project since I'm only targeting the TESS discovries for now.
 * So I'm going to filter out the the stars that are not in the TESS list.
 * I got the TESS CSV from: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS&constraint=default_flag=1&constraint=disc_facility+like+%27%25TESS%25%27
 */
"use strict";
import fs from "fs";
import CSVToJSON from "csvtojson";
import fetch from "node-fetch";
//
/**
 * Loads CSV from Confirmed TESS Exoplanets into JSON.
 * Replaces spaces with underscores.
 * After that, load eyes-on-exoplanets data.
 */
CSVToJSON()
  .fromFile("raw/tess-planets.csv")
  .then((tessPlanets) => {
    console.log(
      "TESS Planets Loaded: ",
      tessPlanets.slice(0, 1),
      "...",
      tessPlanets.length,
      "TOTAL"
    );
    // reduce tessPlanets to just the names replacing spaces with underscores
    Utils.TESS_PLANET_NAMES = tessPlanets.map((planet) =>
      planet["Planet Name"].replaceAll(" ", "_")
    );
    Utils.TESS_STAR_NAMES = tessPlanets.map((planet) =>
      planet["Host Name"].replaceAll(" ", "_")
    );
    console.log("Planets Names Sanitized");
    console.table(Utils.TESS_PLANET_NAMES.slice(0, 10));
    console.log("Stars Names Sanitized");
    console.table(Utils.TESS_STAR_NAMES.slice(0, 10));
    loadAndProcessStuff();
  })
  .catch((err) => {
    console.log(err);
  });
//
/**
 * This function searches the NASA Exoplanet API for the given star,
 * fetches all planets from that star and merges the data with the default planet data.
 * Then, the resulting json is saved to
 * @param {[]} stars - the array of stars to search for planets
 * @param {[]} planets - the base exoplanet json from exoplanetarchive
 */
const fetchExoplanetContentFromApi = (stars, planets) => {
  console.log("Reading Exoplanet API data.", stars.length, "Stars to process");
  const BASE_URL =
    "https://exoplanets.nasa.gov/api/v1/planets/?condition_1={key}:pl_hostname";
  /**
   * Exports exoplanet content to JSON
   * @param {[]} planets - the merged exoplanet data + content from the API
   */
  const exportPlanets = (planets) => {
    console.log("Exporting planets to file...", planets.length);
    fs.writeFileSync("out/exoplanets.json", JSON.stringify(planets, null, 2));
  };
  // sometimes the API is finicky so I'm putting a control here to limit the number of processed stars during testing
  const planetz = [];
  const processAallStars = true;
  const totalStarsToProcess = processAallStars ? stars.length : 10;
  let starsProcessed = 0;
  // loop through the stars and fetch the exoplanet data
  stars.slice(0, totalStarsToProcess).forEach(async (star) => {
    console.log("Downloading data for:", star.key);
    console.log("fetching data from:", BASE_URL.replaceAll("{key}", star.key));
    fetch(BASE_URL.replace("{key}", star.key))
      .then((res) => {
        if (res.ok) return res.json();
        else return res.status();
      })
      .then((res) => {
        const hasData = res && res.total && res.total > 0;
        // logging response
        console.log(
          "Got Response for Key:",
          star.key,
          "- Has Data:",
          hasData,
          hasData ? "- Total:" : "- Status:",
          hasData ? res.total : res
        );
        // if there is data, merge it with the eyes-on-exoplanets data and push it to the return array
        if (hasData) {
          res.items.forEach((planet) => {
            // find a TESS planet with the same name as the EXO planet
            const tessPlanet =
              planets[
                Object.keys(planets).find((key) => {
                  return key === planet.exo_id;
                })
              ];
            console.log("processing", tessPlanet.id);
            planetz.push({ ...planet, ...tessPlanet });
          });
        } else {
          console.log("No Records found for", star.key, res);
        }
        console.log("Exoplanet Content", planetz.length, res.total);
        // increment the processed stars
        starsProcessed++;
        // if all stars have been processed, export the data
        if (starsProcessed === totalStarsToProcess) {
          exportPlanets(planetz);
        }
      });
  });
};
//
/**
 * Loads and processes the eyes-on-exoplanets' data.
 * Filter only stars and planets confirmed by TESS.
 * Then, fetch the exoplanet content (images/descriptions) from the NASA Exoplanets API.
 */
const loadAndProcessStuff = () => {
  let raw = null;
  // read stars
  raw = fs.readFileSync("raw/stars.json");
  let stars = JSON.parse(raw);
  console.log("stars", Object.keys(stars).length);
  // read planets
  raw = fs.readFileSync("raw/planets.json");
  let planets = JSON.parse(raw);
  console.log("planets", Object.keys(planets).length);
  // star filters
  stars = Object.keys(stars)
    .filter((key) => stars[key].planet_count > 1) // stars with confirmed planets
    .filter((key) => !key.includes("+")) // filter out stars that have + sign doesnt work with the API
    // reduce the key list back to an object
    .reduce((cur, key) => {
      return Object.assign(cur, { [key]: stars[key] });
    }, {});
  console.log("filtered", Object.keys(stars).length);
  //
  console.group("Calculating distance from Earth...");
  // let's populate a property with a distance that we can export out later
  Utils.populateDistancesFromEarth(stars);
  // showing only top 10 distances
  const top = 10;
  let c = 0;
  Object.keys(stars).forEach((key) => {
    const distance = stars[key].distanceFromEarth;
    if (c < top) console.log(`${key} is ${distance} away from Earth.`);
    c++;
  });
  console.groupEnd();
  //
  // filtering out stars that are not in the TESS list
  const tessStars = Object.keys(stars)
    .filter((key) => Utils.TESS_STAR_NAMES.includes(key))
    .reduce((cur, key) => {
      stars[key].key = key;
      cur.push(stars[key]);
      return cur;
    }, []);
  //
  // filtering out planets that are not in the TESS list
  const tessPlanets = Object.keys(planets)
    .filter((key) => Utils.TESS_PLANET_NAMES.includes(key))
    .reduce((cur, key) => {
      planets[key].key = key;
      cur.push(planets[key]);
      return cur;
    }, []);
  //
  console.log("TESS Stars found in JSON data:", tessStars.length);
  console.log("TESS Planets found in JSON data:", tessPlanets.length);
  console.log(
    "JSON Planet data matches TESS CSV data: ",
    tessPlanets.length === Utils.TESS_PLANET_NAMES.length
  );
  //
  console.log("saving tess planets to file");
  fs.writeFileSync(
    "out/tess-planets.json",
    JSON.stringify(tessPlanets, null, 2)
  );
  console.log("saving tess stars to file");
  fs.writeFileSync("out/tess-stars.json", JSON.stringify(tessStars, null, 2));
  // fetch planet content from NASA API
  fetchExoplanetContentFromApi(tessStars, planets);
};

const Utils = {
  /**
   * @typedef Position
   * @type {object}
   * @property {number} _x - an ID.
   * @property {number} _y - your name.
   * @property {number} _z - your age.
   */
  EARTH_OCCUSION_RADIUS: 6378.1,
  APPENDIX: "",
  BI: " billion mi",
  MI: " million mi",
  TH: " thousand mi",
  mm: " mi",
  /**
   * Uses the Star's position to calculate the distance from the Earth based on Earth's radius.
   * @param {Object} star - the star to calculate the distance from.
   * @returns Formated distance from Earth in miles.
   */
  getDistanceFromEarth: (star) =>
    Utils.convertToDistanceString(
      Utils.calculateRawDistance(star.positionJ2000) -
        Utils.EARTH_OCCUSION_RADIUS
    ),
  /**
   * Utility function to populate a distanceFromEarth property on each star.
   * @param {Array} stars - the array of stars
   */
  populateDistancesFromEarth: (stars) => {
    Object.keys(stars).forEach((key) => {
      stars[key].distanceFromEarth = Utils.getDistanceFromEarth(stars[key]);
    });
  },
  /**
   * Calculates the distance between two points in 3D space by using the Law of Cosines.
   * @param {Position} t - the position of the star
   * @returns
   */
  calculateRawDistance: function (t) {
    return !t || t.length < 3
      ? -1
      : Math.sqrt(t._x * t._x + t._y * t._y + t._z * t._z);
  },
  /**
   * Utility function to convert a distance from exponential notation to miles.
   * @param {number} t - the distance of the star from the Earth
   * @returns {string} - the distance in miles
   */
  convertToDistanceString: function (t) {
    // black magic with exponential notation
    return t < 0
      ? "Unknown"
      : (t > 9461e9
          ? (t = Math.round(t / 9461e9) + Utils.APPENDIX)
          : t > 1e9
          ? (t = Math.round((0.6213712 * t) / 1e9) + Utils.BI)
          : t > 1e6
          ? (t = Math.round((0.6213712 * t) / 1e6) + Utils.MI)
          : t > 1e3
          ? (t = Math.round((0.6213712 * t) / 1e3) + Utils.TH)
          : t > 0 && (t = Math.round(0.6213712 * t * 10) / 10 + Utils.M),
        t);
  },
  /**
   * Squares a Position object by just multiplying each member by themselves.
   * @param {Position} position - An object with (_x, _y, _z) fields representing a star position in Space
   * @returns
   */
  magnitudeSqr(position) {
    return (
      position._x * position._x +
      position._y * position._y +
      position._z * position._z
    );
  },
  /**
   * Calculates the magnitude of the star, or the level of brightness we can infer based from the star position
   * @param {Position} position - An object with (_x, _y, _z) fields representing a star position in Space
   * @returns The level of brightness of the star, objects with a negative magnitude being brighter than those with a positive magnitude. The more negative the value, the brighter the object.
   */
  magnitude(position) {
    return Math.sqrt(this.magnitudeSqr(position));
  },
};
