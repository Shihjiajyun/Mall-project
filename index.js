// Creeper and Three.js setting
let renderer, scene, camera
let stats, gui
let creeperObj
let walkSpeed = 0
let tween, tweenBack
let invert = 1 // 正反向
let startTracking = false
let musicPlayback = false
let pointLight
let sceneType = 'SNOW'

// PointerLockControls setting
let controls
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false
let raycaster

// points
const particleCount = 15000
let points
let material
const textureLoader = new THREE.TextureLoader()
const snowTexture = textureLoader.load('png/snowflake.png')
const rainTexture = textureLoader.load('png/raindrop.png')

// 苦力怕物件
class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

    // 苦力怕臉部貼圖
    const headMap = textureLoader.load(
      'data:image/jpeg;base64,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'
    )
    // 苦力怕皮膚貼圖
    const skinMap = textureLoader.load(
      '../assets/img/creeper.png'
    )

    // 身體與腳的材質設定
    const skinMat = new THREE.MeshPhongMaterial({
      map: skinMap // 皮膚貼圖
    })

    // 準備頭部與臉的材質
    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map

      if (i === 4) map = headMap
      else map = skinMap

      headMaterials.push(new THREE.MeshPhongMaterial({ map: map }))
    }

    // 頭
    this.head = new THREE.Mesh(headGeo, headMaterials)
    this.head.position.set(0, 6, 0)
    // this.head.rotation.y = 0.5 // 稍微的擺頭

    // 身體
    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(0, 0, 0)

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, skinMat)
    this.foot1.position.set(-1, -5.5, 2)
    this.foot2 = this.foot1.clone()
    this.foot2.position.set(-1, -5.5, -2)
    this.foot3 = this.foot1.clone()
    this.foot3.position.set(1, -5.5, 2)
    this.foot4 = this.foot1.clone()
    this.foot4.position.set(1, -5.5, -2)

    // 將四隻腳組合為一個 group
    this.feet = new THREE.Group()
    this.feet.add(this.foot1) // 前腳左
    this.feet.add(this.foot2) // 後腳左
    this.feet.add(this.foot3) // 前腳右
    this.feet.add(this.foot4) // 後腳右

    // 將頭、身體、腳組合為一個 group
    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.feet)

    this.creeper.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}

// 生成苦力怕並加到場景
function createCreeper() {
  creeperObj = new Creeper()
  tweenHandler()
  scene.add(creeperObj.creeper)
}

let datGUIControls = new function () {
  this.startTracking = false
  this.changeScene = function () {
    if (sceneType === 'SNOW') {
      material.map = rainTexture
      material.size = 2
      sceneType = 'RAIN'
    } else {
      material.map = snowTexture
      material.size = 5
      sceneType = 'SNOW'
    }
  }
}()

function createPoints() {
  const geometry = new THREE.Geometry()

  material = new THREE.PointsMaterial({
    size: 5,
    map: snowTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.5
  })

  const range = 300
  for (let i = 0; i < particleCount; i++) {
    const x = THREE.Math.randInt(-range / 2, range / 2)
    const y = THREE.Math.randInt(0, range * 20)
    const z = THREE.Math.randInt(-range / 2, range / 2)
    const point = new THREE.Vector3(x, y, z)
    point.velocityX = THREE.Math.randFloat(-0.16, 0.16)
    point.velocityY = THREE.Math.randFloat(0.1, 0.3)
    geometry.vertices.push(point)
  }

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

function initStats() {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

function initPointerLockControls() {
  // 鼠標鎖定初始化
  controls = new THREE.PointerLockControls(camera)
  controls.getObject().position.set(10, 0, 60)
  scene.add(controls.getObject())

  // 因為鼠標鎖定控制器需要通過用戶觸發，所以需要進入畫面
  const blocker = document.getElementById('blocker')
  const instructions = document.getElementById('instructions')
  const havePointerLock =
    'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document
  if (havePointerLock) {
    instructions.addEventListener(
      'click',
      function () {
        controls.lock()
      },
      false
    )
    controls.addEventListener('lock', function () {
      instructions.style.display = 'none'
      blocker.style.display = 'none'
    })
    controls.addEventListener('unlock', function () {
      blocker.style.display = 'block'
      instructions.style.display = ''
    })
  } else {
    instructions.innerHTML =
      '你的瀏覽器似乎不支援 Pointer Lock API，建議使用電腦版 Google Chrome 取得最佳體驗！'
  }

  const onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true
        break
      case 37: // left
      case 65: // a
        moveLeft = true
        break
      case 40: // down
      case 83: // s
        moveBackward = true
        break
      case 39: // right
      case 68: // d
        moveRight = true
        break
      case 32: // space
        if (canJump === true) velocity.y += 350 // 跳躍高度
        canJump = false
        break
    }
  }
  const onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
        break
      case 37: // left
      case 65: // a
        moveLeft = false
        break
      case 40: // down
      case 83: // s
        moveBackward = false
        break
      case 39: // right
      case 68: // d
        moveRight = false
        break
    }
  }
  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  // 使用 Raycaster 實現簡單碰撞偵測
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  )
}

