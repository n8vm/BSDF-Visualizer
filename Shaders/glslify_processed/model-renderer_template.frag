#version 300 es

precision mediump float;
#define GLSLIFY 1

uniform bool uHeatmap;
uniform float uIntensity;

uniform vec3 uLightDirection;
uniform mat4 uVMatrix;
uniform vec3 uPickPointNDC;
uniform mat4 uPickModelViewMatrix;

//*************** START INLINED UNIFORMS ******************
// <INLINE_UNIFORMS_HERE>
//*************** END INLINED UNIFORMS ********************

in vec2 vTextureCoord;
in vec3 vTransformedNormal;
in vec4 vPosition;

in vec3 vDiffuse;
in vec3 vSpecular;
in float vSpecularExponent;

in vec3 modelSpaceNormal;
in mat4 inversePMatrix;
in vec3 vModelSpacePosition;
out vec4 vColor;

//From Disney's BRDF Explorer:
//https://www.disneyanimation.com/technology/brdf.html
//(see DISNEY_LICENSE at the root of this repository
//for a complete copy of their license).
void computeTangentVectors( vec3 inVec, out vec3 uVec, out vec3 vVec )
{
    uVec = abs(inVec.x) < 0.999 ? vec3(1,0,0) : vec3(0,1,0);
    uVec = normalize(cross(inVec, uVec));
    vVec = normalize(cross(inVec, uVec));
}

//L, V, N assumed to be unit vectors

//*************** START INLINED BRDF ******************
// <INLINE_BRDF_HERE>
//*************** END INLINED BRDF ********************

vec4 jet (float x_0) {
  const float e0 = 0.0;
  const vec4 v0 = vec4(0,0,0.5137254901960784,1);
  const float e1 = 0.125;
  const vec4 v1 = vec4(0,0.23529411764705882,0.6666666666666666,1);
  const float e2 = 0.375;
  const vec4 v2 = vec4(0.0196078431372549,1,1,1);
  const float e3 = 0.625;
  const vec4 v3 = vec4(1,1,0,1);
  const float e4 = 0.875;
  const vec4 v4 = vec4(0.9803921568627451,0,0,1);
  const float e5 = 1.0;
  const vec4 v5 = vec4(0.5019607843137255,0,0,1);
  float a0 = smoothstep(e0,e1,x_0);
  float a1 = smoothstep(e1,e2,x_0);
  float a2 = smoothstep(e2,e3,x_0);
  float a3 = smoothstep(e3,e4,x_0);
  float a4 = smoothstep(e4,e5,x_0);
  return max(mix(v0,v1,a0)*step(e0,x_0)*step(x_0,e1),
    max(mix(v1,v2,a1)*step(e1,x_0)*step(x_0,e2),
    max(mix(v2,v3,a2)*step(e2,x_0)*step(x_0,e3),
    max(mix(v3,v4,a3)*step(e3,x_0)*step(x_0,e4),mix(v4,v5,a4)*step(e4,x_0)*step(x_0,e5)
  ))));
}

void main(void) {
    float hdr_max = 2.0;
    vec3 V = -normalize(vPosition.xyz);
    vec3 L = mat3(uVMatrix) * normalize(uLightDirection);
    L = normalize(L);
    vec3 H = normalize(L + V);
    vec3 N = normalize(vTransformedNormal); //eye space normal

    vec3 X; //eye sapce tangent
    vec3 Y; //eye space bitangent
    computeTangentVectors(N, X, Y);

    vec3 color = uIntensity * BRDF(L, V, N, X, Y) * clamp(dot(N, L),0.0,1.0);

    //vec3 color = vDiffuse * dot(N, L) +
      //vSpecular * pow(dot(H, N), vSpecularExponent);

	vec4 pickPointView4 = inverse(uPickModelViewMatrix) * inversePMatrix * vec4(uPickPointNDC,1);
	vec3 pickPointView = vec3(pickPointView4.x/pickPointView4.w, pickPointView4.y/pickPointView4.w, pickPointView4.z/pickPointView4.w);
	if (length(pickPointView - vModelSpacePosition) < 0.5) color = mix(color, vec3(1,0,0), smoothstep(0.0, 1.0, 1.0-2.0*length(pickPointView - vModelSpacePosition)));
    //vColor = vec4(color, 1.0);
  if (uHeatmap) {
    vColor = jet(clamp(color.x/hdr_max,0.0,1.0));
  } else {
    vColor = vec4(color,1.0);
  }
}