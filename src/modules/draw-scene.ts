import { mat4 } from "gl-matrix";
import type { ProgramInfo, WebGLBuffers } from "../interfaces/webgl-interfaces";

function drawScene(gl:WebGLRenderingContext, programInfo: ProgramInfo, buffers: WebGLBuffers) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  // near things obstruct far things
  gl.depthFunc(gl.LEQUAL);

  // clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // our field of view is 45 degrees, with a widdth/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to recieve the result
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination
    modelViewMatrix, // source
    [-0.0, 0.0, -6.0]
  );

  // tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  // tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function setPositionAttribute(gl: WebGLRenderingContext, buffers:WebGLBuffers, programInfo: ProgramInfo) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the date in the buffer is 32bit floats
  const normalize = false;
  const stride = 0; // how many bytes to get from one set of vlaues to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };
