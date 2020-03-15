import React, { useEffect } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { logLikSum } from "../utils";

const AnimatedCircle = ({ x, y, xScale, yScale, mu, sample, count }) => {
  const [spring, set] = useSpring(() => ({ xy: [mu, y], immediate: false, config: {duration: 500}}) );

  useEffect(() => {
    set({xy: [mu, y], immediate: false})
  }, [count])

  useEffect(() => {
    set({xy: [mu, y], immediate: true})
  }, [y, mu, sample])


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
