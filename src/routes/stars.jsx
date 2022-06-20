import { Link } from "react-router-dom";
import AppStates from "../data/app.states";
import { BiPlanet } from "react-icons/bi";
import { IoMdRocket } from "react-icons/io";
import { MdOutlineClass } from "react-icons/md";

export default function StarsPage() {
  let starCards = AppStates.stars.map((s) => {
    return (
      <div className="p-4 md:w-1/3 ">
        <StarCard star={s} />
      </div>
    );
  });
  console.log("starCards", starCards);
  return (
    <main>
      <section className="text-gray-600 body-font mx-10 mt-2">
        <p className="text-white mt-4 mx-2 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </p>
        <div className="container">
          <div className="flex flex-wrap -m-4">{starCards}</div>
        </div>
      </section>
    </main>
  );
}
const StarCard = (props) => {
  return (
    <div
      className="h-full rounded-lg overflow-hidden bg-gradient-to-b p-[1px] from-orange-500 to-purple-500"
      key={props.id}
    >
      <img
        className="lg:h-48 md:h-36 w-full object-cover object-center rounded-tl-lg rounded-tr-lg"
        src="https://api.nasa.gov/assets/img/general/apod.jpg"
        alt="blog"
      />
      <div className="p-6 bg-black rounded-bl-lg rounded-br-lg">
        <h1 className="text-lg text-slate-400 lettering font-bold">
          {props.star.name}
        </h1>
        <h2 className="tracking-widest text-xs title-font font-medium text-yellow-300 mb-1 italic">
          {AppStates.getStarProp(props.star, "distance")} away from our Sun
        </h2>
        <p className="leading-relaxed mb-3 text-sm text-gray-500">
          {props.star.description}
        </p>
        <div className="flex items-center flex-wrap ">
          <Link
            className="group text-sky-400 inline-flex items-center md:mb-2 lg:mb-0 transition-all hover:text-white active:text-white"
            to={"/stars/" + props.star.id}
          >
            Visit Star
            <IoMdRocket className="text-xl ml-2 group-hover:animate-bounce_y transition-all"></IoMdRocket>
          </Link>
          <span
            title={AppStates.getStarLabel(props.star, "type")}
            className="text-purple-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200"
          >
            <MdOutlineClass className="text-xl"></MdOutlineClass>
            <aside className="ml-2">
              {AppStates.getStarProp(props.star, "type")}
            </aside>
          </span>
          <span
            title={AppStates.getStarLabel(props.star, "planets")}
            className="text-green-400 inline-flex items-center leading-none text-sm"
            alt="Planets"
          >
            <BiPlanet className="text-xl"></BiPlanet>
            <aside className="ml-2">
              {AppStates.getStarProp(props.star, "planets")}
            </aside>
          </span>
        </div>
      </div>
    </div>
  );
};
