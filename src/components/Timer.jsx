import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";

function MyTimer({ expiryTimestamp }) {
  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
    });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div className="timer">
      <div style={{ fontSize: "100px" }}>
        <p className="timerbody">
          Expires in <span>{minutes}</span>:<span>{seconds}</span>
        </p>
      </div>
    </div>
  );
}

export default function Timer() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300); // 5 minutes timer
  return (
    <div>
      <MyTimer expiryTimestamp={time} />
    </div>
  );
}
