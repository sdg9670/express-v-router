import express, { Request, Router } from 'express';
import VersionRouter from '../../dist';

const app = express();
const port = 3000;

const versionRouter = new VersionRouter();

const addData = (req: Request, value: string) => {
  if (!req.body) req.body = {};
  if (req.body.testData === undefined) req.body.testData = [value];
  else req.body.testData.push(value);
};

versionRouter.use({ name: 'middle1', version: '1.0.0' }, (req, res, next) => {
  addData(req, 'middle1 1.0.0');
  next();
});

versionRouter.useOnly(
  '/testget2',
  { name: 'middletestget2', version: '1.0.0' },
  (req, res, next) => {
    addData(req, 'middletestget2 1.0.0');
    next();
  }
);

versionRouter.add(
  '/testget1',
  'get',
  { name: 'middletestget1', version: '1.0.0' },
  (req, res, next) => {
    addData(req, 'middletestget1 1.0.0');
    next();
  }
);

versionRouter.use({ name: 'middle1', version: '1.0.1' }, (req, res, next) => {
  addData(req, 'middle1 1.0.1');
  next();
});

versionRouter.use({ name: 'middle2', version: '1.0.1' }, (req, res, next) => {
  addData(req, 'middle2 1.0.1');
  next();
});

versionRouter.useOnly(
  { name: 'middle3', version: '1.0.1' },
  (req, res, next) => {
    addData(req, 'middle3 1.0.1');
    next();
  }
);

versionRouter.add(
  '/testget1',
  'get',
  { name: 'testget1', version: '1.0.0' },
  (req, res, next) => {
    addData(req, 'testget1 1.0.0');
    res.status(200).json(req.body.testData);
  }
);

versionRouter.add(
  '/testget1',
  'get',
  { name: 'testget1', version: '1.0.1' },
  (req, res, next) => {
    addData(req, 'testget1 1.0.1');
    res.status(200).json(req.body.testData);
  }
);

versionRouter.add(
  '/testget2',
  'get',
  { name: 'testget2', version: '1.0.1' },
  (req, res, next) => {
    addData(req, 'testget2 1.0.1');
    res.status(200).json(req.body.testData);
  }
);

versionRouter.add(
  '/testget2',
  'get',
  { name: 'testget2', version: '1.0.0' },
  (req, res, next) => {
    addData(req, 'testget2 1.0.0');
    res.status(200).json(req.body.testData);
  }
);

app.use('/api', versionRouter.getRouter());

export default app;
