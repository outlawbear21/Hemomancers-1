(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="../../typescript/typescriptAPI/TypeScriptAPIPlugin.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });

SupCore.system.registerPlugin("typescriptAPI", "Sup.Shader", {
    code: "namespace Sup {\n  export class Shader extends Asset {}\n  export class ShaderUniforms {\n    renderer: any;\n\n    constructor(renderer: any) {\n      if (renderer == null) throw new Error(\"ShaderUniforms can't be created at runtime. You can access them from a SpriteRenderer or a ModelRenderer\");\n      this.renderer = renderer;\n    }\n\n    checkUniform(name: string) {\n      if (this.renderer.__inner.material.uniforms == null) throw new Error(\"Material type must be Shader to access uniforms\");\n      if (this.renderer.__inner.material.uniforms[name] == null) throw new Error(`Uniform ${name} isn't defined`);\n    }\n\n    getFloat(name: string) {\n      this.checkUniform(name);\n      return this.renderer.__inner.material.uniforms[name];\n    }\n    setFloat(name: string, value: number) {\n      this.checkUniform(name);\n      this.renderer.__inner.material.uniforms[name].value = value;\n      return this;\n    }\n\n    getColor(name: string) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      return new Sup.Color(uniform.r, uniform.g, uniform.b);\n    }\n    setColor(name: string, value: Sup.Color) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      uniform.r = value.r;\n      uniform.g = value.g;\n      uniform.b = value.b;\n      return this;\n    }\n\n    getVector2(name: string) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      return new Sup.Math.Vector2(uniform.x, uniform.y);\n    }\n    setVector2(name: string, value: Sup.Math.Vector2) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      uniform.x = value.x;\n      uniform.y = value.y;\n      return this;\n    }\n    getVector3(name: string) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      return new Sup.Math.Vector3(uniform.x, uniform.y, uniform.z);\n    }\n    setVector3(name: string, value: Sup.Math.Vector3) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      uniform.x = value.x;\n      uniform.y = value.y;\n      uniform.z = value.z;\n      return this;\n    }\n    getVector4(name: string) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      return { x: uniform.x, y: uniform.y, z: uniform.z, w: uniform.w };\n    }\n    setVector4(name: string, value: { x: number; y: number; z: number; w: number; }) {\n      this.checkUniform(name);\n      let uniform = this.renderer.__inner.material.uniforms[name].value;\n      uniform.x = value.x;\n      uniform.y = value.y;\n      uniform.z = value.z;\n      uniform.w = value.w;\n      return this;\n    }\n  }\n}\n",
    defs: "declare namespace Sup {\n  class Shader extends Asset {\n    dummyShaderMember;\n  }\n  class ShaderUniforms {\n    getFloat(name: string): number;\n    setFloat(name: string, value: number): ShaderUniforms;\n\n    getColor(name: string): Sup.Color;\n    setColor(name: string, value: Sup.Color): ShaderUniforms;\n\n    getVector2(name: string): Sup.Math.Vector2;\n    setVector2(name: string, value: Sup.Math.Vector2): ShaderUniforms;\n    getVector3(name: string): Sup.Math.Vector3;\n    setVector3(name: string, value: Sup.Math.Vector3): ShaderUniforms;\n    getVector4(name: string): { x: number; y: number; z: number; w: number; };\n    setVector4(name: string, value: { x: number; y: number; z: number; w: number; }): ShaderUniforms;\n  }\n}\n",
});

},{}]},{},[1]);
