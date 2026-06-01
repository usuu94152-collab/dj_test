const canvas = document.querySelector("#schoolMap");
const fallback = document.querySelector("#mapFallback");
const floorButtons = [...document.querySelectorAll("[data-floor]")];
const currentLocationEl = document.querySelector("#currentLocation");
const selectedFloorEl = document.querySelector("#selectedFloor");
const roomNameEl = document.querySelector("#roomName");
const roomZoneEl = document.querySelector("#roomZone");
const roomUseEl = document.querySelector("#roomUse");
const roomRouteEl = document.querySelector("#roomRoute");
const agendaListEl = document.querySelector("#agendaList");
const agendaCountEl = document.querySelector("#agendaCount");
const studentSearchForm = document.querySelector("#studentSearchForm");
const studentSearchInput = document.querySelector("#studentSearchInput");
const quickStudentsEl = document.querySelector("#quickStudents");
const lookupMessageEl = document.querySelector("#lookupMessage");
const studentResultEl = document.querySelector("#studentResult");
const sideTabButtons = [...document.querySelectorAll("[data-side-tab]")];
const sidePanels = [...document.querySelectorAll("[data-side-panel]")];
const homeViewButton = document.querySelector("#homeView");
const zoomInButton = document.querySelector("#zoomIn");
const zoomOutButton = document.querySelector("#zoomOut");

const ROOM_HEIGHT = 0.42;
const ROOT_ROTATION = -0.1;
const HOME_CAMERA = { zoom: 1.25, rotX: -Math.PI / 3.1, rotY: 0.72 };

const roomColors = {
  classroom: 0xf8fbfc,
  lab: 0xe9f6f2,
  teacher: 0xfaf0df,
  support: 0xf2f1fb,
  utility: 0xebeef0,
  hall: 0xf7f7f2,
  selected: 0x0f4c81,
};

const typeLabels = {
  classroom: "일반교실",
  lab: "특별실 / 실험실",
  teacher: "교무 / 행정",
  support: "학습지원",
  utility: "편의시설",
  hall: "공용공간",
};

