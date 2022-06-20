import { Table } from "flowbite-react";
import SolarSystem from "../components/solarsystem";
import AppStates from "../data/app.states";
export default function Star() {
  return (
    <main>
      <section>
        <div className="px-5 py-4 mx-auto">
          <h1 className="text-white glow lettering uppercase text-4xl font-light z-10 block ml-2 mb-2">
            {AppStates.star.name}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div className="w-full
              lg:col-span-2
              xl:col-span-3
              min-h-[420px] 
              rounded-lg bg-gradient-to-tr p-[1px] from-cyan-300 to-fuchsia-500">
              <SolarSystem
                planets={AppStates.solarSystem}
                star={AppStates.star}
              />
            </div>
            <div className="w-full rounded-lg bg-gradient-to-tr p-[1px] from-cyan-300 to-fuchsia-500">
              <StarTable star={AppStates.star} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const StarTable = (props) => {
  const tableRow = props.star.data.map((p) => {
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
        <Table.HeadCell>Stelar Property</Table.HeadCell>
        <Table.HeadCell>Value</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">{tableRow}</Table.Body>
    </Table>
  );
};
