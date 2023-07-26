import express from 'express';

const app = express();

app.post('/', (req, res) => {
  return res.send("succesfull read");
});

app.listen(4000, () =>
  console.log(`Example app listening on port 4000!`),
);
