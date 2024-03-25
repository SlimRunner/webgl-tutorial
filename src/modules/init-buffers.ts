import type { WebGLBuffers } from "../interfaces/webgl-interfaces";

function initBuffers(gl:WebGLRenderingContext): WebGLBuffers {
  const positionBuffer = initPositionBuffer(gl);

  return {
    position: positionBuffer,
  };
}

function initPositionBuffer(gl: WebGLRenderingContext) {
  // create a buffer for the square's positions
  const positionBuffer = gl.createBuffer();

  // select positionBuffer as the one to apply buffer
  // operations to from here out
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // create an arry of positions for the square
  const positions = [1, 1, -1, 1, 1, -1, -1, -1];

  // pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

export { initBuffers };
