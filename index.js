console.log('index');
const http = require('http');

const port = process.env.PORT || 3000;
const interval = process.env.INTERVAL || 1000;
const duration = process.env.DURATION || 30000;

console.log(interval, duration);

const httpServer = http.createServer((req, res) => {
  res.write('Hello World!');
  res.end();
});

httpServer.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
