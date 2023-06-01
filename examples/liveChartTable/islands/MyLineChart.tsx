import { useEffect, useRef, useState } from "preact/hooks";
import { LineChartDynamic } from "https://raw.githubusercontent.com/atmelino/d3no-data/livechart/charts.ts"
// import { LineChartDynamic } from "../../../../../../../d3no-data/charts.ts";
// import { DataTable } from "https://deno.land/x/datatable@v0.0.4-alpha/mod.ts";
import { DataTable } from "../../../../DataTable_dev/mod.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";

export default function MyLineChart() {
  const timems = useRef(Date.now());
  const datasets1 = useRef([
    {
      label: "data1",
      color: "green",
      data: [{ x: Date.now(), y: 10 }],
    },
  ]);
  const formattedData1 = useRef([{ Nr: 1, Time: format(new Date(timems.current), "yyyy-MM-dd HH:mm:ss"), y: 10 }],);
  const [datasets, setData] = useState(datasets1.current);
  const [formattedData, setformattedData] = useState(formattedData1.current);
  const updateTriggerRef = useRef(0);
  const [updateTrigger, setupdateTrigger] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(25);
  const counter = useRef(1);

  // used for example purposes
  function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function addData() {
    timems.current = Date.now();

    let value = getRandomIntInclusive(1, 25);
    if (datasets1.current[0].data.length >= 10) {
      datasets1.current[0].data.splice(0, 1);
      formattedData1.current.splice(0, 1);
    }
    datasets1.current[0].data.push({
      x: Date.now(),
      y: value,
    });

    counter.current=counter.current+1;
    formattedData1.current.push({
      Nr: counter.current,
      Time: format(new Date(timems.current), "yyyy-MM-dd HH:mm:ss"),
      y: value,
    });

    updateTriggerRef.current = updateTriggerRef.current + 1
    setupdateTrigger(updateTriggerRef.current);
  }

  useEffect(() => {
    // get new data every x seconds
    setInterval(addData, 1000);
  }, []);

  return (
    <>
      <div class="flex flex-row justify-evenly">
        <a href="https://d3nodata.deno.dev/">
          <img src="/d3no-data-logo.svg" class=" h-5" alt="d3nodata" />   </a>

        <label class="w-11/12 flex justify-center  text-lg font-medium text-gray-900 ">
          D3NO DATA Live Chart
        </label>
      </div>

      <div class="flex flex-row justify-evenly bg-green-50">
        <LineChartDynamic
          height={500}
          paddingTop={20}
          datasets={datasets}
          data={datasets[0].data}
          yAxisAuto={false}
          yAxisMin={min}
          yAxisMax={max}
          addTitle={true}
          addLegend={true}
          addLabel={true}
          addTooltip={true}
          updateTrigger={updateTrigger}
        >
        </LineChartDynamic>
        <DataTable
          dataArray={formattedData}
          rowsPerPage={5}
        />
      </div>
    </>
  );
}
