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
  });
</script>

<main>
  <canvas id="glCanvas" width="640" height="480"></canvas>
</main>