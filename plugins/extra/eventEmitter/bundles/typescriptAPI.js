(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="../../../default/typescript/typescriptAPI/TypeScriptAPIPlugin.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });

SupCore.system.registerPlugin("typescriptAPI", "EventEmitter", {
    code: null,
    defs: "// Definitions for node.js v4.2.4\ndeclare class EventEmitter {\n  on(event: string, listener: Function): EventEmitter;\n  addListener(event: string, listener: Function): EventEmitter;\n  once(event: string, listener: Function): EventEmitter;\n  \n  removeListener(event: string, listener: Function): EventEmitter;\n  removeAllListeners(event?: string): EventEmitter;\n  \n  emit(event: string, ...args: any[]): boolean;\n\n  static defaultMaxListeners: number;\n  setMaxListeners(n: number): EventEmitter;\n  getMaxListener(): number\n\n  listeners(event: string): Function[];\n  listenerCount(event: string): number;  \n  static listenerCount(emitter: EventEmitter, event: string): number; // deprecated\n}\n"
});

},{}]},{},[1]);