// Three.js init setting
function init() {
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.0008)
  // scene.fog = new THREE.Fog(0xffffff, 0, 500)

  // camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.set(20, 20, 20)
  camera.lookAt(scene.position)

  let axes = new THREE.AxesHelper(20)
  scene.add(axes)

  stats = initStats()

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor(0x80adfc, 1.0)
  renderer.setClearColor(0x111111, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

  // floor
  const planeGeometry = new THREE.PlaneGeometry(300, 300, 50, 50)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd })
  let plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.set(0, -7, 0)
  plane.receiveShadow = true
  plane.name = 'floor'
  scene.add(plane)

  createCreeper()
  createPoints()
  initPointerLockControls()

  // 設置環境光提供輔助柔和白光
  let ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // 點光源
  pointLight = new THREE.PointLight(0xf0f0f0, 1, 100) // 顏色, 強度, 距離
  pointLight.castShadow = true // 投影
  pointLight.position.set(-30, 30, 30)
  scene.add(pointLight)

  gui = new dat.GUI()
  gui.add(datGUIControls, 'changeScene')
  gui.add(datGUIControls, 'startTracking').onChange(function (e) {
    startTracking = e
    if (invert > 0) {
      if (startTracking) {
        tween.start()
      } else {
        tween.stop()
      }
    } else {
      if (startTracking) {
        tweenBack.start()
      } else {
        tweenBack.stop()
      }
    }
  })

  document.body.appendChild(renderer.domElement)
}

