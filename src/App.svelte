<script lang="ts">
  import { onMount } from "svelte";

  onMount(async () => {
    const canvas = <HTMLCanvasElement>document.querySelector("#glCanvas");
    if (canvas === null) {
      throw new Error("Unable to locate canvas");
    }
    const gl = canvas.getContext("webgl");

    if (gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  });
</script>

<main>
  <canvas id="glCanvas" width="512" height="512"></canvas>
</main>