const floorData = {
  "1": {
    title: "1층",
    start: { x: 7.9, z: 3.2, name: "중앙현관" },
    corridors: [
      { x: -5.9, z: 2.9, w: 23.4, d: 1.15 },
      { x: 4.2, z: -1.6, w: 1.3, d: 7.9 },
      { x: -5.4, z: -5.0, w: 19.6, d: 1.0 },
      { x: 10.1, z: -4.8, w: 10.0, d: 1.0 },
      { x: 2.7, z: 5.5, w: 14.8, d: 1.0 },
    ],
    rooms: [
      room("auditorium", "시청각실", -11.0, 4.7, 7.6, 2.2, "hall", "행사 / 시청각"),
      room("maker", "메이커 스페이스", -1.8, 4.7, 6.1, 2.2, "lab", "창작 / 실습"),
      room("career-private", "개인 커리어실", 2.8, 4.7, 2.0, 2.2, "support", "진로 상담"),
      room("career", "진로진학실", 5.3, 2.6, 2.2, 2.2, "support", "진로 상담"),
      room("lobby", "중앙현관", 7.9, 3.2, 1.7, 1.7, "hall", "출입 / 안내"),
      room("library", "도서관", -2.9, -1.3, 8.5, 2.3, "support", "도서 / 열람"),
      room("workclass", "위클래스", -10.3, -1.3, 3.4, 2.3, "support", "상담 / 회복"),
      room("art", "미술실", -11.1, -5.4, 4.8, 2.2, "lab", "미술 수업"),
      room("special3", "특수학급3", -6.4, -5.4, 2.7, 2.2, "support", "특수교육"),
      room("special2", "특수학급2", -3.6, -5.4, 2.7, 2.2, "support", "특수교육"),
      room("special1", "특수학급1", -0.8, -5.4, 2.7, 2.2, "support", "특수교육"),
      room("office", "행정실", 5.8, -5.2, 3.5, 2.0, "teacher", "행정"),
      room("principal", "교장실", 9.0, -5.2, 2.4, 2.0, "teacher", "교무 / 행정"),
      room("meeting", "회의실", 11.5, -5.2, 2.5, 2.0, "teacher", "회의"),
      room("health", "보건실", 14.2, -5.2, 2.8, 2.0, "support", "보건"),
      room("guard", "당직실", 9.5, 1.1, 2.0, 1.6, "utility", "관리"),
      room("elevator-1", "EV", 7.2, 1.0, 1.2, 1.5, "utility", "이동"),
    ],
  },
  "2": {
    title: "2층",
    start: { x: 15.0, z: -2.8, name: "2층 계단" },
    corridors: [
      { x: 0.0, z: -0.2, w: 31.0, d: 1.05 },
      { x: 5.6, z: 3.0, w: 1.25, d: 6.6 },
      { x: -5.1, z: 4.5, w: 20.6, d: 1.05 },
      { x: 12.3, z: 3.2, w: 1.1, d: 6.1 },
    ],
    rooms: [
      rowRoom("doc", "문서고", -14.8, 4.6, 1.8, "support", "자료 보관"),
      rowRoom("learning", "학습지원실", -12.8, 4.6, 2.2, "support", "학습 지원"),
      rowRoom("print", "인쇄실", -10.5, 4.6, 1.7, "utility", "인쇄"),
      rowRoom("exam-mgmt", "평가관리실", -8.4, 4.6, 2.6, "teacher", "평가 관리"),
      rowRoom("exam", "평가본부", -5.6, 4.6, 2.6, "teacher", "평가 운영"),
      room("teacher-2-main", "교무실", -1.0, 4.6, 6.3, 2.0, "teacher", "교무"),
      rowRoom("lounge", "교직원 라운지", 3.2, 4.6, 2.5, "teacher", "휴게"),
      rowRoom("health-edu", "보건교육 지원실", 5.5, 4.6, 2.1, "support", "보건 교육"),
      room("multipurpose-1", "다목적교실1", -7.0, 0.7, 4.1, 2.0, "lab", "다목적 수업"),
      room("self-1", "자기주도 학습실1", -1.5, 0.7, 3.2, 2.0, "support", "자기주도 학습"),
      room("grade2-office", "2학년 교무실", 2.1, 0.7, 3.6, 2.0, "teacher", "2학년 교무"),
      rowRoom("material", "교재자료실", -12.4, -2.4, 2.5, "support", "교재 자료"),
      classRoom("2-7", -9.8, -2.4, "2학년 교실"),
      classRoom("2-6", -7.4, -2.4, "2학년 교실"),
      room("broadcast", "방송실", -4.4, -2.4, 3.1, 2.0, "support", "방송"),
      classRoom("2-5", -1.6, -2.4, "2학년 교실"),
      classRoom("2-4", 0.7, -2.4, "2학년 교실"),
      rowRoom("study-2", "자습실", 2.5, -2.4, 1.4, "support", "자습"),
      classRoom("2-3", 4.4, -2.4, "2학년 교실"),
      classRoom("2-2", 6.8, -2.4, "2학년 교실"),
      classRoom("2-1", 9.2, -2.4, "2학년 교실"),
      room("computer", "연구실 / 컴퓨터실", 13.0, 2.3, 2.5, 3.0, "lab", "컴퓨터"),
      room("rest-2", "화장실", 13.0, 5.1, 2.5, 1.6, "utility", "편의시설"),
    ],
  },
  "3": {
    title: "3층",
    start: { x: 15.0, z: -2.8, name: "3층 계단" },
    corridors: [
      { x: 0.0, z: -0.2, w: 31.0, d: 1.05 },
      { x: 5.5, z: 3.1, w: 1.25, d: 6.7 },
      { x: -5.4, z: 4.6, w: 20.8, d: 1.05 },
      { x: 12.6, z: 3.0, w: 1.1, d: 6.1 },
    ],
    rooms: [
      room("earth", "지구과학 실험실", -12.6, 4.6, 4.0, 2.0, "lab", "과학 실험"),
      rowRoom("prep-3", "준비실", -9.5, 4.6, 1.4, "lab", "실험 준비"),
      room("physics", "물리실험실", -6.8, 4.6, 4.0, 2.0, "lab", "과학 실험"),
      rowRoom("science-lab", "과학 연구실", -3.6, 4.6, 2.0, "teacher", "과학 연구"),
      room("chemistry", "화학실험실", -0.4, 4.6, 4.2, 2.0, "lab", "과학 실험"),
      rowRoom("chem-prep", "화학 준비실", 2.7, 4.6, 1.5, "lab", "실험 준비"),
      rowRoom("reagent", "시약실", 4.3, 4.6, 1.4, "utility", "시약 보관"),
      room("multipurpose-2", "다목적교실2", -7.1, 0.8, 4.1, 2.0, "lab", "다목적 수업"),
      room("counsel-1", "1학년 상담실", -1.9, 0.8, 2.2, 2.0, "support", "상담"),
      room("grade1-office", "1학년 교무실", 1.7, 0.8, 3.8, 2.0, "teacher", "1학년 교무"),
      rowRoom("fusion-social", "융합교과실1", -12.6, -2.4, 2.7, "lab", "사회"),
      classRoom("1-8", -9.9, -2.4, "1학년 교실"),
      classRoom("1-7", -7.4, -2.4, "1학년 교실"),
      classRoom("1-6", -4.9, -2.4, "1학년 교실"),
      rowRoom("self-2", "자기주도 학습실2", -2.3, -2.4, 2.1, "support", "자기주도 학습"),
      classRoom("1-5", 0.0, -2.4, "1학년 교실"),
      classRoom("1-4", 2.5, -2.4, "1학년 교실"),
      classRoom("1-3", 5.0, -2.4, "1학년 교실"),
      classRoom("1-2", 7.5, -2.4, "1학년 교실"),
      classRoom("1-1", 10.0, -2.4, "1학년 교실"),
      room("bio", "생명과학 실험실", 12.6, 2.4, 2.4, 3.3, "lab", "과학 실험"),
      room("rest-3", "화장실", 12.6, 5.5, 2.4, 1.6, "utility", "편의시설"),
    ],
  },
  "4": {
    title: "4층",
    start: { x: 15.0, z: -2.8, name: "4층 계단" },
    corridors: [
      { x: 0.0, z: -0.2, w: 31.0, d: 1.05 },
      { x: 5.5, z: 3.2, w: 1.25, d: 6.9 },
      { x: -4.7, z: 4.7, w: 19.0, d: 1.05 },
      { x: 12.7, z: 3.1, w: 1.1, d: 6.0 },
    ],
    rooms: [
      room("hanbyeol-study", "한별 스터디룸", -9.7, 6.1, 8.0, 2.0, "support", "스터디"),
      rowRoom("autonomy-3", "자기주도 학습실3", -3.2, 4.8, 2.5, "support", "자기주도 학습"),
      rowRoom("fusion-korean", "융합교과실5", -0.4, 4.8, 2.4, "lab", "국어"),
      rowRoom("fusion-english", "융합교과실6", 2.2, 4.8, 2.4, "lab", "영어"),
      room("multipurpose-3", "다목적교실3", -9.2, 0.8, 4.1, 2.0, "lab", "다목적 수업"),
      room("grade3-counsel", "3학년 상담실", -3.0, 0.8, 2.2, 2.0, "support", "상담"),
      room("grade3-office", "3학년 교무실", 0.7, 0.8, 4.0, 2.0, "teacher", "3학년 교무"),
      rowRoom("fusion-2", "융합교과실2", -12.7, -2.4, 2.8, "lab", "통합"),
      rowRoom("fusion-3", "융합교과실3", -9.9, -2.4, 2.8, "lab", "통합"),
      classRoom("3-7", -7.0, -2.4, "3학년 교실"),
      classRoom("3-6", -4.5, -2.4, "3학년 교실"),
      classRoom("3-5", -2.0, -2.4, "3학년 교실"),
      rowRoom("fusion-math", "융합교과실4", 0.5, -2.4, 2.3, "lab", "수학"),
      classRoom("3-4", 3.0, -2.4, "3학년 교실"),
      classRoom("3-3", 5.5, -2.4, "3학년 교실"),
      classRoom("3-2", 8.0, -2.4, "3학년 교실"),
      classRoom("3-1", 10.5, -2.4, "3학년 교실"),
      room("music", "음악실", 12.7, 3.6, 2.4, 3.0, "lab", "음악"),
      room("music-research", "음악 연구실", 12.7, 6.2, 2.4, 1.6, "teacher", "음악 연구"),
      room("rest-4", "화장실", 12.7, 8.0, 2.4, 1.5, "utility", "편의시설"),
    ],
  },
  annex: {
    title: "부속",
    start: { x: -5.8, z: 1.6, name: "한별마루 입구" },
    corridors: [
      { x: -4.8, z: 1.0, w: 9.2, d: 1.05 },
      { x: 7.0, z: 0.2, w: 7.5, d: 1.05 },
    ],
    rooms: [
      room("cafeteria", "한별마루 1층 급식실", -6.5, 3.1, 7.3, 2.4, "hall", "급식"),
      room("fitness", "한별마루 2층 체력단련실", -7.2, 0.0, 5.2, 2.3, "hall", "체력단련"),
      room("student-council", "학생회 대의원실", -2.8, 0.0, 3.4, 2.3, "support", "학생자치"),
      room("lecture", "강의실 201-204", 1.0, 0.0, 3.6, 2.3, "classroom", "강의"),
      room("dance", "한별마루 3층 무용실", -7.2, -3.1, 5.2, 2.3, "hall", "무용"),
      room("staff-rest", "공무직 쉼터", -2.8, -3.1, 3.4, 2.3, "support", "휴게"),
      room("gym", "한별관 체육공간", 7.8, 1.6, 6.2, 2.5, "hall", "체육"),
      room("pe-office", "체육교사실", 7.8, -1.1, 4.3, 2.0, "teacher", "체육 교무"),
      room("shower", "샤워장", 11.2, -1.1, 2.1, 2.0, "utility", "샤워"),
    ],
  },
};

