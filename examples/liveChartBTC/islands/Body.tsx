import { useRef, useState } from "preact/hooks";
import PeriodicTask from "./PeriodicTask.tsx";
import MyLineChart from "../islands/MyLineChart.tsx";

export default function Body() {

  return (
    <div class="flex flex-col w-full pt-1">
      <MyLineChart></MyLineChart>
    </div>
  );
}
