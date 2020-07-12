import React, { useState, useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SampleDist from "./components/viz/SamplePlot";
import LogLikPlot from "./components/viz/LogLikPlot";
import LogLikPlotSigma from "./components/viz/LogLikPlotSigma";
import CurvaturePlot from "./components/viz/CurvaturePlot";
import ContourLogLik from "./components/viz/ContourLogLik";
import ResponsiveChart from "./components/viz/ResponsiveChart";
import Slider from "./components/navigation/SettingsSlider";
import GradientAscent from "./components/navigation/GradientAscent";
import ButtonSample from "./components/navigation/ButtonSample";
import CalcLogLik from "./components/content/CalcLogLik";
import TestTabs from "./components/content/TestTabs";
import katex from "katex";
import { format } from "d3-format";
import {
  logLikSum,
  estimatedLogLik,
  dSigma2,
  dMu,
  d2Mu
} from "./components/utils";
import { range } from "d3-array";

const useStyles = makeStyles(theme => ({
  sampleDist: {
    backgroundColor: "#fff",
    margin: 0,
    padding: 0,
    boxShadow: "none"
  },
  control: {
    padding: theme.spacing(2)
  },
  gridContainer: {
    marginBottom: "40px",
    boxShadow: "none"
  },
  textContent: {
    maxWidth: 700
  },
  paper: {
    boxShadow: "none"
  },
  stickySlider: {
    position: "sticky",
    top: 0,

    zIndex: 9999
  },
  blur: {
    backdropFilter: "blur(10px)",
    background: "#ffffffba"
  },
  logLikSum: {
    backgroundColor: "none",
    borderRadius: "5px"
  }
}));

// Generates log-lik function
const genLogLikCurve = (d, mu, sigma2, theta, muTheta, sigma2Theta) => {
  var y;
  var x;
  const sigmaTheta = Math.sqrt(sigma2Theta);
  if (theta == "mu") {
    const xStart = muTheta - 5 * sigmaTheta;
    const xEnd = muTheta + 5 * sigmaTheta;
    x = range(xStart, xEnd, Math.abs(xStart - xEnd) / 50);
    y = x.map(x => logLikSum(d, x, sigma2));
  } else if (theta == "sigma") {
    let xStart = 1;
    const xEnd = Math.sqrt(1500);
    x = range(xStart, xEnd, (xEnd - xStart) / 50);
    x = x.map(d => d * d);
    y = x.map(x => logLikSum(d, mu, x));
  }
  const tmp = [];
  for (var i = 0; i < x.length; i++) {
    tmp.push([x[i], y[i]]);
  }
  var data = {
    data: tmp,
    x: x,
    y: y
  };
  return data;
};

const MleFirst = () => {
  return (
    <Typography variant="body1" gutterBottom>
      Since we use a very simple model, there's a couple of ways to find the
      MLEs. If we repeat the above calculation for a wide range of parameter
      values, we get the plots below. The joint MLEs can be found at the top of{" "}
      <b>contour plot</b>, which shows the likelihood function for a grid of
      parameter values. We can also find the MLEs analytically by using some
      calculus. We find the top of the hill by using the <b>partial derivatives</b> with regard to μ and σ² - which is generally called the{" "}
      <b>score function (U)</b>. Solving the score equations mean that we find
      which combination of μ and σ² leads to both partial derivates being zero.
    </Typography>
  );
};


const Content = ({ openSettings, vizState, toggleDrawer }) => {
  const classes = useStyles();
  const [highlight, setHighlight] = useState();
  const theme = useTheme();
  const matchesBreak = useMediaQuery(theme.breakpoints.up("sm"));

  const {
    mu,
    muHat,
    muNull,
    muTheta,
    sigma2Theta,
    sigma2,
    sigma2Hat,
    sigma2MleNull,
    sample,
    n
  } = vizState;

  // Data sets
  const dataMu = genLogLikCurve(sample, mu, sigma2, "mu", muTheta, sigma2Theta);
  const dataSigma = genLogLikCurve(
    sample,
    mu,
    sigma2,
    "sigma",
    muTheta,
    sigma2Theta
  );
  const derivMu = dMu(10, mu, muHat, sigma2);
  const derivMuN = dMu(n, muNull, muHat, sigma2Hat);
  const derivMuNull = dMu(n, muNull, muHat, sigma2MleNull);
  const deriv2MuNull = d2Mu(n, sigma2MleNull);
  const estllThetaMLE = estimatedLogLik(n, mu, mu, sigma2Hat);
  const estllThetaNull = estimatedLogLik(n, muNull, muHat, sigma2Hat);
  const derivSigma2 = dSigma2(sample, mu, sigma2);
  const y = vizState.sample.map(y => format(".1f")(y)).join(", ");
  const f2n = format(".2n");
  const eqDeriv1 = katex.renderToString(
    `U(\\mu_0, \\hat\\sigma_0^2) = \\frac{\\partial}{\\partial \\mu_0}\\ell(\\mu_0, \\hat\\sigma_0^2) = ${f2n(
      derivMuNull
    )} `,
    {
      displayMode: true,
      throwOnError: false
    }
  );
  const eqDeriv2 = katex.renderToString(
    `I(\\mu_0, \\hat\\sigma_0^2) = \\frac{\\partial^2}{\\partial \\mu_0^2}\\ell(\\mu_0, \\hat\\sigma_0^2) = ${-f2n(
      deriv2MuNull
    )}`,
    {
      displayMode: true,
      throwOnError: false
    }
  );
  const eqModel = katex.renderToString("y \\sim \\mathcal N(\\mu, \\sigma^2)", {
    displayMode: false,
    throwOnError: false
  });
  return (
    <div>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          Likelihood Calculation
        </Typography>
        <Container className={classes.textContent}>
          <Typography variant="body1" gutterBottom>
            Before we do any calculations, we need some data. So, {"here's"} 10
            random observations from a normal distribution with unknown mean (μ)
            and variance (σ²).
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
          >{`Y = [${y}]`}</Typography>
          <Typography variant="body1" gutterBottom>
            We also need to assume a model, we're gonna go with the model
            that we know generated this data:{" "}
            <span dangerouslySetInnerHTML={{ __html: eqModel }} />. The
            challenge now is to find what combination of values for μ and σ²
            maximize the likelihood of observing this data (given our
            assumed model). Try moving the sliders around to see what happens.
          </Typography>
        </Container>
        <div className={classes.stickySlider}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.blur}
          >
            <Slider
              name="mu"
              label="Mean (μ)"
              thetaHat={vizState.muHat}
              value={vizState.mu}
              max={vizState.sliderMax}
              step={vizState.sliderStep}
              openSettings={openSettings}
              handleDrawer={toggleDrawer}
            />

            <Slider
              name="sigma2"
              label="Variance (σ²)"
              thetaHat={vizState.sigma2Hat}
              value={vizState.sigma2}
              min={1}
              max={vizState.sigma2Max}
              step={vizState.sliderStep}
              openSettings={openSettings}
              handleDrawer={toggleDrawer}
            />
          </Grid>
          <Grid
            container
            alignItems="flex-start"
            justify="flex-end"
            direction="row"
          >
            <ButtonSample
              M={vizState.muTheta}
              sigma2={vizState.sigma2Theta}
            />
          </Grid>
        </div>

        <Grid
          container
          spacing={3}
          alignItems="center"
          direction="row"
          justify="center"
          className={classes.gridContainer}
        >
          <Grid item md={6} xs={12}>
            <Paper className={classes.sampleDist}>
              <ResponsiveChart
                chart={SampleDist}
                {...vizState}
                highlight={highlight}
                setHighlight={setHighlight}
              />
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper}>
              <Grid align="bottom" className={classes.logLikSum}>
                <Typography variant="body1" gutterBottom>
                  We can calculate the joint likelihood by multiplying the
                  densities for all observations. However, often we calculate
                  the log-likelihood instead, which is
                </Typography>
                <CalcLogLik
                  sample={vizState.sample}
                  mu={vizState.mu}
                  sigma={vizState.sigma2}
                  highlight={highlight}
                  setHighlight={setHighlight}
                />
                <Typography variant="body1" gutterBottom>
                  The combination of parameter values that give the largest
                  log-likelihood is the maximum likelihood estimates (MLEs).
                </Typography>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h2" align="center" gutterBottom>
          Finding the Maximum Likelihood Estimates
        </Typography>
        <Container className={classes.textContent}>
          <MleFirst />
        </Container>

        <Grid
          container
          alignItems="flex-end"
          direction="row"
          justify="center"
          spacing={0}
        >
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography
                variant="h4"
                component="h3"
                align="center"
                style={{
                  paddingBottom: "0em",
                  paddingTop: "0.5em",
                  paddingLeft: "0em"
                }}
              >
                Mean
              </Typography>
              <ResponsiveChart
                chart={LogLikPlot}
                {...vizState}
                data={dataMu}
                theta={mu}
                thetaLab="mu"
                deriv={derivMu}
              />
              <ResponsiveChart
                chart={ContourLogLik}
                {...vizState}
                data={dataSigma}
                theta={sigma2}
                thetaLab="sigma"
                deriv={derivSigma2}
              />
              <Typography align="right" variant="caption" component="p">Tip: You can move the values around by dragging them.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
             <GradientAscent {...vizState} />
              <Typography
                variant="h4"
                component="h3"
                align="left"
                style={{
                  paddingBottom: "0.5em",
                  paddingTop: "1em",
                  paddingLeft: "3em"
                }}
              >
                Variance
              </Typography>
              <ResponsiveChart
                chart={LogLikPlotSigma}
                {...vizState}
                data={dataSigma}
                theta={sigma2}
                thetaLab="sigma"
                deriv={derivSigma2}
              />
            </Paper>
          </Grid>
        </Grid>

        <Typography
          variant="h2"
          align="center"
          gutterBottom
          style={{ paddingTop: "1em" }}
        >
          Inference
        </Typography>
        <Container className={classes.textContent}>
          <Typography gutterBottom>
            After {"we've"} found the MLEs we usually want to make some
            inferences, so {"let's"} focus on three common hypothesis tests. Use
            the sliders below to change the null hypothesis and the sample size.
          </Typography>
        </Container>
      </Container>
      <Container maxWidth="lg">
        <Grid container direction="row" justify="center" spacing={3}>
          <Grid item md={6} xs={12}>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              Illustration
            </Typography>
            <Slider
              name="n"
              label="Sample Size (n)"
              value={vizState.n}
              max={100}
              step={1}
              openSettings={openSettings}
              handleDrawer={toggleDrawer}
            />
            <Slider
              name="muNull"
              label="Null (μ0)"
              value={vizState.muNull}
              min={70}
              max={160}
              step={1}
              openSettings={openSettings}
              handleDrawer={toggleDrawer}
            />

            <div>
              <p>The score function evaluated at the null is, </p>
              <p dangerouslySetInnerHTML={{ __html: eqDeriv1 }} />
              <Typography variant="body1">
                The observed <b>Fisher information</b> is the negative of the
                second derivative. This is related to the curvature of the
                likelihood function -- try increasing the sample size and note
                that the peak gets narrower around the MLE and that the{" "}
                <em>information</em> increases. The inverse of I is also the
                variance of the MLE.
              </Typography>
              <p dangerouslySetInnerHTML={{ __html: eqDeriv2 }} />
            </div>
            <Paper className={classes.paper}>
              <ResponsiveChart
                chart={CurvaturePlot}
                {...vizState}
                theta={mu}
                thetaLab="mu"
                llThetaMLE={estllThetaMLE}
                llThetaNull={estllThetaNull}
                deriv={derivMuN}
              />
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              Hypothesis Tests
            </Typography>
            <TestTabs
              muNull={muNull}
              muHat={muHat}
              sigma2={sigma2Hat}
              sigma2Null={sigma2MleNull}
              derivMuNull={derivMuNull}
              deriv2MuNull={deriv2MuNull}
              n={n}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default Content;
