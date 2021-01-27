const express = require('express');
const VersioningRouter = require('./dist').default;

const vRouter = new VersioningRouter();
console.log(vRouter.info());
