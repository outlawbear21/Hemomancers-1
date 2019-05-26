(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="../../typescript/typescriptAPI/TypeScriptAPIPlugin.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });

SupCore.system.registerPlugin("typescriptAPI", "Sup.Game", {
    code: "namespace Sup {\n  export namespace Game {\n    export function getFPS() { return player.resources.gameSettings.framesPerSecond; }\n    export function getScreenRatio() {\n      let width = player.resources.gameSettings.ratioNumerator;\n      let height = player.resources.gameSettings.ratioDenominator;\n      return { width, height };\n    }\n  }\n}\n",
    defs: "declare namespace Sup {\n  namespace Game {\n    function getFPS(): number;\n    function getScreenRatio(): { width: number; height: number; };\n  }\n}\n"
});

},{}]},{},[1]);
