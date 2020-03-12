import React from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { logLikSum } from "../utils";

const AnimatedCircle = ({ x, y, xScale, yScale, mu, sample }) => {
  const sigma2 = useSpring({ value: y });

  return (
    <animated.circle
      cx={sigma2.value.interpolate(x => xScale(logLikSum(sample, mu, x)))}
      cy={sigma2.value.interpolate(y => yScale(y))}
      r="5"
      className="logLikNewtonX--test"
    />
  );
};
export default AnimatedCircle;
