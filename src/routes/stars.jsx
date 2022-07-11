import { Link } from "react-router-dom";
import AppData from "../data/app.data";
import { BiPlanet } from "react-icons/bi";
import { IoMdRocket } from "react-icons/io";
import { MdOutlineClass } from "react-icons/md";
import { useState } from "react";
import { Button } from "flowbite-react";
export default function StarsPage() {
  //https://api.nasa.gov/assets/img/general/apod.jpg
  /* todo: add infinite scrolling here */
  const itemsPerPage = 300;
  //const [count, setCount] = useState(0);
  const [stars, setStars] = useState(AppData.stars.slice(0, itemsPerPage));
  //
  const getData = () => {};
  //
  const handleScroll = (e) => {
    let scrollTop = e.target.documentElement.scrollTop;
    let windowHeight = window.innerHeight;
    let scrollHeight = e.target.documentElement.scrollHeight;
    if (windowHeight + scrollTop + 1 >= scrollHeight) {
      getData();
    }
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
  //
  return (
    <main className="w-full flex justify-center items-center">
      <section className="m-auto mt-14">
        <h1
          className="text-white glow lettering uppercase font-light px-2 mb-8 mt-8 text-center w-full 
        text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl"
        >
          DISCOVER THE STARS
        </h1>
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-wrap">
            {stars.map((s, index) => {
              return (
                <div
                  className="p-4 w-full md:w-1/2 xl:w-1/3"
                  key={s.displayName}
                >
                  <StarCard star={s} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
const StarCard = (props) => {
  return (
    <div className="min-w-[285px] flex flex-col h-full w-full rounded-lg overflow-hidden bg-gradient-to-b p-0.5 from-orange-500 to-purple-500">
      <img
        className="lg:h-48 md:h-36 w-full object-cover object-center rounded-tl-lg rounded-tr-lg"
        src={AppData.getStellarImage(props.star.starType)}
        alt="blog"
      />
      <div className="p-6 bg-black rounded-bl-lg rounded-br-lg flex-auto ">
        <h1 className="text-slate-100 lettering font-extralight text-2xl md:text-3xl lg:text-4xl">
          {props.star.displayName}
        </h1>
        <h3 className="tracking-widest font-medium text-sky-500 mb-1 text-lg md:text-xl">
          Constellation: {props.star.constellation}
        </h3>
        <h2 className="leading-relaxed mb-4 text-slate-400 italic text-lg md:text-xl lg:text-2xl">
          {props.star.planets.length > 1
            ? `${props.star.planets.length} planets orbit`
            : `${props.star.planets.length} planet orbits`}{" "}
          a {props.star.starType}-type star,{" "}
          <span className="text-yellow-400">
            {props.star.distanceFromEarth}
          </span>{" "}
          from Earth.
        </h2>
        <div className="flex items-center justify-between">
          <Button
            href={"/exoplanets-review/#/stars/" + props.star.id}
            outline={true}
            gradientDuoTone="cyanToBlue"
            size="lg"
          >
            <IoMdRocket className="text-xl group-hover:animate-bounce_y transition-all" />
            <span className="sm:text-md md:text-md lg:text-lg">Visit Star</span>
          </Button>
          <div>
            <span
              title={"Star Type: " + props.star.starType}
              className="text-purple-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200"
            >
              <MdOutlineClass className="text-xl"></MdOutlineClass>
              <aside className="ml-2">{props.star.starType}</aside>
            </span>
            <span
              title="Planets"
              className="text-green-400 inline-flex items-center leading-none text-sm"
              alt="Planets"
            >
              <BiPlanet className="text-xl"></BiPlanet>
              <aside className="ml-2">{props.star.planets.length || 0}</aside>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
