pex = pex || require './lib/pex'

{ Window, Platform, IO } = pex.sys
{ PerspectiveCamera, Arcball, Scene } = pex.scene
{ SolidColor, Diffuse, ShowDepth, ShowNormals } = pex.materials
{ Mesh, Texture2D, RenderTarget, Viewport, ScreenImage } = pex.gl
{ hem, Vec3, BoundingBox, Geometry, Face3, Mat4, Quat } = pex.geom
{ Cube, Octahedron, Sphere } = pex.geom.gen
{ Color } = pex.color
{ Time, MathUtils } = pex.utils
{ cos, sin, PI, random, floor } = Math

###
if !String.prototype.trim
  String.prototype.trim = () -> return this.replace(/^\s+|\s+$/g, '')
if !Array.prototype.partition
###
partition = (list, n) ->
  result = []
  for i in [0..list.length-1] by n
    group = []
    for j in [0..1]
      group.push(list[i+j])
    result.push(group)
  return result



pex.require ['materials/FlatToonShading', 'utils/CameraOrbiter'], (FlatToonShading, CameraOrbiter) ->
  Window.create
    settings:
      fullscreen: Platform.isBrowser
    init: () ->
      @dist = 6
      @angleStep = 37
      @camera = new PerspectiveCamera(45, @width/@height, @dist-5, @dist)
      #@arcball = new Arcball(this, @camera, 3)
      @orbiter = new CameraOrbiter(@camera, @dist)

      @progress = 0
      @tagetProgress = 0
      @frameCount = 0

      @colors = [
        Texture2D.load('assets/c1.png'),
        Texture2D.load('assets/c2.png'),
        Texture2D.load('assets/c3.png'),
        Texture2D.load('assets/c4.png'),
        Texture2D.load('assets/c5.png'),
        Texture2D.load('assets/c6.png'),
        Texture2D.load('assets/c7.png')
      ]

      @meshMaterial = new FlatToonShading({
        colorBands: @colors[0],
        fogColor: new Color(0.2, 0.2, 0.2, 1.0)
      })

      @orbiter.phi = -@angleStep if @orbiter
      @orbiter.targetPhi = 0 if @orbiter

      @meshes = []
      @textsToLoad = 0
      @addText('assets/merry-en.svg', new Vec3(0, 0, @dist-2.5), new Quat().setAxisAngle(new Vec3(0, 1, 0), @angleStep * 0))
      @addText('assets/merry-pl.svg', new Vec3(0, 0, @dist-2.5), new Quat().setAxisAngle(new Vec3(0, 1, 0), @angleStep * 1))
      @addText('assets/merry-kr.svg', new Vec3(0, 0, @dist-2.5), new Quat().setAxisAngle(new Vec3(0, 1, 0), @angleStep * 2))
      @addText('assets/merry-dk.svg', new Vec3(0, 0, @dist-2.5), new Quat().setAxisAngle(new Vec3(0, 1, 0), @angleStep * 3))

      @bar = document.getElementById('bar')
      @loader = document.getElementById('loader')

    addText: (url, translate, rotate) ->
      @textsToLoad++
      IO.loadTextFile url, (svg) =>
        triangles = []
        svg.split('\n').forEach (line, lineIndex) =>
          line = line.trim()
          #if triangles.length > 65 then return
          if line.substr(0, 3) == 'd="'
            pathData = line.substr(3, line.length-4)
            triangleCoordinates = constructPolygonFromSVGPath(pathData, {})
            triangles.push(triangleCoordinates[0])
        @meshes.push(@praperePoints(triangles, translate, rotate))
        @targetProgress = @meshes.length / @textsToLoad || 0

    praperePoints: (triangles, translate, rotate) ->
      triangles = triangles.map((coords) -> partition(coords, 2).map((coord) -> new Vec3(coord[0], coord[1], 0)))
      points = []
      triangles.forEach (trianglePoints) ->
        points = points.concat(trianglePoints)
      bbox = BoundingBox.fromPoints(points)
      bboxSize = bbox.getSize()
      aspectRatio = bboxSize.y / bboxSize.x

      points.forEach (p) ->
        p.x = (p.x - bbox.min.x) / bboxSize.x - 0.5
        p.y = -(p.y - bbox.min.y) / bboxSize.y * aspectRatio + aspectRatio/2
        p.scale(2)
        p.add(translate)
        p.transformQuat(rotate)

      camPos = @camera.getPosition().dup()
      camPos.transformQuat(rotate)
      points.forEach (p) ->
        b = camPos.dup().sub(p).normalize().scale(random() * 0.3 - 0.15)
        p.add(b)

      triangles.forEach (trianglePoints) ->
        k = random() * 1 - 0.5
        trianglePoints.forEach (p) ->
          b = camPos.dup().sub(p).normalize().scale(k)
          p.add(b)

      @buildMesh(triangles)

    buildMesh: (triangles) ->
      geom = new Geometry({vertices:true, face:true, normals:true})
      vertices = geom.vertices
      faces = geom.faces
      normals = geom.normals

      triangles.forEach (trianglePoints) ->
        numPoints = vertices.length
        n = new Vec3(random()-0.5, random()-0.5, random()-0.5).normalize()
        ab = trianglePoints[1].dup().sub(trianglePoints[0]).normalize()
        ac = trianglePoints[2].dup().sub(trianglePoints[0]).normalize()
        n = ab.cross(ac)
        trianglePoints.forEach (point) ->
          vertices.push (point)
          normals.push (n)
        faces.push(new Face3(numPoints, numPoints+1, numPoints+2))

      return new Mesh(geom, @meshMaterial)

    swapColor: () ->
      @colors.push(@colors.shift())
      @meshMaterial.uniforms.colorBands = @colors[0]

    update: () ->
      @orbiter.phi += (@orbiter.targetPhi - @orbiter.phi) * 0.1 if @orbiter
      @orbiter.update() if @orbiter

      @frameCount++

      if @frameCount % (90 * @meshes.length) == 0
        setTimeout (() => @swapColor()), 100
        @orbiter.targetPhi = (floor(@orbiter.targetPhi/360)+1)*360
      else if @frameCount % 90 == 0
        @orbiter.targetPhi += @angleStep if @orbiter

    updateProgress: () ->
      @progress += (@targetProgress - @progress) * 0.05
      @bar.style.width = (@progress * 100) + '%'

    draw: () ->
      @gl.clearColor(0.2, 0.2, 0.2, 1.0)
      @gl.clear(@gl.COLOR_BUFFER_BIT | @gl.DEPTH_BUFFER_BIT)
      @gl.enable(@gl.DEPTH_TEST)

      @updateProgress()

      if @meshes.length < @textsToLoad || @progress < 0.99 then return

      @loader.style.display = 'none'

      @update()
      @meshMaterial.uniforms.lightPos = @camera.getPosition()
      @meshMaterial.uniforms.near = @camera.getNear()
      @meshMaterial.uniforms.far = @camera.getFar()

      for mesh, meshIndex in @meshes
        mesh.draw(@camera)
