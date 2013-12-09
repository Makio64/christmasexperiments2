/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * ShaderToon currently contains:
 *
 *  toon1
 *  toon2
 *  hatching
 *  dotted
 */

THREE.ShaderToon2 = {

    uniforms: {
        "Projection"  : { type: "m4", value: new THREE.Vector3() },
        "Modelview" : { type: "m4", value: new THREE.Vector3() },
        "NormalMatrix" : { type: "m3", value: new THREE.Vector3() },
        "DiffuseMaterial" : { type: "v3", value: new THREE.Vector3() },
        "LightPosition;" : { type: "v3", value: new THREE.Vector3() },
        "AmbientMaterial;" : { type: "v3", value: new THREE.Vector3() },
        "SpecularMaterial;" : { type: "v3", value: new THREE.Vector3() },
        "Shininess;" : { type: "f", value: new THREE.Vector3() }
    },

    vertexShader: [
        "attribute vec4 Position;",
        "attribute vec3 Normal;",
        "uniform mat4 Projection;",
        "uniform mat4 Modelview;",
        "uniform mat3 NormalMatrix;",
        "uniform vec3 DiffuseMaterial;",
        "varying vec3 EyespaceNormal;",
        "varying vec3 Diffuse;",
        "void main()",
        "{",
            "EyespaceNormal = NormalMatrix * Normal;",
            "gl_Position = Projection * Modelview * Position;",
            "Diffuse = DiffuseMaterial;",
        "}"
    ].join("\n"),

    fragmentShader: [
        "varying vec3 EyespaceNormal;",
        "varying vec3 Diffuse;",
        "uniform vec3 LightPosition;",
        "uniform vec3 AmbientMaterial;",
        "uniform vec3 SpecularMaterial;",
        "uniform float Shininess;",
        "float stepmix(float edge0, float edge1, float E, float x)",
        "{",
            "float T = clamp(0.5 * (x - edge0) / E, 0.0, 1.0);",
            "return mix(edge0, edge1, T);",
        "}",
        "void main()",
        "{",
            "vec3 N = normalize(EyespaceNormal);",
            "vec3 L = normalize(LightPosition);",
            "vec3 Eye = vec3(0, 0, 1);",
            "vec3 H = normalize(L + Eye);",
            "float df = max(0.0, dot(N, L));",
            "float sf = max(0.0, dot(N, H));",
            "sf = pow(sf, Shininess);",
            "const float A = 0.1;",
            "const float B = 0.3;",
            "const float C = 0.6;",
            "const float D = 1.0;",
            "float E = fwidth(df);",
            "if      (df > A - E && df < A + E) df = stepmix(A, B, E, df);",
            "else if (df > B - E && df < B + E) df = stepmix(B, C, E, df);",
            "else if (df > C - E && df < C + E) df = stepmix(C, D, E, df);",
            "else if (df < A) df = 0.0;",
            "else if (df < B) df = B;",
            "else if (df < C) df = C;",
            "else df = D;",
            "E = fwidth(sf);",
            "if (sf > 0.5 - E && sf < 0.5 + E)",
            "{",
                "sf = clamp(0.5 * (sf - 0.5 + E) / E, 0.0, 1.0);",
            "}",
            "else",
            "{",
                "sf = step(0.5, sf);",
            "}",
            "vec3 color = AmbientMaterial + df * Diffuse + sf * SpecularMaterial;",
            "gl_FragColor = vec4(color, 1.0);",
        "}"
    ].join("\n")
};