const agenda = [
  { roomId: "1-1", floor: "3", status: "진행", title: "1학년 학급 활동", host: "1학년부", time: "09:00 - 09:50" },
  { roomId: "2-4", floor: "2", status: "예정", title: "2학년 협의", host: "2학년부", time: "10:10 - 10:50" },
  { roomId: "chemistry", floor: "3", status: "점검", title: "화학실험실 기자재 확인", host: "과학부", time: "13:20 - 14:00" },
  { roomId: "meeting", floor: "1", status: "예정", title: "운영 회의", host: "행정실", time: "15:30 - 16:10" },
];

const studentExamData = [
  {
    name: "김민준",
    group: "1학년 1반",
    number: "05",
    exams: [
      exam("국어", "1교시", "09:00 - 09:50", "1-1", "3", "12번"),
      exam("통합사회", "2교시", "10:10 - 11:00", "1-4", "3", "18번"),
      exam("과학", "4교시", "13:20 - 14:10", "chemistry", "3", "7번"),
    ],
  },
  {
    name: "이서연",
    group: "2학년 4반",
    number: "11",
    exams: [
      exam("문학", "1교시", "09:00 - 09:50", "2-4", "2", "3번"),
      exam("수학I", "2교시", "10:10 - 11:00", "2-1", "2", "21번"),
      exam("영어", "4교시", "13:20 - 14:10", "broadcast", "2", "9번"),
    ],
  },
  {
    name: "박지훈",
    group: "3학년 6반",
    number: "17",
    exams: [
      exam("화법과 작문", "1교시", "09:00 - 09:50", "3-6", "4", "16번"),
      exam("미적분", "2교시", "10:10 - 11:00", "3-2", "4", "4번"),
      exam("음악 감상", "4교시", "13:20 - 14:10", "music", "4", "10번"),
    ],
  },
  {
    name: "최하윤",
    group: "1학년 8반",
    number: "02",
    exams: [
      exam("한국사", "1교시", "09:00 - 09:50", "1-8", "3", "5번"),
      exam("영어", "2교시", "10:10 - 11:00", "multipurpose-2", "3", "14번"),
      exam("정보", "4교시", "13:20 - 14:10", "computer", "2", "20번"),
    ],
  },
];

