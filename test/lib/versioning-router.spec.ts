import { expect } from 'chai';
import VersionRouter from '../../lib/versioning-router';

describe('VersioningRouter', () => {
  it('add', () => {
    const versionRouter = new VersionRouter();

    versionRouter.add(
      '/test1',
      'get',
      { version: '1.0.0', name: 'test1' },
      (req, res, next) => {}
    );
    versionRouter.add(
      '/test1',
      'get',
      { version: '1.2.0', name: 'test1' },
      (req, res, next) => {},
      (req, res, next) => {}
    );
    versionRouter.add(
      '/test2',
      'get',
      { version: '1.0.0', name: 'test2' },
      (req, res, next) => {}
    );
    versionRouter.add(
      '/test3',
      'get',
      { version: '1.2.0', name: 'test3' },
      (req, res, next) => {}
    );

    expect(versionRouter.info()).to.deep.equal({
      '1.0.0': [
        { path: '/test1', name: 'test1' },
        { path: '/test2', name: 'test2' },
      ],
      '1.2.0': [
        { path: '/test1', name: 'test1' },
        { path: '/test2', name: 'test2' },
        { path: '/test3', name: 'test3' },
      ],
    });
  });

  it('addOnly', () => {
    const versionRouter = new VersionRouter();

    versionRouter.addOnly(
      '/test1',
      'get',
      { version: '1.0.0', name: 'test1' },
      (req, res, next) => {}
    );
    versionRouter.addOnly(
      '/test2',
      'get',
      { version: '1.0.0', name: 'test2' },
      (req, res, next) => {}
    );
    versionRouter.addOnly(
      '/test3',
      'get',
      { version: '1.2.0', name: 'test3' },
      (req, res, next) => {},
      (req, res, next) => {}
    );

    expect(versionRouter.info()).to.deep.equal({
      '1.0.0': [
        { path: '/test1', name: 'test1' },
        { path: '/test2', name: 'test2' },
      ],
      '1.2.0': [{ path: '/test3', name: 'test3' }],
    });
  });

  it('use', () => {
    const versionRouter = new VersionRouter();

    versionRouter.use(
      '/',
      { version: '1.0.0', name: 'test1' },
      (req, res, next) => {},
      (req, res, next) => {}
    );
    versionRouter.use(
      '/test2',
      { version: '1.0.0', name: 'test2' },
      (req, res, next) => {}
    );
    versionRouter.use(
      '/test1',
      { version: '1.2.0', name: 'test1' },
      (req, res, next) => {},
      (req, res, next) => {}
    );
    versionRouter.use(
      '/test3',
      { version: '1.0.0', name: 'test3' },
      (req, res, next) => {}
    );
    versionRouter.use(
      '/test3',
      { version: '1.2.0', name: 'test3' },
      (req, res, next) => {}
    );

    expect(versionRouter.info()).to.deep.equal({
      '1.0.0': [
        { path: '/', name: 'test1' },
        { path: '/test2', name: 'test2' },
        { path: '/test3', name: 'test3' },
      ],
      '1.2.0': [
        { path: '/test2', name: 'test2' },
        { path: '/test1', name: 'test1' },
        { path: '/test3', name: 'test3' },
      ],
    });
  });

  it('useOnly', () => {
    const versionRouter = new VersionRouter();

    versionRouter.useOnly(
      '/',
      { version: '1.0.0', name: 'test1' },
      (req, res, next) => {},
      (req, res, next) => {}
    );
    versionRouter.useOnly(
      '/test2',
      { version: '1.0.0', name: 'test2' },
      (req, res, next) => {}
    );
    versionRouter.useOnly(
      '/test1',
      { version: '1.2.0', name: 'test1' },
      (req, res, next) => {},
      (req, res, next) => {}
    );
    versionRouter.useOnly(
      '/test3',
      { version: '1.0.0', name: 'test3' },
      (req, res, next) => {}
    );
    versionRouter.useOnly(
      '/test3',
      { version: '1.2.0', name: 'test3' },
      (req, res, next) => {}
    );

    expect(versionRouter.info()).to.deep.equal({
      '1.0.0': [
        { path: '/', name: 'test1' },
        { path: '/test2', name: 'test2' },
        { path: '/test3', name: 'test3' },
      ],
      '1.2.0': [
        { path: '/test1', name: 'test1' },
        { path: '/test3', name: 'test3' },
      ],
    });
  });
});
