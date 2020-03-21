import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { VizDispatch } from "../../App";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ReplayIcon from "@material-ui/icons/Replay";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import { useSpring, animated, interpolate } from "react-spring";
import katex from "katex";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 0,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const Controls = ({
  algo,
  converged,
  count,
  sample,
  mu,
  muHat,
  sigma2,
  sigma2Hat,
  toggle
}) => {
  const dispatch = useContext(VizDispatch);

  const iterate = () => {
    dispatch({
      name: "algoIterate",
      value: {
        increment: 1
      }
    });
  };
  const decrement = () => {
    dispatch({
      name: "algoReverse",
      value: {}
    });
  };

  return (
    <>
      <Tooltip title={converged ? "" : "Run until convergence"}>
        <IconButton
          onClick={() =>
            dispatch({
              name: "algoRun",
              value: { delay: 1000 }
            })
          }
          aria-label="run gradient ascent"
          disabled={converged}
        >
          <PlayCircleFilledIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={converged ? "" : "1 iteration"}>
        <IconButton
          onClick={() => iterate()}
          aria-label="iterate 1 gradient ascent"
          disabled={converged}
        >
          +1
        </IconButton>
      </Tooltip>
      <Tooltip title={count == 0 ? "" : "-1 iteration"}>
        <IconButton
          onClick={() => decrement()}
          aria-label="iterate 1 gradient ascent"
          disabled={count == 0}
        >
          -1
        </IconButton>
      </Tooltip>
      {/*       {algo == "gradientAscent" && (
        <Tooltip title={converged ? "" : "10 iterations"}>
          <IconButton
            onClick={() =>
              dispatch({
                name: "algoIterate",
                value: { increment: 10 }
              })
            }
            aria-label="iterate 10 gradient ascent"
            disabled={converged}
          >
            +10
          </IconButton>
        </Tooltip>
      )} */}
      <Tooltip title={!converged ? "" : "Reset"}>
        <IconButton
          onClick={() =>
            dispatch({
              name: "algoReset",
              value: null
            })
          }
          aria-label="reset gradient ascent"
          disabled={!converged}
        >
          <ReplayIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

const GradientAscent = props => {
  const dispatch = useContext(VizDispatch);
  const { algo, count, converged } = props;
  const classes = useStyles();
  const handleChange = event => {
    dispatch({ name: "algo", value: event.target.value });
  };
  const [expanded, setExpanded] = useState(false);

  console.log(expanded);
  const handleChange2 = () => {
    setExpanded(val => !val);
  };
  const eqGrad = katex.renderToString(
    `
    \\begin{aligned}
    \\mu_{n+1} &= \\mu_n + \\gamma \\frac{\\partial}{\\partial \\mu_n}\\ell \\\\
    \\sigma^2_{n+1} &= \\sigma^2_n + \\gamma \\frac{\\partial}{\\partial \\sigma^2_n}\\ell 
    \\end{aligned}
    `,
    {
      displayMode: true,
      throwOnError: false
    }
  );
  const eqNewton = katex.renderToString(
    `
    \\begin{aligned}
    \\mu_{n+1} &= \\mu_n + \\gamma \\small \\frac{\\partial^2}{\\partial \\mu_n^2}\\ell^{-1} \\frac{\\partial}{\\partial \\mu_n}\\ell \\\\
    \\sigma^2_{n+1} &= \\sigma^2_n + \\small \\frac{\\partial^2}{\\partial (\\sigma_n^2)^2}\\ell^{-1}\\gamma \\frac{\\partial}{\\partial \\sigma^2_n}\\ell 
    \\end{aligned}
    `,
    {
      displayMode: true,
      throwOnError: false
    }
  );
  return (
    <div>
      <Typography variant="body1">
        For more challenging models, we often need to use some{" "}
        <b>optimization algorithm</b>. Basically, we let the computer
        iteratively climb towards the top of the hill. The simplest algorithm is
        probably{" "}
        <a href="https://en.wikipedia.org/wiki/Gradient_descent">
          gradient ascent
        </a>{" "}
        (or descent if we look for the minima). You can use the controls below
        to see how a gradient ascent algorithm finds it's way to the maximum
        likelihood estimate.
      </Typography>
      {props.algo != "none" && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper>
            <Typography className={classes.heading}>{props.algo}</Typography>

            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
              <p dangerouslySetInnerHTML={{ __html: eqGrad }}></p>
              <p dangerouslySetInnerHTML={{ __html: eqNewton }}></p>
            </Typography>
          </Paper>
        </Collapse>
      )}

      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-end"
      >
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label">
            Algorithm
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={algo}
            onChange={handleChange}
          >
            <MenuItem value="none">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"gradientAscent"}>Gradient ascent</MenuItem>
            <MenuItem value={"newtonRaphson"}>Newton-Raphson</MenuItem>
          </Select>
        </FormControl>
        {algo != "none" && (
          <>
            <Controls {...props} toggle={handleChange2} />
            <Tooltip title={"More information"}>
              <IconButton onClick={handleChange2} aria-label="more-information">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Grid>
      {algo != "none" && (
        <Typography component="p" variant="body2">
          Iterations: {count} {converged && "(converged)"}
        </Typography>
      )}
    </div>
  );
};

export default GradientAscent;
