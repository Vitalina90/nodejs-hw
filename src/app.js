import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';

const carsPath = path.join(import.meta.dirname, '..', 'cars.json');
const data = await fs.readFile(carsPath, { encoding: 'utf-8' });
const cars = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/cars') {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    return res.end(JSON.stringify(cars));
  }

  // /cars/1  /cars/2 /cars/3
  if (method === 'GET' && url.startsWith('/cars/')) {
    const carId = url.split('/')[2];
    const car = cars.find((c) => c.id === carId);

    if (!car) {
      res.statusCode = 404;
      res.setHeader('Content-type', 'application/json');
      return res.end(JSON.stringify({ message: 'Car not found' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    return res.end(JSON.stringify(car));
  }
});

server.listen(3000, () => {
  console.log('Server is running on localhost:3000');
});