let renderer;
let scene;
let camera;
let mapRoot;
let routeLine;
let selectedMesh = null;
let activeFloor = "1";
let hoveredMesh = null;
let isDragging = false;
let didDrag = false;
let lastPointer = { x: 0, y: 0 };
let view = { ...HOME_CAMERA };
let raycaster;
let pointer;
const meshesById = new Map();
const labels = [];

function room(id, name, x, z, w, d, type, use) {
  return { id, name, x, z, w, d, type, use };
}

function rowRoom(id, name, x, z, w, type, use) {
  return room(id, name, x, z, w, 2.0, type, use);
}

function classRoom(name, x, z, use) {
  return room(name, name, x, z, 2.25, 2.0, "classroom", use);
}

function exam(subject, period, time, roomId, floor, seat) {
  return { subject, period, time, roomId, floor, seat };
}

function init() {
  if (!window.THREE) {
    fallback.hidden = false;
    return;
  }

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3f6f7);

  camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
  scene.add(camera);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x9ba8ad, 1.65);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.05);
  sun.position.set(-7, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  mapRoot = new THREE.Group();
  mapRoot.rotation.y = ROOT_ROTATION;
  scene.add(mapRoot);

  bindEvents();
  renderAgenda();
  buildFloor(activeFloor);
  renderStudentSearch();
  resize();
  animate();
}

