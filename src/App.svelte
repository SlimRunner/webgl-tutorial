<script lang="ts">
  import { onMount } from "svelte";

  onMount(async () => {
    const canvas = <HTMLCanvasElement>document.querySelector("#glCanvas");
    if (canvas === null) {
      throw new Error("Unable to locate canvas");
    }
    const gl = canvas.getContext("webgl");

    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform vec4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `;

    const fsSource = `
      void main() {
        gl_Color = vec4(1.0);
      }
    `;

    if (gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

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
          "Shader compilation failed:",
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
          "Shader program linking failed:",
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