import PlanetView from "../components/planet";
import AppData from "../data/app.data";
import { Table } from "flowbite-react";
import { Button } from "flowbite-react";
import { IoMdRocket } from "react-icons/io";
import ReviewsComponent from "../components/reviews";

export default function PlanetPage() {
  return (
    <main>
      <section>
        <div className="px-5 py-4 mx-auto">
          <h1 className="text-white glow lettering uppercase text-4xl font-light z-10 block ml-2 mb-2">
            Planet Name
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              className="w-full
              min-h-[420px]
              rounded-lg bg-gradient-to-t p-[1px] from-green-300 to-orange-500"
            >
              <div className="bg-black rounded-lg w-full h-full p-[1px]">
                <PlanetView />
                <div className="flex justify-center w-full p-5">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      className="w-full"
                      outline={true}
                      gradientDuoTone="cyanToBlue"
                      size="lg"
                    >
                      <IoMdRocket className="text-xl ml-2 group-hover:animate-bounce_y transition-all"></IoMdRocket>
                      <span className="w-[192px]">Write a Review</span>
                    </Button>
                    <Button
                      outline={true}
                      gradientDuoTone="purpleToPink"
                      size="lg"
                    >
                      <IoMdRocket className="text-xl ml-2 group-hover:animate-bounce_y transition-all"></IoMdRocket>
                      Open on ExoplanetArchive
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="w-full
            rounded-lg bg-gradient-to-t p-[1px] from-green-300 to-orange-500"
            >
              <div className="bg-black rounded-lg w-full h-full p-[1px]">
                <PlanetTable planet={AppData.planet} />
              </div>
            </div>
            <div
              className="w-full h-full
            md:col-span-2
            lg:col-span-1
            xl:col-span-2
            rounded-lg bg-gradient-to-tr p-[1px] from-cyan-300 to-fuchsia-500"
            >
              <div className="bg-black rounded-lg w-full h-full p-[1px]">
                <ReviewsComponent />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const PlanetTable = (props) => {
  const tableRow = props.planet.data.map((p) => {
    return (
      <Table.Row key={p.name}>
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {p.name}
        </Table.Cell>
        <Table.Cell className="text-xs">{p.value}</Table.Cell>
      </Table.Row>
    );
  });
  return (
    <Table className="h-full bg-black">
      <Table.Head>
        <Table.HeadCell>Planet Property</Table.HeadCell>
        <Table.HeadCell>Value</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">{tableRow}</Table.Body>
    </Table>
  );
};