function bindEvents() {
  window.addEventListener("resize", resize);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  floorButtons.forEach((button) => {
    button.addEventListener("click", () => setFloor(button.dataset.floor));
  });

  studentSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showStudentResult(studentSearchInput.value);
  });

  sideTabButtons.forEach((button) => {
    button.addEventListener("click", () => setSidePanel(button.dataset.sideTab));
  });

  homeViewButton.addEventListener("click", () => {
    view = { ...HOME_CAMERA };
    applyCamera();
  });
  zoomInButton.addEventListener("click", () => setZoom(view.zoom * 1.12));
  zoomOutButton.addEventListener("click", () => setZoom(view.zoom / 1.12));
}

function buildFloor(floorKey) {
  clearMap();

  const floor = floorData[floorKey];
  const bounds = getFloorBounds(floor);
  const base = createBase(bounds);
  mapRoot.add(base);

  for (const corridor of floor.corridors) {
    mapRoot.add(createBox(corridor, 0.055, 0xdce5e8, 0xffffff, false, 0.02));
  }

  for (const space of floor.rooms) {
    const mesh = createRoomMesh(space);
    mapRoot.add(mesh);
    meshesById.set(space.id, mesh);

    if (shouldLabel(space)) {
      const label = createLabel(space.name, space.w);
      label.position.set(space.x, ROOM_HEIGHT + 0.38, space.z);
      mapRoot.add(label);
      labels.push(label);
    }
  }

  createStairsAndMarkers(floor);
  selectedFloorEl.textContent = floor.title;
  currentLocationEl.textContent = floor.start.name;
}

function clearMap() {
  while (mapRoot.children.length) {
    disposeObject(mapRoot.children[0]);
    mapRoot.remove(mapRoot.children[0]);
  }
  meshesById.clear();
  labels.length = 0;
  selectedMesh = null;
  hoveredMesh = null;
  routeLine = null;
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(child.material);
      }
    }
  });
}

function disposeMaterial(material) {
  if (material.map) material.map.dispose();
  material.dispose();
}

function createBase(bounds) {
  const width = bounds.maxX - bounds.minX + 2.8;
  const depth = bounds.maxZ - bounds.minZ + 2.8;
  const shape = new THREE.Shape();
  const radius = 0.35;
  const x = bounds.minX - 1.4;
  const z = bounds.minZ - 1.4;

  shape.moveTo(x + radius, z);
  shape.lineTo(x + width - radius, z);
  shape.quadraticCurveTo(x + width, z, x + width, z + radius);
  shape.lineTo(x + width, z + depth - radius);
  shape.quadraticCurveTo(x + width, z + depth, x + width - radius, z + depth);
  shape.lineTo(x + radius, z + depth);
  shape.quadraticCurveTo(x, z + depth, x, z + depth - radius);
  shape.lineTo(x, z + radius);
  shape.quadraticCurveTo(x, z, x + radius, z);

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false });
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, -0.16, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xf8faf9,
    roughness: 0.82,
    metalness: 0.02,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function createRoomMesh(space) {
  const mesh = createBox(space, ROOM_HEIGHT, roomColors[space.type], 0xffffff, true, 0.04);
  mesh.userData.room = space;

  const edgeGeometry = new THREE.EdgesGeometry(mesh.geometry);
  const edges = new THREE.LineSegments(
    edgeGeometry,
    new THREE.LineBasicMaterial({ color: 0x9eabb1, transparent: true, opacity: 0.56 })
  );
  mesh.add(edges);

  const door = createDoor(space);
  mesh.add(door);

  return mesh;
}

