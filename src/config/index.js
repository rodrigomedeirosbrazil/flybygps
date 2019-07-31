const config = {
  distanceUnits: [
    {
      name: "kilometers",
      symbol: "km",
      factor: 0.001
    },
    {
      name: "miles",
      symbol: "mi",
      factor: 0.000621371
    }
  ],
  timeUnits: [
    {
      name: "hours",
      symbol: "hrs",
      factor: 0.000277778
    },
    {
      name: "minutes",
      symbol: "m",
      factor: 0.0166667
    }
  ],
  altitudeUnits: [
    {
      name: "meters",
      symbol: "m",
      factor: 1
    },
    {
      name: "foot",
      symbol: "ft",
      factor: 3.28084
    }
  ],
  speedUnits: [
    {
      name: "meters per second",
      symbol: "m/s",
      factor: 1
    },
    {
      name: "kilometer an hour",
      symbol: "km/h",
      factor: 3.6
    },
    {
      name: "knots",
      symbol: "kts",
      factor: 1.94384
    },
    {
      name: "feets per minute",
      symbol: "ft/min",
      factor: 196.85
    }
  ]
};

export default config;
