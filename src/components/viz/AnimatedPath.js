import React from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { logLikSum } from "../utils";

const AnimatedPath = ({ data, x, sigma2, xScale, yScale, linex, mu, sample }) => {
  const [val, set] = useSpring(() =>  ({value: mu, immediate: false, delay: 0, config: {duration: 1000}} ));

  set({value: mu, delay: 0})
  const interp = (mu) => {
    const interpLine = data.map(d => ([d[0], logLikSum(sample, mu, d[0])]));
    return linex(interpLine);
  }

  return (
    <animated.path d={val.value.interpolate(mu => interp(mu))} className="animated--path" />
  );
};
export default AnimatedPath;
