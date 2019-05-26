(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="../../typescript/typescriptAPI/TypeScriptAPIPlugin.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });

SupCore.system.registerPlugin("typescriptAPI", "Sup.CubicModel", {
    code: "namespace Sup {\n  export class CubicModel extends Asset {\n    getPixelsPerUnit() { return this.__inner.pixelsPerUnit; }\n  }\n}\n",
    defs: "declare namespace Sup {\n  class CubicModel extends Asset {\n    getPixelsPerUnit(): number;\n  }\n}\n",
});
SupCore.system.registerPlugin("typescriptAPI", "CubicModelRenderer", {
    code: "namespace Sup {\n  let materialTypes = [\"basic\", \"phong\"];\n\n  export class CubicModelRenderer extends Sup.ActorComponent {\n    constructor(actor: Actor, pathOrAsset: string|CubicModel, materialIndex: number) {\n      super(actor);\n      this.__inner = new SupEngine.componentClasses.CubicModelRenderer(this.actor.__inner);\n      if (pathOrAsset != null) {\n        let cubicModelAsset = (typeof pathOrAsset === \"string\") ? get(pathOrAsset, CubicModel) : <CubicModel>pathOrAsset;\n        this.__inner.opacity = cubicModelAsset.__inner.opacity;\n        this.setCubicModel(cubicModelAsset, materialIndex);\n      }\n      this.__inner.__outer = this;\n      this.actor.cubicModelRenderer = this;\n    }\n    destroy() {\n      this.actor.cubicModelRenderer = null;\n      super.destroy();\n    }\n\n    getCubicModel() { return (this.__inner.asset != null) ? this.__inner.asset.__outer : null; }\n    setCubicModel(pathOrAsset: string|CubicModel, materialIndex: number) {\n      let material: string;\n      if (materialIndex != null) material = materialTypes[materialIndex];\n\n      let cubicModelAsset = (typeof pathOrAsset === \"string\") ? get(pathOrAsset, CubicModel) : <CubicModel>pathOrAsset;\n      this.__inner.setCubicModel((cubicModelAsset != null) ? cubicModelAsset.__inner : null, material);\n      return this;\n    }\n  }\n\n  export namespace CubicModelRenderer {\n    export enum MaterialType { Basic, Phong };\n  }\n}\n",
    defs: "declare namespace Sup {\n  class CubicModelRenderer extends ActorComponent {\n    constructor(actor: Actor, pathOrAsset?: string|CubicModel, materialType?: CubicModelRenderer.MaterialType );\n\n    getCubicModel(): CubicModel;\n    setCubicModel(pathOrAsset: string|CubicModel, materialType?: CubicModelRenderer.MaterialType): CubicModelRenderer;\n  }\n\n  namespace CubicModelRenderer {\n    enum MaterialType { Basic, Phong }\n  }\n}\n",
    exposeActorComponent: { propertyName: "cubicModelRenderer", className: "Sup.CubicModelRenderer" }
});

},{}]},{},[1]);
