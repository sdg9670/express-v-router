import { Router, RequestHandler } from 'express';
import { HttpMethod, RouterInfo, Routing, RoutingOptions } from './types';
import Utils from './utils';

export default class VersioningRouter {
  private routings: { [version: string]: Array<Routing> };
  private baseRoutings: Array<Routing>;

  constructor() {
    this.routings = {};
    this.baseRoutings = [];
  }

  public info(): RouterInfo {
    const result: RouterInfo = {};
    for (const i in this.routings) {
      result[i] = [];
      for (let j = 0; j < this.routings[i].length; j++) {
        result[i].push({
          path: this.routings[i][j].routePath,
          name: this.routings[i][j].name,
        });
      }
    }
    return result;
  }

  public getRouter(): Router {
    const versionRouters: { [version: string]: Router } = {};
    const router = Router();

    for (const i in this.routings) {
      versionRouters[i] = Router();
      for (let j = 0; j < this.routings[i].length; j++) {
        // router.use
        const routing = this.routings[i][j];
        if (!routing.method) {
          if (!routing.routePath) {
            versionRouters[i].use(routing.handlers);
            continue;
          }
          versionRouters[i].use(routing.routePath, routing.handlers);
          continue;
        }
        versionRouters[i][routing.method](routing.routePath, routing.handlers);
      }
      router.use(`/v${Utils.replaceVersionDotToHyphen(i)}`, versionRouters[i]);
    }
    return router;
  }

  public use(options: RoutingOptions, ...handlers: RequestHandler[]): void;
  public use(
    routePath: string,
    options: RoutingOptions,
    ...handlers: RequestHandler[]
  ): void;
  public use(
    optionsOrRoutePath: RoutingOptions | string,
    handlersOrOptions: any,
    handlers?: any
  ): void {
    let options: null | RoutingOptions = null;
    let routePath: null | string = null;
    let tmpHandlers: RequestHandler[] = [];

    if (typeof optionsOrRoutePath === 'object') {
      options = optionsOrRoutePath as RoutingOptions;
      tmpHandlers.push(handlersOrOptions);
      if (handlers && handlers.length > 0) {
        if (typeof handlers === 'function') tmpHandlers.push(handlers);
        else tmpHandlers.push(...handlers);
      }
    } else {
      routePath = optionsOrRoutePath as string;
      options = handlersOrOptions as RoutingOptions;
      if (handlers && handlers.length > 0) {
        if (typeof handlers === 'function') tmpHandlers.push(handlers);
        else tmpHandlers = handlers;
      }
    }

    if (!this.isExistsVersion(options.version))
      this.addVersionRouter(options.version);

    if (routePath)
      this.addRouting({ routePath, ...options, handlers: tmpHandlers });
    else this.addRouting({ ...options, handlers: tmpHandlers });
  }

  public useOnly(options: RoutingOptions, ...handlers: RequestHandler[]): void;
  public useOnly(
    routePath: string,
    options: RoutingOptions,
    ...handlers: RequestHandler[]
  ): void;
  public useOnly(
    optionsOrRoutePath: RoutingOptions | string,
    handlersOrOptions: any,
    handlers?: any
  ): void {
    let options: null | RoutingOptions = null;
    let routePath: null | string = null;
    let tmpHandlers: RequestHandler[] = [];

    if (typeof optionsOrRoutePath === 'object') {
      options = optionsOrRoutePath as RoutingOptions;
      tmpHandlers.push(handlersOrOptions);
      if (handlers && handlers.length > 0) {
        if (typeof handlers === 'function') tmpHandlers.push(handlers);
        else tmpHandlers.push(...handlers);
      }
    } else {
      routePath = optionsOrRoutePath as string;
      options = handlersOrOptions as RoutingOptions;
      if (handlers && handlers.length > 0) {
        if (typeof handlers === 'function') tmpHandlers.push(handlers);
        else tmpHandlers = handlers;
      }
    }

    if (!this.isExistsVersion(options.version))
      this.addVersionRouter(options.version);

    if (routePath)
      this.addRouting({ routePath, ...options, handlers: tmpHandlers }, true);
    else this.addRouting({ ...options, handlers: tmpHandlers }, true);
  }

  public add(
    routePath: string,
    method: HttpMethod,
    options: RoutingOptions,
    ...handlers: RequestHandler[]
  ) {
    if (!this.isExistsVersion(options.version))
      this.addVersionRouter(options.version);
    this.addRouting({ routePath, method, ...options, handlers });
  }

  public addOnly(
    routePath: string,
    method: HttpMethod,
    options: RoutingOptions,
    ...handlers: RequestHandler[]
  ) {
    if (!this.isExistsVersion(options.version))
      this.addVersionRouter(options.version);
    this.addRouting({ routePath, method, ...options, handlers }, true);
  }

  private isExistsVersion(version: string): boolean {
    return version in this.routings;
  }

  private addVersionRouter(version: string): void {
    const tmpRoutings: Array<Routing> = [];
    const checkedDuplicatedNames: { [name: string]: number } = {};

    for (let i = 0; i < this.baseRoutings.length; i++) {
      if (Utils.compareVersion(this.baseRoutings[i].version, version) > 0)
        continue;

      let duplicatedIndex = null;

      for (let j = 0; j < tmpRoutings.length; j++) {
        if (this.baseRoutings[i].name === tmpRoutings[j].name) {
          const cmpVersion = Utils.compareVersion(
            this.baseRoutings[i].version,
            tmpRoutings[j].version
          );
          if (cmpVersion > 0) duplicatedIndex = j;
          else if (cmpVersion === 0)
            throw new Error('The name and version are duplicated.');
        }
      }

      if (duplicatedIndex) tmpRoutings.splice(duplicatedIndex, 1);
      tmpRoutings.push(this.baseRoutings[i]);
    }

    this.routings[version] = tmpRoutings;
  }

  private addRouting(routing: Routing, isOnly = false): void {
    const version = routing.version;

    if (!isOnly) {
      this.baseRoutings.push(routing);

      const nowVersions = Object.keys(this.routings).sort(Utils.compareVersion);
      for (let i = 0; i < nowVersions.length; i++) {
        if (Utils.compareVersion(routing.version, nowVersions[i]) >= 0)
          continue;
        this.routings[nowVersions[i]].push(routing);
      }
    }

    for (let i = 0; i < this.routings[version].length; i++) {
      if (this.routings[version][i].name === routing.name) {
        const cmpVersion = Utils.compareVersion(
          this.routings[version][i].version,
          routing.version
        );
        if (cmpVersion === 0)
          throw new Error('The name and version are duplicated.');
        else if (cmpVersion > 0) return;
        else {
          this.routings[version].splice(i, 1);
          break;
        }
      }
    }
    this.routings[version].push(routing);
  }
}
