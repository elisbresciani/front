module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/",
        destination: "https://login-app-ponto.herokuapp.com/",
      },
    ];
  };
  return {
    rewrites,
  };
};