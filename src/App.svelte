<script lang="ts">
  import { onMount } from "svelte";
  import type { ProgramInfo } from "./interfaces/webgl-interfaces";
  import { initBuffers } from "./modules/init-buffers";
  import { drawScene } from "./modules/draw-scene";

  onMount(async () => {
    const canvas = <HTMLCanvasElement>document.querySelector("#glCanvas");
    if (canvas === null) {
      throw new Error("Unable to locate canvas");
    }
    const gl = canvas.getContext("webgl");

    if (gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    
    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `;

    const fsSource = `
      void main() {
        gl_FragColor = vec4(1.0);
      }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    
    if (shaderProgram === null) {
      throw new Error("Shader program failed to initialize.");
    }

    const programInfo: ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition")
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      },
    };

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);

    // functions are below
    // TODO: refactor into modules and components

    function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);

      if (shader === null) {
        throw new Error("Shader allocation failed");
      }

      // send source to the shader object
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(
          "Shader compilation failed:\n" +
          gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      if (!(vertexShader && fragmentShader)) {
        console.warn(
          "Some shaders failed to load"
        );
        return null;
      }

      // create the shader program;

      const shaderProgram = gl.createProgram();

      if (shaderProgram === null) {
        console.warn("Shader program creation failed");
        return null;
      }

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.warn(
          "Shader program linking failed:\n" +
          gl.getProgramInfoLog(shaderProgram)
        );
        return null;
      }

      return shaderProgram;
    }

  });
</script>

<main>
  <canvas id="glCanvas" width="640" height="480"></canvas>
</main>