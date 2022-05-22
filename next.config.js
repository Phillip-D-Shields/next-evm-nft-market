module.exports = {
  reactStrictMode: true,
  target: "serverless",
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin({
        resourceRegExp: /^electron$/
    }),);
    return config
}
}
