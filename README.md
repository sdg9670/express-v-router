# Express V Router

It is a router that can be versioned using url path in express.

# Docs

- [Installation](#installation)
- [Example](#example)
- [Usage Rules](#usage-rules)
- [API](#api)

# Installation

```bash
npm install express-v-router
```

# Example

```javascript
// ES6
// import VersioningRouter from ''express-v-router';
const VersioningRouter = require('express-v-router').default;
const express = require('express');
const vRouter = new VersioningRouter();

vRouter.use({ name: 'auth', version: '1.0.0' }, (req, res, next) => {
  next();
});

vRouter.use({ name: 'auth', version: '2.0.5' }, (req, res, next) => {
  next();
});

vRouter.add(
  '/name',
  'get',
  { name: 'getName', version: '1.0.0' },
  (req, res, next) => {
    res.json({ name: 'Sim' });
  }
);

vRouter.add(
  '/name',
  'get',
  { name: 'getName', version: '2.0.6' },
  (req, res, next) => {
    res.json({ name: 'Mark' });
  }
);

const app = express();

app.use(vRouter.getRouter());

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});

/*
  - Request: http://localhost:3000/v1-0-0/name
  - Result: {"name":"Sim"}

  - Request: http://localhost:3000/v2-0-5/name
  - Result: {"name":"Sim"}

  - Request: http://localhost:3000/v2-0-6/name
  - Result: {"name":"Mark"}
*/
```

# Usage Rules

- In "V Router", the version consists of numbers and the minor version is separated by "."

  `1.0, 3, 1.0.2, 2.0, 1.2.4, 1.2.25`

- Must be unique by name and version pair, and must have only one.

  ```javascript
  // No!!
  vRouter.use({ name: 'test', version: '1.0.0' }, (req, res, next) => {});
  vRouter.add(
    '/test',
    'get',
    { name: 'test', version: '1.0.0' },
    (req, res, next) => {}
  );

  // Yes!!
  vRouter.use({ name: 'test1', version: '1.0.0' }, (req, res, next) => {});
  vRouter.add(
    '/test',
    'get',
    { name: 'test1', version: '1.0.1' },
    (req, res, next) => {}
  );
  vRouter.use({ name: 'test2', version: '1.0.0' }, (req, res, next) => {});
  ```

- If you are not registered with that version and are registered with a subversion, use the most recent version of the subversion. And if multiple versions with the same name are registered, use the latest version below that version.

  ```javascript
  const VersioningRouter = require('express-v-router').default;
  const vRouter = new VersioningRouter();

  vRouter.use({ name: 'filter', version: '1.0.0' }, (req, res, next) => {
    console.log('1.0.0 filter !');
    next();
  });

  vRouter.use({ name: 'filter', version: '2.0.5' }, (req, res, next) => {
    console.log('2.0.5 filter !');
    next();
  });

  vRouter.useOnly({ name: 'auth', version: '1.0.0' }, (req, res, next) => {
    console.log('auth !');
    next();
  });

  vRouter.add(
    '/test',
    'get',
    { name: 'test', version: '1.0.0' },
    (req, res, next) => {
      console.log('test !');
      res.status(200);
    }
  );

  /*
    request: /v1-0-0/test
    result:
      1.0.0 filter !
      auth !
      test !
  */

  /*
    request: /v2-0-5/test
    result:
      2.0.5 filter !
      test !
  */
  ```

# API

- `use(options: RoutingOptions, ...handlers: RequestHandler[]): void`
- `use(routePath: string, options: RoutingOptions, ...handlers: RequestHandler[]): void`

  It's like `router.use()` in express. It is a middleware that only works with this version or higher.

  ```javascript
  const VersioningRouter = require('express-v-router').default;
  const vRouter = new VersioningRouter();

  vRouter.use(
    { name: 'filter', version: '1.0.0' },
    (req, res, next) => {},
    (req, res, next) => {}
  );

  vRouter.use(
    '/filter',
    { name: 'filter2', version: '1.0.0' },
    (req, res, next) => {}
  );
  ```

- `useOnly(options: RoutingOptions, ...handlers: RequestHandler[]): void`
- `useOnly(routePath: string, options: RoutingOptions, ...handlers: RequestHandler[]): void`

  It's like `router.use()` in express. Unlike use(), it is a middleware that operates only in that version. If the router has the same name, the higher version will work before the lower version.

  ```javascript
  const VersioningRouter = require('express-v-router').default;
  const vRouter = new VersioningRouter();

  vRouter.useOnly(
    { name: 'filter', version: '1.0.0' },
    (req, res, next) => {},
    (req, res, next) => {}
  );

  vRouter.useOnly(
    '/filter',
    { name: 'filter2', version: '1.0.0' },
    (req, res, next) => {}
  );
  ```

- `add(routePath: string, method: HttpMethod, options: RoutingOptions, ...handlers: RequestHandler[]): void`

  It's like `router.Method()` in express. It is a method action that only works with this version or higher.

  ```javascript
  const VersioningRouter = require('express-v-router').default;
  const vRouter = new VersioningRouter();

  vRouter.add(
    '/name',
    'get',
    { name: 'getName', version: '1.0.0' },
    (req, res, next) => {}
  );
  ```

- `addOnly(routePath: string, method: HttpMethod, options: RoutingOptions, ...handlers: RequestHandler[]): void`

  It's like `router.Method()` in express. it is a method action that operates only in that version.

  ```javascript
  const VersioningRouter = require('express-v-router').default;
  const vRouter = new VersioningRouter();

  vRouter.addOnly(
    '/name',
    'get',
    { name: 'getName', version: '1.0.0' },
    (req, res, next) => {}
  );
  ```

- `info(): RouterInfo`

  Returns the information registered with the router.

  ```javascript
  const VersioningRouter = require('express-v-router').default;
  const vRouter = new VersioningRouter();

  vRouter.addOnly(
    '/name',
    'get',
    { name: 'getName', version: '1.0.0' },
    (req, res, next) => {}
  );

  vRouter.add(
    '/age',
    'get',
    { name: 'getAge', version: '1.0.0' },
    (req, res, next) => {}
  );

  vRouter.add(
    '/email',
    'get',
    { name: 'getEmail', version: '1.0.0' },
    (req, res, next) => {}
  );

  vRouter.add(
    '/id',
    'get',
    { name: 'getId', version: '2.0.0' },
    (req, res, next) => {}
  );

  vRouter.add(
    '/email',
    'get',
    { name: 'getEmail', version: '2.0.0' },
    (req, res, next) => {}
  );

  /*
    {
      '1.0.0': [
        { path: '/name', name: 'getName' },
        { path: '/age', name: 'getAge' },
        { path: '/email', name: 'getEmail' }
      ],
      '2.0.0': [
        { path: '/age', name: 'getAge' },
        { path: '/id', name: 'getId' },
        { path: '/email', name: 'getEmail' }
      ]
    }
  */
  vRouter.info();
  ```

- `getRouter(): Router`

  Returns the configured router.

  ```javascript
  const express = require('express');
  const VersioningRouter = require('express-v-router').default;

  const vRouter = new VersioningRouter();

  vRouter.add(
    '/id',
    'get',
    { name: 'getId', version: '2.0.0' },
    (req, res, next) => {}
  );

  const app = express();
  app.use(vRouter.getRouter());
  ```

- `RoutingOptions`

  ```javascript
  {
    version: string;
    name: string;
  }
  ```

- `HttpMethod`

  ```
  'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch'
  ```

- `RouterInfo`

  ```javascript
  RouterInfo {
    [version: string]: Array<{
      path: string;
      name: string;
    }>;
  }
  ```
