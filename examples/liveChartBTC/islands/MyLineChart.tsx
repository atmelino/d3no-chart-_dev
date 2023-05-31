import { useEffect, useRef, useState } from "preact/hooks";
import MyData from "./data.tsx";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import PeriodicTask from "./PeriodicTask.tsx";
import Popup from "./Popup.tsx";
import { LineChartDynamic } from "https://raw.githubusercontent.com/atmelino/d3no-data/livechart/charts.ts"
// import { LineChartDynamic } from "../../../../../d3no-data/charts.ts";


export default function MyLineChart() {
  const updateTriggerRef = useRef(0);
  const [updateTrigger, setupdateTrigger] = useState(0);
  const timems = useRef(Date.now());
  const datasets1 = useRef(MyData());
  const yAxisAuto = useRef(true);
  const [start, setstart] = useState("start");
  const [interval, setInterval] = useState(1000);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100000);
  const [datasets, setData] = useState(datasets1.current);
  const [timestamp, settimestamp] = useState("0000-00-00 00:00:00");
  const [valueState, setValue] = useState();
  const renderCount = useRef(0);
  const intervalCount = useRef(0);
  const data1: { x: Date; y: number }[] = [];
  const Softwareversion = "2023-04-26 18:51:34"
  let value = 30000;


  const getBtcData = () => {
    fetch("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD")
      .then(response => response.json())
      .then(data => {
        value = data.USD;
        setValue(data.USD);
        if (datasets1.current[0].data.length >= 30) {
          datasets1.current[0].data.splice(0, 1);
        }
        datasets1.current[0].data.push({
          x: timems.current,
          y: value,
        });
        setData(datasets1.current);
        // printData(datasets1.current);
        // updateTriggerRef.current = updateTriggerRef.current + 1
        // setupdateTrigger(updateTriggerRef.current);
      })
      .catch(() => {
        console.log('Data failed to load from url');
      });
  }


  function addData() {
    intervalCount.current = intervalCount.current + 1;
    timems.current = Date.now();
    settimestamp(format(new Date(timems.current), "yyyy-MM-dd HH:mm:ss"));
    getBtcData();
  }

  function printData(
    ds: { label: string; color: string; data: { x: number; y: number }[] }[],
  ) {
    console.log("length=" + ds[0].data.length);

    for (const d of ds[0].data) {
      const timestamp = format(new Date(d.x), "yyyy-MM-dd HH:mm:ss");
      console.log("x= " + timestamp + " y=" + d.y);
    }
  }

  function setyAxisAutoRef(val: boolean) {
    yAxisAuto.current = val;
  }


  return (
    <>
      <PeriodicTask
        Task={addData}
        name={"live BTC"}
        interval={interval}
        start={start}
      />

      <div class="flex flex-row justify-evenly">
        <a href="https://d3nodata.deno.dev/">
          <img src="/d3no-data-logo.svg" class=" h-5" alt="d3nodata" />   </a>

        <label class="w-11/12 flex justify-center  text-lg font-medium text-gray-900 ">
          Live Bitcoin Chart
        </label>
        <Popup
          title="Settings"
          Softwareversion={Softwareversion}
          setyAxisAutoRef={setyAxisAutoRef}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
          setstart={setstart}
          setInterval={setInterval}
        />
      </div>

      <div class="flex justify-evenly">
        <label class="w-5/12 text-right">
          <b>1 BTC = {valueState} USD</b>
        </label>
        <img
          src="/Bitcoin.png"
          class="w-11/12 w-8 h-8"
          alt="BTC"
        />
        <label class="w-5/12">
          {timestamp}
        </label>
      </div>
      <div class="flex flex-row justify-evenly bg-green-50">
        <LineChartDynamic
          height={500}
          paddingTop={10}
          datasets={datasets}
          data={data1}
          yAxisMin={min}
          yAxisMax={max}
          yAxisAuto={yAxisAuto.current}
          addLabel={false}
          addLegend={false}
          addTooltip={false}
          updateTrigger={updateTrigger}
        >
        </LineChartDynamic>
      </div>
    </>
  );
}