function createBox(space, height, color, emissive, castsShadow, yOffset) {
  const geometry = new THREE.BoxGeometry(space.w, height, space.d);
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: 0.02,
    roughness: 0.78,
    metalness: 0.03,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(space.x, height / 2 + yOffset, space.z);
  mesh.castShadow = castsShadow;
  mesh.receiveShadow = true;
  return mesh;
}

function createDoor(space) {
  const doorWidth = Math.min(0.75, Math.max(0.42, space.w * 0.32));
  const geometry = new THREE.BoxGeometry(doorWidth, 0.035, 0.075);
  const material = new THREE.MeshStandardMaterial({
    color: 0x9bdad4,
    roughness: 0.5,
    metalness: 0.02,
  });
  const door = new THREE.Mesh(geometry, material);
  door.position.set(0, ROOM_HEIGHT / 2 + 0.023, -space.d / 2 - 0.015);
  return door;
}

function createStairsAndMarkers(floor) {
  const startMarker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.12, 32),
    new THREE.MeshStandardMaterial({ color: 0xce842c, roughness: 0.48 })
  );
  startMarker.position.set(floor.start.x, 0.22, floor.start.z);
  startMarker.castShadow = true;
  mapRoot.add(startMarker);

  const rings = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.035, 8, 36),
    new THREE.MeshBasicMaterial({ color: 0xce842c })
  );
  rings.rotation.x = Math.PI / 2;
  rings.position.set(floor.start.x, 0.3, floor.start.z);
  mapRoot.add(rings);
}

function shouldLabel(space) {
  if (space.type === "utility" && space.w < 2.4) return false;
  return space.w >= 1.9 || /^\d-\d$/.test(space.name);
}

function createLabel(text, roomWidth) {
  const canvasLabel = document.createElement("canvas");
  const ctx = canvasLabel.getContext("2d");
  const isShortLabel = /^\d-\d$/.test(text);
  canvasLabel.width = 448;
  canvasLabel.height = 176;
  ctx.clearRect(0, 0, canvasLabel.width, canvasLabel.height);
  ctx.shadowColor = "rgba(28, 47, 56, 0.18)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  roundRect(ctx, 22, 38, 404, 100, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(174, 190, 197, 0.72)";
  ctx.lineWidth = 3;
  roundRect(ctx, 22, 38, 404, 100, 18);
  ctx.stroke();
  ctx.fillStyle = "#17232b";
  ctx.font = isShortLabel ? "900 54px Malgun Gothic, sans-serif" : "900 46px Malgun Gothic, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  wrapCanvasText(ctx, text, 224, 88, 352, 48);

  const texture = new THREE.CanvasTexture(canvasLabel);
  texture.anisotropy = 4;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  const scale = isShortLabel
    ? Math.min(3.05, Math.max(2.45, roomWidth * 1.05))
    : Math.min(5.2, Math.max(2.65, roomWidth * 1.02));
  sprite.scale.set(scale, scale * 0.42, 1);
  sprite.renderOrder = 10;
  return sprite;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const compact = text.replace(/\s+/g, " ");
  if (ctx.measureText(compact).width <= maxWidth) {
    ctx.fillText(compact, x, y);
    return;
  }

  const parts = compact.split(" ");
  if (parts.length === 1) {
    ctx.font = "900 40px Malgun Gothic, sans-serif";
    ctx.fillText(compact, x, y);
    return;
  }

  const lines = [];
  let line = "";
  for (const part of parts) {
    const test = line ? `${line} ${part}` : part;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = part;
    } else {
      line = test;
    }
  }
  lines.push(line);

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.slice(0, 2).forEach((item, index) => ctx.fillText(item, x, startY + index * lineHeight));
}

function getFloorBounds(floor) {
  const items = [...floor.rooms, ...floor.corridors];
  return items.reduce(
    (bounds, item) => ({
      minX: Math.min(bounds.minX, item.x - item.w / 2),
      maxX: Math.max(bounds.maxX, item.x + item.w / 2),
      minZ: Math.min(bounds.minZ, item.z - item.d / 2),
      maxZ: Math.max(bounds.maxZ, item.z + item.d / 2),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity }
  );
}

function setFloor(floorKey) {
  if (activeFloor === floorKey) return;
  activeFloor = floorKey;
  floorButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.floor === floorKey);
  });
  buildFloor(floorKey);

  const defaultRoom = floorData[floorKey].rooms.find((item) => item.type !== "utility")?.id;
  selectRoom(defaultRoom, { changeFloor: false });
}

