import { useEffect, useRef, useState } from "preact/hooks";

interface TaskProps {
  Task: (s: string) => void;
  name: string;
  interval: number
  start: string
}

function PeriodicTask(props: TaskProps) {
  const Task = props.Task;
  const name = props.name || "default";
  const interval = props.interval || 1000;
  const start = props.start;
  const ts =
    useRef({
      id: interval,
      running: false
    });

  const count = useRef(0);

  function startTask() {
    if (!ts.current.running) {
      const id = setInterval(myTask, interval);
      ts.current.id = id;
      ts.current.running = true
    } else
      console.log("Task already running");
  }

  function stopTask() {
    if (ts.current.running) {
      clearInterval(ts.current.id);
      ts.current.running = false;
    }
    else
      console.log("Task not running");
  }

  function myTask() {
    count.current++;
    Task("" + count.current);
  }

  useEffect(() => {
    if (start == "start")
      startTask()
    if (start == "stop")
      stopTask();
  }, [props.start]);

  useEffect(() => {
    // console.log(interval);
    if (start == "start") {
      stopTask();
      startTask()
    }
  }, [props.interval]);


  return (<></>);
}

export default PeriodicTask;
