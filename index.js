console.log('index');
const http = require('http');

const port = process.env.PORT || 3000;
const interval = process.env.INTERVAL || 1000;
const duration = process.env.DURATION || 30000;

const httpServer = http.createServer((req, res) => {
  const intervalId = setInterval(() => {
    console.log('setInterval');
  }, interval);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log('end');
    res.end('Hello Client!');
  }, duration);
});

httpServer.listen(port, (err) => {
  if (err) {
    return console.log('Something went wrong!');
  }
  console.log(`Server running on port: ${port}`);
});
