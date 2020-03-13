import React, { useEffect } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { logLikSum } from "../utils";

const AnimatedCircle = ({ x, y, xScale, yScale, mu, sample }) => {
  const [spring, set] = useSpring(() => ({ xy: [mu, y], immediate: false, config: {duration: 1000}}) );

  set({xy: [mu, y]})

  return (
    <animated.circle
      cx={spring.xy.interpolate((x,y) => xScale(logLikSum(sample, x, y)))}
      cy={spring.xy.interpolate((x,y) => yScale(y))}
      r="5"
      className="logLikNewtonX--test"
    />
  );
};
export default AnimatedCircle;
