import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function ButtonGreen(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded  border(gray-100 2)"
    />
  );
}
