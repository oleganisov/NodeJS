const http = require('http');

const port = process.env.PORT || 3000;
const interval = process.env.INTERVAL || 1000;
const duration = process.env.DURATION || 30000;

const httpServer = http.createServer((req, res) => {
  const intervalId = setInterval(() => {
    const currentTime = new Date().toUTCString();
    console.log(`current time: ${currentTime}`);
  }, interval);

  setTimeout(() => {
    const endTime = new Date().toUTCString();

    clearInterval(intervalId);
    console.log(`request end time: ${endTime}`);
    res.end(`current time: ${endTime}`);
  }, duration);
});

httpServer.listen(port, (err) => {
  if (err) {
    return console.log('Something went wrong!');
  }
  console.log(`Server running on port: ${port}`);
});
