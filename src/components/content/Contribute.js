import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const CoffeButton = withStyles(() => ({
  root: {
    textTransform: "none",
    fontWeight: "700",
    color: "white",
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "rgb(255, 129, 63)"
    }
  }
}))(Button);

const PayPalButton = withStyles(() => ({
  root: {
    textTransform: "none",
    fontWeight: "700"
  }
}))(Button);

const Contribute = () => {
  return (
    <div>
      <Typography variant="h3" component="h2" align="center" gutterBottom>
        Contribute/Donate
      </Typography>
      <Typography variant="body1" paragraph>
        There are many ways to contribute to free and open software. If you
        like my work and want to support it you can:
      </Typography>
      <Grid
        container
        spacing={2}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <CoffeButton
            variant="contained"
            color="primary"
            href="https://www.buymeacoffee.com/krstoffr"
            size="large"
          >
            Buy Me a Coffee
          </CoffeButton>
        </Grid>
        <Grid item xs={12}>
          <PayPalButton color="primary" href="https://www.paypal.me/krstoffr">
            (or use PayPal)
          </PayPalButton>
        </Grid>
      </Grid>
      <Typography variant="body1" paragraph style={{ marginTop: '1em' }}>
        Financial support is not the only way to contribute. Other ways to
        contribute are to suggest new features, contribute useful references,
        or help fix typos. Just open an issue on{" "}
        <a href="https://github.com/rpsychologist/likelihood">GitHub</a>.
      </Typography>
    </div>
  );
};
export default Contribute;