function selectRoom(roomId, options = { changeFloor: true }) {
  const located = findRoom(roomId);
  if (!located) return;

  if (options.changeFloor && located.floorKey !== activeFloor) {
    activeFloor = located.floorKey;
    floorButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.floor === activeFloor);
    });
    buildFloor(activeFloor);
  }

  const mesh = meshesById.get(roomId);
  if (!mesh) return;

  if (selectedMesh) restoreMesh(selectedMesh);
  selectedMesh = mesh;
  mesh.material.color.set(roomColors.selected);
  mesh.material.emissive.set(0x0f4c81);
  mesh.material.emissiveIntensity = 0.1;

  updateInfo(located.room, floorData[activeFloor]);
  updateRoute(located.room, floorData[activeFloor]);
  updateAgendaState(roomId);
}

function restoreMesh(mesh) {
  const roomInfo = mesh.userData.room;
  mesh.material.color.set(roomColors[roomInfo.type]);
  mesh.material.emissive.set(0xffffff);
  mesh.material.emissiveIntensity = 0.02;
}

function findRoom(roomId) {
  for (const [floorKey, floor] of Object.entries(floorData)) {
    const found = floor.rooms.find((item) => item.id === roomId);
    if (found) return { floorKey, room: found };
  }
  return null;
}

function updateInfo(space, floor) {
  selectedFloorEl.textContent = floor.title;
  roomNameEl.textContent = space.name;
  roomZoneEl.textContent = `${floor.title} ${space.type === "hall" ? "공용 구역" : "교실 구역"}`;
  roomUseEl.textContent = space.use || typeLabels[space.type];
  roomRouteEl.textContent = `${floor.start.name} → ${space.name}`;
}

function updateRoute(space, floor) {
  if (routeLine) {
    disposeObject(routeLine);
    mapRoot.remove(routeLine);
  }

  const midZ = floor.start.z + (space.z - floor.start.z) * 0.55;
  const points = [
    new THREE.Vector3(floor.start.x, 0.5, floor.start.z),
    new THREE.Vector3(floor.start.x, 0.5, midZ),
    new THREE.Vector3(space.x, 0.5, midZ),
    new THREE.Vector3(space.x, 0.5, space.z),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color: 0x0c9a86,
    dashSize: 0.38,
    gapSize: 0.18,
    linewidth: 2,
  });
  routeLine = new THREE.Line(geometry, material);
  routeLine.computeLineDistances();
  routeLine.renderOrder = 9;
  mapRoot.add(routeLine);
}

