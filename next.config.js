module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/",
        destination: "http://localhost:5000/",
      },
    ];
  };
  return {
    rewrites,
  };
};