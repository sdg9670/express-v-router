import { Router, RequestHandler } from 'express';

export type HttpMethod =
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace'
  | 'patch';

export interface Routing {
  routePath?: string;
  method?: HttpMethod;
  version: string;
  name: string;
  handlers: RequestHandler[];
}

export interface RoutingOptions {
  version: string;
  name: string;
}

export interface RouterInfo {
  [version: string]: Array<{
    path: string;
    name: string;
  }>;
}