function setSidePanel(panelKey) {
  sideTabButtons.forEach((button) => {
    const isActive = button.dataset.sideTab === panelKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  sidePanels.forEach((panel) => {
    panel.hidden = panel.dataset.sidePanel !== panelKey;
  });
}

function renderStudentSearch() {
  quickStudentsEl.innerHTML = "";
  for (const student of studentExamData) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = student.name;
    button.addEventListener("click", () => {
      studentSearchInput.value = student.name;
      showStudentResult(student.name);
    });
    quickStudentsEl.append(button);
  }

  showStudentResult(studentExamData[0].name);
}

function showStudentResult(rawName) {
  setSidePanel("lookup");
  const query = rawName.trim();
  if (!query) {
    lookupMessageEl.textContent = "이름을 입력하면 오늘 시험과 시험실이 표시됩니다.";
    studentResultEl.innerHTML = "";
    return;
  }

  const matches = studentExamData.filter((student) => student.name.includes(query));
  const student = matches.find((item) => item.name === query) || matches[0];

  if (!student) {
    lookupMessageEl.textContent = `"${query}" 학생을 찾지 못했습니다. 샘플 이름으로 다시 검색해 보세요.`;
    studentResultEl.innerHTML = "";
    return;
  }

  studentSearchInput.value = student.name;
  lookupMessageEl.textContent = `${student.name} 학생의 오늘 시험 ${student.exams.length}건을 찾았습니다.`;
  studentResultEl.innerHTML = `
    <div class="student-summary">
      <strong>${escapeHtml(student.name)}</strong>
      <span>${escapeHtml(student.group)} · ${escapeHtml(student.number)}번</span>
    </div>
    <div class="exam-list"></div>
  `;

  const examList = studentResultEl.querySelector(".exam-list");
  for (const item of student.exams) {
    const located = findRoom(item.roomId);
    const button = document.createElement("button");
    button.className = "exam-item";
    button.type = "button";
    button.dataset.roomId = item.roomId;
    button.innerHTML = `
      <strong>${escapeHtml(item.subject)}</strong>
      <em>${escapeHtml(item.period)}</em>
      <span>${escapeHtml(item.time)}</span>
      <span>${escapeHtml(located?.room.name || item.roomId)} · ${escapeHtml(floorData[item.floor].title)} · 좌석 ${escapeHtml(item.seat)}</span>
    `;
    button.addEventListener("click", () => selectRoom(item.roomId, { changeFloor: true }));
    examList.append(button);
  }

  selectRoom(student.exams[0].roomId, { changeFloor: true });
}

function renderAgenda() {
  agendaCountEl.textContent = String(agenda.length);
  agendaListEl.innerHTML = "";

  for (const item of agenda) {
    const located = findRoom(item.roomId);
    const button = document.createElement("button");
    button.className = "agenda-item";
    button.type = "button";
    button.dataset.roomId = item.roomId;
    button.dataset.status = item.status;
    button.innerHTML = `
      <strong>${escapeHtml(item.title)}</strong>
      <em>${escapeHtml(item.status)}</em>
      <span>${escapeHtml(located?.room.name || item.roomId)} · ${escapeHtml(floorData[item.floor].title)}</span>
      <span>${escapeHtml(item.time)}</span>
    `;
    button.addEventListener("click", () => {
      selectRoom(item.roomId, { changeFloor: true });
      setSidePanel("space");
    });
    agendaListEl.append(button);
  }
}

function updateAgendaState(roomId) {
  document.querySelectorAll(".agenda-item, .exam-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.roomId === roomId);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function onPointerDown(event) {
  isDragging = true;
  didDrag = false;
  lastPointer = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (isDragging) {
    const dx = event.clientX - lastPointer.x;
    const dy = event.clientY - lastPointer.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) didDrag = true;
    view.rotY += dx * 0.006;
    view.rotX = clamp(view.rotX + dy * 0.004, -1.45, -0.62);
    lastPointer = { x: event.clientX, y: event.clientY };
    applyCamera();
    return;
  }

  const hit = pickRoom(event);
  if (hit !== hoveredMesh) {
    hoveredMesh = hit;
    canvas.style.cursor = hit ? "pointer" : "grab";
  }
}

function onPointerUp(event) {
  if (!isDragging) return;
  isDragging = false;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture can already be released on some touch browsers.
  }

  if (!didDrag) {
    const hit = pickRoom(event);
    if (hit?.userData.room) {
      selectRoom(hit.userData.room.id, { changeFloor: false });
      setSidePanel("space");
    }
  }
}

function onWheel(event) {
  event.preventDefault();
  const factor = event.deltaY > 0 ? 0.92 : 1.08;
  setZoom(view.zoom * factor);
}

function pickRoom(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects([...meshesById.values()], false);
  return intersects[0]?.object || null;
}

function setZoom(value) {
  view.zoom = clamp(value, 0.72, 2.6);
  applyCamera();
}

function applyCamera() {
  const radius = 48;
  const horizontal = Math.cos(view.rotX) * radius;
  camera.position.set(
    Math.sin(view.rotY) * horizontal,
    Math.sin(-view.rotX) * radius,
    Math.cos(view.rotY) * horizontal
  );
  camera.lookAt(0, 0, 0);
  camera.zoom = view.zoom;
  camera.updateProjectionMatrix();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height, false);

  const aspect = width / height;
  const frustum = 30;
  camera.left = (-frustum * aspect) / 2;
  camera.right = (frustum * aspect) / 2;
  camera.top = frustum / 2;
  camera.bottom = -frustum / 2;
  applyCamera();
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;
  if (routeLine) routeLine.material.dashOffset = -time * 0.35;
  for (const label of labels) {
    label.quaternion.copy(camera.quaternion);
  }

  renderer.render(scene, camera);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

init();
