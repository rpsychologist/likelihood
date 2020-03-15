import React, { useEffect } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { logLikSum } from "../utils";

const AnimatedPath = ({ data, x, sigma2, xScale, yScale, linex, mu, sample, count }) => {
  const [val, set] = useSpring(() =>  ({value: mu, immediate: false, delay: 0, config: {duration: 500}} ));

  useEffect(() => {
    set({value: mu, delay: 0, immediate: false})
  }, [count])

  useEffect(() => {
    set({value: mu, delay: 0, immediate: true}, [sample, mu])
  }, [sample, mu])

  const interp = (mu) => {
    const interpLine = data.map(d => ([d[0], logLikSum(sample, mu, d[0])]));
    return linex(interpLine);
  }

  return (
    <animated.path d={val.value.interpolate(mu => interp(mu))} className="animated--path" />
  );
};
export default AnimatedPath;
