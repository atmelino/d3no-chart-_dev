import { useRef, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, tw } from "twind";
import { animation, css } from "twind/css";
import IconSettings from "../components/IconSettings.tsx";
import { Button } from "../components/Button.tsx";

interface PopupProps {
  title: string;
  Softwareversion: string;
  setyAxisAutoRef: (b: boolean) => void;
  min: number;
  setMin: (n: number) => void;
  max: number;
  setMax: (n: number) => void;
  setstart: (s: string) => void;
  setInterval: (n: number) => void;
}

// Lazy load a <dialog> polyfill.
// @ts-expect-error HTMLDialogElement is not just a type!
if (IS_BROWSER && window.HTMLDialogElement === "undefined") {
  await import(
    "https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.esm.js"
  );
}

declare global {
  interface HTMLDialogElement {
    showModal(): void;
    close(): void;
  }
}

const slideRight = animation("0.4s ease normal", {
  from: { transform: "translateX(100%)" },
  to: { transform: "translateX(0)" },
});

const slideBottom = animation("0.4s ease normal", {
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
});

const backdrop = css({
  "&::backdrop": {
    background: "rgba(0, 0, 0, 0.5)",
  },
});

export default function Popup(props: PopupProps) {
  const title = props.title;
  const Softwareversion = props.Softwareversion;
  const setyAxisAutoRef = props.setyAxisAutoRef;
  const min = props.min;
  const setMin = props.setMin;
  const max = props.max;
  const setMax = props.setMax;
  const setstart = props.setstart;
  const setInterval = props.setInterval;

  const ref = useRef<HTMLDialogElement | null>(null);

  const onDialogClick = (e: MouseEvent) => {
    if ((e.target as HTMLDialogElement).tagName === "DIALOG") {
      ref.current!.close();
    }
  };

  return (
    <>
      <button
        onClick={() => ref.current!.showModal()}
        class="border-2 border-gray-800 rounded-full px-5 py-1 font-semibold text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300"
      >
        <IconSettings size={20} />
      </button>
      <dialog
        ref={ref}
        class={tw`bg-transparent p-0 m-0 pt-[50%] sm:pt-0 sm:ml-auto max-w-full sm:max-w-lg w-full max-h-full h-full ${slideBottom} sm:${slideRight} ${backdrop}`}
        onClick={onDialogClick}
      >
        <PopupInner
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
      </dialog>
    </>
  );
}

function PopupInner(props: PopupProps) {
  const title = props.title;
  const Softwareversion = props.Softwareversion;
  const setyAxisAutoRef = props.setyAxisAutoRef;
  const min = props.min;
  const setMin = props.setMin;
  const max = props.max;
  const setMax = props.setMax;
  const setstart = props.setstart;
  const setInterval = props.setInterval;

  const [disabled, setDisabled] = useState(" text-gray-300");
  const minRef = useRef<HTMLInputElement | null>(null);
  const maxRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<HTMLInputElement | null>(null);

  const corners = "rounded(tl-2xl tr-2xl sm:(tr-none bl-2xl))";
  const card = `py-8 px-6 h-full bg-white ${corners} flex flex-col justify-between`;

  // let yAxisAuto=true;
  const yAxisAuto = useRef(true);

  const handleChange = () => {
    yAxisAuto.current = !yAxisAuto.current;
    setyAxisAutoRef(yAxisAuto.current);
    // setDisabled(yAxisAuto.current ? "text-black" : " text-gray-300");
  };

  function clickSet() {
    if (minRef?.current?.value)
      setMin(+minRef?.current?.value);
    if (maxRef?.current?.value)
      setMax(+maxRef?.current?.value);
  }

  const handleChangeInterval = () => {
    console.log("handleChange called")
    if (intervalRef?.current?.value)
      setInterval((+intervalRef?.current?.value) * 1000);

  };

  return (
    <div class={card}>
      <div class="flex justify-between">
        <h2 class="text-lg font-medium text-gray-900">{title}</h2>
        <button
          class="py-1"
          onClick={(e) => {
            (e.target as HTMLButtonElement).closest("dialog")!.close();
          }}
        >
          <svg
            class="w-6 h-6 fill-current text-gray-600"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <div class="flex-grow-1 my-4 space-y-4">

        <fieldset class="border border-solid border-gray-300 p-2 rounded space-x-3"
          disabled={yAxisAuto.current}
        >
          <legend class="text-sm space-x-3">
            y-Axis Scale<label>   </label>
            {/* <input type="checkbox" checked={yAxisAuto.current} onChange={handleChange} /> */}
            <input type="checkbox" onChange={handleChange} />
            <label class={disabled}>manual</label>
          </legend>
          <div class={yAxisAuto.current ? " text-gray-300" : "text-black"} disabled={yAxisAuto.current}>
            <label>  Min  </label>
            <input
              class={"w-1/6 border-1 border-gray-500 h-8 rounded p-2"}
              disabled={yAxisAuto.current}
              type="number"
              id="min"
              min="0" max="100000"
              ref={minRef}
            />
            <label>   Max  </label>
            <input
              class="w-1/6 border-1 border-gray-500 h-8 rounded p-2"
              disabled={yAxisAuto.current}
              type="number"
              id="max"
              min="0" max="100000"
              ref={maxRef}
            />
            <label>     </label>
            <Button
              class={yAxisAuto.current ? "text-gray-300" : "text-black"} disabled={yAxisAuto.current}
              onClick={clickSet}
            >Set
            </Button>
          </div>
        </fieldset>

        <div class="space-x-3">
          <label>Live Data:</label>
          <Button onClick={() => {
            console.log("start pressed");
            setstart("start");
          }}>Start</Button>
          <Button onClick={() => {
            setstart("stop");
          }}>Stop</Button>
        </div>

        <div class="space-x-3">
          <label>Update Interval:</label>
          <input
            class={"w-1/6 border-1 border-gray-500 h-8 rounded p-2"}
            type="number"
            id="interval"
            min="1" max="60"
            ref={intervalRef}
            onChange={handleChangeInterval}
          />
          <label>seconds</label>
        </div>

        <div class="space-x-3">
          <label>Software Version:   </label>
          {Softwareversion}
        </div>


      </div>
    </div>
  );
}