function tweenHandler() {
  let offset = { x: 0, z: 0, rotateY: 0 }
  let target = { x: 100, z: 100, rotateY: 0.7853981633974484 } // 目標值

  // 苦力怕走動及轉身補間動畫
  const onUpdate = () => {
    // 移動
    creeperObj.feet.position.x = offset.x
    creeperObj.feet.position.z = offset.z
    creeperObj.head.position.x = offset.x
    creeperObj.head.position.z = offset.z
    creeperObj.body.position.x = offset.x
    creeperObj.body.position.z = offset.z
    pointLight.position.x = offset.x - 20
    pointLight.position.z = offset.z + 20

    // 轉身
    if (target.x > 0) {
      creeperObj.feet.rotation.y = offset.rotateY
      creeperObj.head.rotation.y = offset.rotateY
      creeperObj.body.rotation.y = offset.rotateY
    } else {
      creeperObj.feet.rotation.y = -offset.rotateY
      creeperObj.head.rotation.y = -offset.rotateY
      creeperObj.body.rotation.y = -offset.rotateY
    }
  }

  // 計算新的目標值
  const handleNewTarget = () => {
    // 限制苦力怕走路邊界
    const range = 100
    if (camera.position.x > range) target.x = range
    else if (camera.position.x < -range) target.x = -range
    else target.x = camera.position.x
    if (camera.position.z > range) target.z = range
    else if (camera.position.z < -range) target.z = -range
    else target.z = camera.position.z

    const v1 = new THREE.Vector2(0, 1) // 原點面向方向
    const v2 = new THREE.Vector2(target.x, target.z) // 苦力怕面向新相機方向

    // 內積除以純量得兩向量 cos 值
    let cosValue = v1.dot(v2) / (v1.length() * v2.length())

    // 防呆，cos 值區間為（-1, 1）
    if (cosValue > 1) cosValue = 1
    else if (cosValue < -1) cosValue = -1

    // cos 值求轉身角度
    target.rotateY = Math.acos(cosValue)
  }

  // 計算新的目標值
  const handleNewTweenBackTarget = () => {
    // 限制苦力怕走路邊界
    const range = 150
    const tmpX = target.x
    const tmpZ = target.z

    target.x = THREE.Math.randFloat(-range, range)
    target.z = THREE.Math.randFloat(-range, range)

    const v1 = new THREE.Vector2(tmpX, tmpZ)
    const v2 = new THREE.Vector2(target.x, target.z)

    // 內積除以純量得兩向量 cos 值
    let cosValue = v1.dot(v2) / (v1.length() * v2.length())

    // 防呆，cos 值區間為（-1, 1）
    if (cosValue > 1) cosValue = 1
    else if (cosValue < -1) cosValue = -1

    // cos 值求轉身角度
    target.rotateY = Math.acos(cosValue)
  }

  // 朝相機移動
  tween = new TWEEN.Tween(offset)
    .to(target, 15000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(onUpdate)
    .onComplete(() => {
      handleNewTweenBackTarget()
      invert = -1
      tweenBack.start()
    })

  // 隨機移動
  tweenBack = new TWEEN.Tween(offset)
    .to(target, 15000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(onUpdate)
    .onComplete(() => {
      handleNewTarget() // 計算新的目標值
      invert = 1
      tween.start()
    })
}

// 苦力怕原地走動動畫
function creeperFeetWalk() {
  walkSpeed += 0.04
  creeperObj.foot1.rotation.x = Math.sin(walkSpeed) / 4 // 前腳左
  creeperObj.foot2.rotation.x = -Math.sin(walkSpeed) / 4 // 後腳左
  creeperObj.foot3.rotation.x = -Math.sin(walkSpeed) / 4 // 前腳右
  creeperObj.foot4.rotation.x = Math.sin(walkSpeed) / 4 // 後腳左
}

function pointsAnimation() {
  points.geometry.vertices.forEach(function (v) {
    if (v.y >= -7) {
      v.x = v.x - v.velocityX
      v.y = v.y - v.velocityY
    }
    if (v.x <= -150 || v.x >= 150) v.velocityX = v.velocityX * -1
  })

  points.geometry.verticesNeedUpdate = true
}

let prevTime = Date.now() // 初始時間
let velocity = new THREE.Vector3() // 移動速度向量
let direction = new THREE.Vector3() // 移動方向向量

function pointerLockControlsRender() {
  if (controls.isLocked === true) {
    // 使用 Raycaster 判斷腳下是否與場景中物體相交
    raycaster.ray.origin.copy(controls.getObject().position) // 複製控制器的位置
    const intersections = raycaster.intersectObjects(scene.children, true) // 判斷是否在任何物體上
    const onObject = intersections.length > 0

    // 計算時間差
    const time = Date.now()
    const delta = (time - prevTime) / 1000 // 大約為 0.016

    // 設定初始速度變化
    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta
    velocity.y -= 9.8 * 100.0 * delta // 預設墜落速度

    // 判斷按鍵朝什麼方向移動，並設定對應方向速度變化
    direction.z = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveLeft) - Number(moveRight)
    // direction.normalize() // 向量正規化（長度為 1），確保每個方向保持一定移動量
    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

    // 處理跳躍對應 y 軸方向速度變化
    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y)
      canJump = true
    }

    // 根據速度值移動控制器位置
    controls.getObject().translateX(velocity.x * delta)
    controls.getObject().translateY(velocity.y * delta)
    controls.getObject().translateZ(velocity.z * delta)

    // 控制器下墜超過 -2000 則重置位置
    if (controls.getObject().position.y < -2000) {
      velocity.y = 0
      controls.getObject().position.set(10, 100, 60)
      canJump = true
    }

    prevTime = time
  }
}

function render() {
  requestAnimationFrame(render)
  stats.update()
  creeperFeetWalk()
  pointsAnimation()
  TWEEN.update()
  pointerLockControlsRender()
  renderer.render(scene, camera)
}

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()