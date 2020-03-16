import React, { useEffect } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { logLikSum } from "../utils";

const AnimatedCircle = ({ x, funcX, y, xScale, yScale, sample, count, animating }) => {
  const [spring, set] = useSpring(() => ({ xy: [x, y], immediate: false, config: {duration: 500}}) );

  set({xy: [x, y], immediate: !animating})
/*   useEffect(() => {
    set({xy: [x, y], immediate: false})
  }, [count])

  useEffect(() => {
    set({xy: [x, y], immediate: true})
  }, [x, y, sample])
 */

  return (
    <animated.circle
      cx={spring.xy.interpolate((x,y) => xScale(funcX(x,y)))}
      cy={spring.xy.interpolate((x,y) => yScale(y))}
      r="5"
      className="logLikNewtonX--test"
    />
  );
};
export default AnimatedCircle;
