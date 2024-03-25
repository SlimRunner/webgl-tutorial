interface AttribLocations {
  vertexPosition: number;
};

interface UniformLocations {
  projectionMatrix: WebGLUniformLocation | null;
  modelViewMatrix: WebGLUniformLocation | null;
};

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: AttribLocations;
  uniformLocations: UniformLocations;
};

interface WebGLBuffers {
  position: WebGLBuffer | null
};

export type { ProgramInfo, WebGLBuffers };
