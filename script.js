/* eslint-disable no-alert */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;

const nameFragments = [
  "기",
  "르",
  "크",
  "마",
  "빈",
  "터",
  "빅",
  "워",
  "일",
  "리",
  "아",
  "어",
  "이",
  "렐",
  "비",
  "루",
  "로",
  "라",
  "메",
  "모",
  "몰",
  "바",
  "칸",
  "켄",
  "세",
  "스",
  "탄",
  "벨",
  "말",
  "파",
  "트",
  "겐",
  "즈",
  "조",
  "얼",
  "슈",
  "멘",
  "타",
  "커",
  "소",
  "수",
  "키",
  "페",
  "무",
  "벡",
  "잔",
  "슨",
  "센",
  "자",
  "지",
  "보",
  "레",
  "넌",
  "리엘",
  "론",
  "릴",
  "렘",
  "렌",
  "링",
  "로스",
  "룬",
  "라크",
  "라스",
  "로크",
  "루크",
  "람",
  "란",
  "리안",
  "레온",
  "로안",
  "리스",
  "로드",
  "라일",
  "랑",
  "렉",
  "르크",
  "룩",
  "렉스",
  "르스",
  "린",
  "렌",
  "림",
  "룸",
  "렁",
  "발",
  "벅",
  "벱",
  "벡",
  "브렌",
  "봄",
  "볼",
  "반",
  "벼",
  "벽",
  "바스",
  "브락",
  "브롤",
  "백스",
  "보르",
  "벤",
  "베온",
  "비엘",
  "보안",
  "브락스",
  "브론",
  "브릭",
  "브렉",
  "빈트",
  "빌",
  "벨",
  "벨크",
  "잔",
  "젠",
  "족",
  "제르",
  "조안",
  "증",
  "진스",
  "젤",
  "조크",
  "줄",
  "존",
  "젠트",
  "족스",
  "잘",
  "즈렌",
  "제바",
  "제온",
  "제프",
  "조알",
  "칸",
  "켄",
  "켈",
  "킨",
  "킥",
  "크스",
  "캘",
  "캔",
  "케프",
  "코르",
  "콜",
  "콕",
  "콩",
  "칼",
  "카브",
  "컥",
  "큼",
  "쿠르",
  "켄트",
  "칵",
  "켁",
  "켐",
  "콘",
  "케온",
  "콘스",
  "콕스",
  "콘트",
  "탈",
  "텐",
  "톤",
  "틸",
  "틱",
  "트스",
  "텔",
  "테프",
  "톡",
  "톨",
  "톤스",
  "타르",
  "토브",
  "티엔",
  "택스",
  "타크",
  "텐트",
  "톨크",
  "타브",
  "파",
  "펜",
  "폴",
  "픽",
  "프렌",
  "판",
  "팔",
  "포르",
  "패스",
  "포익",
  "폴트",
  "팩스",
  "팜",
  "프릴",
  "포안",
  "프록",
  "멘",
  "먼",
  "멜",
  "몬",
  "몰",
  "맥",
  "맨",
  "맘",
  "믄",
  "멘스",
  "멜크",
  "멘트",
  "슈",
  "실",
  "셀",
  "숀",
  "숀트",
  "속",
  "스크",
  "스텔",
  "스탄",
  "스록",
  "스몬",
  "스브",
  "스렌",
  "스톤",
  "커",
  "켠",
  "켜",
  "케르",
  "코스",
  "컽",
  "케온",
  "컬크",
  "켈트",
  "커브",
  "컨트",
  "케브",
  "콘트",
  "쿠스",
  "겔",
  "겐",
  "글",
  "고르",
  "그렌",
  "그렉",
  "골트",
  "그란",
  "델",
  "던",
  "돌",
  "닐",
  "님",
  "넨",
  "넬",
  "닉",
  "네프",
  "논",
  "넥스",
  "낙",
  "낟",
  "낚",
  "워",
  "위엘",
  "윈",
  "웬",
  "웰",
  "원",
  "웅",
  "웁",
  "웁스",
];
const tribes = ["인간", "짐승", "기계", "정령", "괴물", "저주"];
const contractPool = [
  {
    name: "피의 서약",
    buff: "아군 피해 +20%",
    debuff: "모든 뱅가드 최대 체력 -10%",
    apply(stateRef) {
      stateRef.contractEffects.allyDamage += 0.2;
      adjustAlliesHp(stateRef, 0.9);
    },
  },
  {
    name: "집념의 서약",
    buff: "크리티컬 확률 +10%",
    debuff: "택틱 비용 +20%",
    apply(stateRef) {
      stateRef.contractEffects.allyCrit += 0.1;
      stateRef.contractEffects.tacticCostMult *= 1.2;
    },
  },
  {
    name: "돌격의 서약",
    buff: "최전방 뱅가드 피해 +25%",
    debuff: "이동 비용 +2",
    apply(stateRef) {
      stateRef.contractEffects.frontDamage += 0.25;
      stateRef.contractEffects.moveCostFlat += 2;
    },
  },
  {
    name: "인내의 서약",
    buff: "적이 주는 피해 -15%",
    debuff: "획득 자금 -10%",
    apply(stateRef) {
      stateRef.contractEffects.enemyDamageTaken -= 0.15;
      stateRef.contractEffects.rewardMult *= 0.9;
    },
  },
  {
    name: "도박사의 서약",
    buff: "초기 소환 카드 비용 -15%",
    debuff: "재소환 비용 +1",
    apply(stateRef) {
      stateRef.contractEffects.shopCostMult *= 0.85;
      stateRef.contractEffects.rerollFlat += 1;
    },
  },
];
const keywords = {
  전사의심장: (unit) => (unit.hp <= unit.maxHp / 2 ? { atk: 0.2 } : {}),
  마법의심장: (unit) => (unit.hp <= unit.maxHp / 2 ? { satk: 0.2 } : {}),
  끈질김: (unit) => (unit.hp <= 0 ? { survive: true } : {}),
  부활: () => ({ revive: true }),
  보스슬레이어: () => ({ bossBonus: 0.2 }),
  미니언슬레이어: () => ({ normalBonus: 0.2 }),
  천상의보호막: () => ({ shieldChance: 0.15 }),
  회복술사: () => ({ healOnEnd: 4 }),
};

const keywordDescriptions = {
  전사의심장: "체력이 절반 이하일 때 물리 공격력이 상승합니다.",
  마법의심장: "체력이 절반 이하일 때 특수 공격력이 상승합니다.",
  끈질김: "치명 피해를 받아도 한 번은 체력 1로 생존합니다.",
  부활: "처치 시 게이트로 돌아옵니다.",
  보스슬레이어: "보스에게 주는 피해가 증가합니다.",
  미니언슬레이어: "일반 엔티티에게 주는 피해가 증가합니다.",
  천상의보호막: "피해를 무시할 확률이 있습니다.",
  회복술사: "턴 종료 시 사거리 내 아군을 회복합니다.",
};

const tacticCards = [
  { name: "밴드", type: "tactic", cost: 5, text: "체력 25% 회복", target: "ally", effect: (state, target) => healOne(state, 0.25, target) },
  { name: "메드킷", type: "tactic", cost: 10, text: "체력 50% 회복", target: "ally", effect: (state, target) => healOne(state, 0.5, target) },
  { name: "신의눈물", type: "tactic", cost: 15, text: "체력 모두 회복", target: "ally", effect: (state, target) => healOne(state, 1, target) },
  { name: "고무", type: "tactic", cost: 20, text: "턴 동안 피해 +20%", effect: (state) => (state.turnBuff.damage += 0.2) },
  { name: "파이어볼", type: "tactic", cost: 25, text: "엔티티 체력 20% 피해", target: "enemy", effect: (state, target) => damageEntity(state, 0.2, target) },
  { name: "자극제", type: "tactic", cost: 15, text: "한 뱅가드 피해 +100%", target: "ally", effect: (state, target) => buffOne(state, 1.0, target) },
  { name: "에너지가드", type: "tactic", cost: 30, text: "최전방 무적", effect: (state) => (state.turnBuff.shieldFront = true) },
  { name: "약점파악", type: "tactic", cost: 15, text: "크리티컬 확률 +20%", effect: (state) => (state.turnBuff.crit += 0.2) },
  { name: "승리의함성", type: "tactic", cost: 40, text: "스테이지 피해 +20%", effect: (state) => (state.stageBuff.damage += 0.2) },
];

const keywordCardsPool = [
  "전사의심장",
  "마법의심장",
  "끈질김",
  "보스슬레이어",
  "미니언슬레이어",
  "천상의보호막",
  "회복술사",
];

const state = {
  mode: null,
  money: 120,
  stage: 1,
  stageInCycle: 1,
  cyclesCompleted: 0,
  bossClearedCount: 0,
  restStage: false,
  board: Array(9).fill(null),
  gate: [],
  keywordCards: [],
  contracts: [],
  contractChoices: [],
  shopCards: [],
  rerollCost: 5,
  records: [],
  initialVanguardNeeded: true,
  shopPicked: false,
  shopTaken: new Set(),
  turnBuff: { damage: 0, crit: 0, shieldFront: false },
  stageBuff: { damage: 0 },
  entity: null,
  currentTargets: [],
  nextTargets: [],
  pendingSpawn: false,
  selectedKeyword: null,
  selectedGateCard: null,
  contractEffects: {
    allyDamage: 0,
    allyCrit: 0,
    frontDamage: 0,
    enemyDamageTaken: 0,
    moveCostFlat: 0,
    tacticCostMult: 1,
    rewardMult: 1,
    shopCostMult: 1,
    rerollFlat: 0,
  },
};

let activeSacrificeButton = null;
let draggedCard = null;
let dragOriginIdx = null;
let dragAvatar = null;
let turnTimerId = null;
let turnTimerRemaining = 0;
const TURN_TIME = 34;

const elements = [
  { key: "fire", label: "화염", color: "#ef4444" },
  { key: "ice", label: "서리", color: "#38bdf8" },
  { key: "void", label: "공허", color: "#8b5cf6" },
  { key: "stone", label: "대지", color: "#10b981" },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lerpStat(stage, low, high, maxStage = 80) {
  const clamped = Math.min(stage, maxStage);
  const t = Math.pow((clamped - 1) / Math.max(1, maxStage - 1), 2);
  return Math.max(1, Math.round(low + (high - low) * t));
}

let fxLayer = null;
function getFxLayer() {
  if (!fxLayer) {
    fxLayer = document.createElement("div");
    fxLayer.id = "fx-layer";
    document.body.appendChild(fxLayer);
  }
  return fxLayer;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCenter(el) {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function screenShake(intensity = 6, duration = 220) {
  const layer = getFxLayer();
  layer.classList.add("shake");
  layer.style.setProperty("--shake-intensity", `${intensity}px`);
  setTimeout(() => layer.classList.remove("shake"), duration);
}

function spawnExplosion(point, { strong = false, color = "#38bdf8" } = {}) {
  const layer = getFxLayer();
  const boom = document.createElement("div");
  boom.className = `explosion ${strong ? "strong" : ""}`;
  boom.style.left = `${point.x}px`;
  boom.style.top = `${point.y}px`;
  boom.style.setProperty("--explosion-color", color);
  layer.appendChild(boom);
  setTimeout(() => boom.remove(), strong ? 900 : 500);
}

function showDamageNumber(point, text, tone = "hit") {
  const layer = getFxLayer();
  const num = document.createElement("div");
  num.className = `damage-number ${tone}`;
  num.textContent = text;
  num.style.left = `${point.x}px`;
  num.style.top = `${point.y}px`;
  layer.appendChild(num);
  setTimeout(() => num.remove(), 1000);
}

function animateLaser(fromEl, toEl, { color = "#38bdf8", crit = false } = {}) {
  return new Promise((resolve) => {
    const layer = getFxLayer();
    const from = getCenter(fromEl);
    const to = getCenter(toEl);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const beam = document.createElement("div");
    beam.className = `laser-beam ${crit ? "crit" : ""}`;
    beam.style.setProperty("--laser-color", color);
    beam.style.width = `${dist}px`;
    beam.style.transform = `translate(${from.x}px, ${from.y}px) rotate(${angle}deg) scaleX(0)`;
    layer.appendChild(beam);
    requestAnimationFrame(() => {
      beam.style.transform = `translate(${from.x}px, ${from.y}px) rotate(${angle}deg) scaleX(1)`;
    });
    setTimeout(() => {
      beam.remove();
      spawnExplosion(to, { strong: crit, color });
      resolve();
    }, 220);
  });
}

function ceilStats(unit) {
  ["hp", "maxHp", "atk", "def", "satk", "sdef", "cost"].forEach((k) => {
    if (unit[k] !== undefined) unit[k] = Math.ceil(unit[k]);
  });
  return unit;
}

function randomName(type = "ally") {
  const len =
    type === "enemy"
      ? rand(4, 6)
      : Math.random() < 0.7
      ? 2
      : rand(1, 2);
  let name = "";
  for (let i = 0; i < len; i++) name += nameFragments[rand(0, nameFragments.length - 1)];
  return name.slice(0, 7);
}

function randomTribe() {
  const count = Math.random() < 0.12 ? 2 : 1;
  const shuffled = [...tribes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function adjustAlliesHp(stateRef, multiplier) {
  const apply = (unit) => {
    const newMax = Math.max(1, Math.ceil(unit.maxHp * multiplier));
    unit.maxHp = newMax;
    unit.hp = Math.min(unit.hp, newMax);
  };
  stateRef.board.filter(Boolean).forEach(apply);
  stateRef.gate.filter(Boolean).forEach(apply);
}

function rollKeywords() {
  const list = Object.keys(keywords);
  const count = Math.random() < 0.25 ? 2 : Math.random() < 0.6 ? 1 : 0;
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function createVanguard(stage, guaranteedKeyword) {
  const variance = 0.9 + Math.random() * 0.25;
  const hpBase = lerpStat(stage, rand(4, 8), rand(9000, 10500)) * variance;
  const atkBase = lerpStat(stage, rand(2, 5), rand(4200, 5200)) * variance;
  const satkBase = lerpStat(stage, rand(2, 5), rand(4200, 5200)) * variance;
  const defBase = lerpStat(stage, rand(1, 4), rand(2800, 3600)) * variance;
  const sdefBase = lerpStat(stage, rand(1, 4), rand(2800, 3600)) * variance;
  const unit = {
    id: uuid(),
    type: "vanguard",
    name: randomName("ally"),
    tribes: randomTribe(),
    range: rand(1, 3),
    hp: hpBase,
    maxHp: 0,
    atk: atkBase,
    def: defBase,
    satk: satkBase,
    sdef: sdefBase,
    keywords: rollKeywords(),
    cost: 0,
  };
  if (guaranteedKeyword) unit.keywords.push(guaranteedKeyword);
  unit.maxHp = Math.max(1, Math.ceil(unit.hp));
  unit.hp = unit.maxHp;
  const power =
    unit.hp * 0.08 +
    (unit.atk + unit.satk) * 0.28 +
    (unit.def + unit.sdef) * 0.18 +
    unit.range * 40 +
    unit.keywords.length * 55 +
    stage * 18;
  unit.cost = Math.max(4, Math.ceil(power / 90));
  return ceilStats(unit);
}

function createTactic() {
  const base = tacticCards[rand(0, tacticCards.length - 1)];
  return { ...base, id: uuid(), type: "tactic" };
}

function getTacticCost(card) {
  const stageScale = 1 + state.stage * 0.05;
  return Math.max(2, Math.ceil(card.cost * stageScale * state.contractEffects.tacticCostMult));
}

function getRerollCost() {
  const scaled = (state.rerollCost + state.contractEffects.rerollFlat) * (1 + state.stage * 0.08);
  return Math.max(2, Math.ceil(scaled));
}

function applyShopCost(card) {
  const copy = { ...card };
  copy.cost = Math.max(1, Math.ceil(copy.cost * state.contractEffects.shopCostMult));
  return copy;
}

function createShopCards(forceVanguard = false) {
  let attempts = 0;
  while (attempts < 6) {
    let cards = [];
    let vanguardCount = 0;
    const seen = new Set();
    for (let i = 0; i < 6; i++) {
      const roll = Math.random();
      const isVanguard = roll < 0.6 || (forceVanguard && vanguardCount === 0 && i >= 4);
      const card = isVanguard ? createVanguard(state.stage) : createTactic();
      const key = `${card.type}-${card.name}`;
      if (seen.has(key)) {
        i -= 1;
        continue;
      }
      seen.add(key);
      cards.push(card);
      if (isVanguard) vanguardCount++;
    }

    if (forceVanguard && vanguardCount === 0) {
      attempts++;
      continue;
    }

    const adjusted = cards.map((card) => applyShopCost(card));
    const vanguards = adjusted.filter((c) => c.type === "vanguard");
    if (forceVanguard && vanguards.length) {
      const cheapest = vanguards.slice().sort((a, b) => a.cost - b.cost)[0];
      if (cheapest && cheapest.cost > state.money * 1.8) {
        cheapest.cost = Math.max(1, Math.ceil(state.money * 0.9));
      }
    }

    let filtered = adjusted.filter((card) => (card.type === "tactic" ? true : card.cost <= state.money * 1.8));
    if (forceVanguard && filtered.every((c) => c.type !== "vanguard") && vanguards.length) {
      filtered = [vanguards[0], ...filtered.filter((c) => c.type !== "vanguard")];
    }
    if (filtered.length === 0) filtered = adjusted;
    const affordable = filtered.filter((c) => c.cost <= state.money);
    if (affordable.length === 0) {
      const cheapest = filtered.slice().sort((a, b) => a.cost - b.cost)[0];
      if (cheapest) cheapest.cost = Math.max(1, Math.ceil(Math.max(state.money, cheapest.cost * 0.75)));
    }
    return filtered;
  }
  return [];
}

function renderShop() {
  $("#shop-layer").classList.remove("hidden");
  $("#shop-money").textContent = `$${state.money}`;
  renderCards($("#shop-cards"), state.shopCards, (card) => toggleShopCard(card), {
    selectable: true,
    selectedIds: state.shopTaken,
    clickAny: true,
  });
  const closeBtn = $("#close-shop");
  const pickedVanguardCount = state.shopCards.filter((c) => state.shopTaken.has(c.id) && c.type === "vanguard").length;
  const ownsVanguard =
    pickedVanguardCount > 0 ||
    state.gate.some((c) => c.type === "vanguard") ||
    state.board.some((c) => c && c.type === "vanguard");
  const canLeave = ownsVanguard;
  if (closeBtn) {
    closeBtn.disabled = !canLeave;
  }
}

function pickContracts() {
  const shuffled = [...contractPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function renderContractChoices() {
  const wrap = $("#contract-choices");
  wrap.innerHTML = "";
  state.contractChoices.forEach((c) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "contract-choice";
    el.innerHTML = `<div class="muted">계약</div><div>${c.name}</div><div class="muted">${c.buff}</div><div>${c.debuff}</div>`;
    el.addEventListener("click", () => chooseContract(c));
    wrap.appendChild(el);
  });
}

function openContractModal() {
  state.contractChoices = pickContracts();
  renderContractChoices();
  $("#contract-money").textContent = `$${state.money}`;
  $("#contract-layer").classList.remove("hidden");
}

function closeContractModal() {
  $("#contract-layer").classList.add("hidden");
  state.contractChoices = [];
}

function chooseContract(contract) {
  contract.apply(state);
  state.contracts.push(contract);
  closeContractModal();
  advanceStage();
  render();
}

function renderCards(container, cards, onClick, options = {}) {
  const {
    compact = false,
    draggable = false,
    showCost = true,
    selectable = false,
    selectedId = null,
    selectedIds = null,
    disabledIds = new Set(),
    clickAny = false,
    tacticOnlyClick = false,
  } = options;
  container.innerHTML = "";
  cards.forEach((card) => {
    const display = typeof card === "string" ? { id: card, name: card, type: "keyword", text: "키워드 부여" } : card;
    const selected = (selectedId && display.id === selectedId) || (selectedIds && selectedIds.has(display.id));
    const disabled = disabledIds.has(display.id);
    container.appendChild(
      renderCard(display, () => onClick?.(card), {
        compact,
        draggable,
        showCost,
        selectable,
        selected,
        disabled,
        clickAny,
        tacticOnlyClick,
      })
    );
  });
}

function renderCard(card, onClick, options = {}) {
  const {
    compact = false,
    draggable = false,
    showCost = true,
    selectable = false,
    selected = false,
    disabled = false,
    clickAny = false,
    tacticOnlyClick = false,
  } = options;
  const clean = { ...card };
  ["hp", "maxHp", "atk", "def", "satk", "sdef", "cost"].forEach((k) => {
    if (clean[k] !== undefined) clean[k] = Math.ceil(clean[k]);
  });
  const el = document.createElement("article");
  el.className = `card ${compact ? "mini" : ""} ${selected ? "rest-selected" : ""} ${disabled ? "disabled" : ""}`;
  const shownCost = clean.type === "tactic" ? getTacticCost(clean) : clean.cost;
  const label = clean.type === "tactic" ? "택틱" : clean.type === "keyword" ? "키워드" : `사거리 ${clean.range}`;

  el.innerHTML = `
    ${showCost && clean.cost ? `<div class="cost">$${shownCost}</div>` : ""}
    <h4>${clean.name}</h4>
    <div class="muted">${label}</div>
    ${clean.tribes ? `<div class="row"><span class="stat">종족: ${clean.tribes.join(", ")}</span></div>` : ""}
    ${clean.atk !== undefined ? `<div class="row">
      <span class="stat">체력 ${clean.hp}/${clean.maxHp ?? clean.hp}</span>
      <span class="stat">물공 ${clean.atk}</span>
      <span class="stat">물방 ${clean.def}</span>
      <span class="stat">특공 ${clean.satk}</span>
      <span class="stat">특방 ${clean.sdef}</span>
    </div>` : ""}
    ${clean.text ? `<p class="muted">${clean.text}</p>` : ""}
    <div class="row">${(clean.keywords || []).map((k) => `<span class="keyword">${k}</span>`).join("")}</div>
  `;

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (selectable) {
      onClick?.(card);
      return;
    }
    if (!onClick) return;
    if (tacticOnlyClick && card.type !== "tactic") return;
    if (clickAny || card.type === "tactic" || selectable) onClick(card);
  });

  el.addEventListener("pointerdown", (e) => {
    if (!draggable || disabled) return;
    if (card.type === "tactic") {
      if (card.target) {
        e.preventDefault();
        startTacticDrag(card);
      }
      return;
    }
    e.preventDefault();
    startCardDrag(card);
  });

  el.addEventListener("mouseenter", () => showInspect(card));
  el.addEventListener("mouseleave", hideInspect);

  return el;
}

function createFloatingAvatar(text) {
  const ghost = document.createElement("div");
  ghost.className = "floating-card";
  ghost.textContent = text;
  document.body.appendChild(ghost);
  return ghost;
}

function clearDropTargets() {
  $$(".cell").forEach((c) => c.classList.remove("drop-target"));
  $$(".cell").forEach((c) => c.classList.remove("tactic-target"));
  const portrait = $("#entity-portrait");
  if (portrait) portrait.classList.remove("tactic-target");
}

function isAdjacent(a, b) {
  const rowDiff = Math.abs(Math.floor(a / 3) - Math.floor(b / 3));
  const colDiff = Math.abs((a % 3) - (b % 3));
  return rowDiff + colDiff === 1;
}

function getDropIndex(event) {
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const cell = target?.closest?.(".cell");
  if (cell) return Number(cell.dataset.idx);
  const board = $("#board");
  if (!board) return null;
  let closest = null;
  let minDist = Infinity;
  board.querySelectorAll(".cell").forEach((c) => {
    const rect = c.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - event.clientX, cy - event.clientY);
    if (dist < minDist) {
      minDist = dist;
      closest = c;
    }
  });
  if (minDist < 90 && closest) return Number(closest.dataset.idx);
  return null;
}

function handlePointerMove(e) {
  if (!dragAvatar) return;
  dragAvatar.style.left = `${e.clientX}px`;
  dragAvatar.style.top = `${e.clientY}px`;
  clearDropTargets();
  if (draggedCard?.type === "tactic" && draggedCard.target) {
    highlightTacticTargets(draggedCard);
    return;
  }
  const idx = getDropIndex(e);
  if (idx == null) return;
  if (dragOriginIdx == null || isAdjacent(dragOriginIdx, idx)) {
    const cell = $(`.cell[data-idx='${idx}']`);
    if (cell) cell.classList.add("drop-target");
  }
}

function cleanupDrag() {
  clearDropTargets();
  document.removeEventListener("pointermove", handlePointerMove);
  document.removeEventListener("pointerup", handlePointerUp);
  if (dragAvatar) dragAvatar.remove();
  dragAvatar = null;
  draggedCard = null;
  dragOriginIdx = null;
}

function handlePointerUp(e) {
  const idx = getDropIndex(e);
  if (draggedCard && draggedCard.type === "tactic" && draggedCard.target) {
    const target = getTacticDrop(e, draggedCard);
    if (target) attemptPlayTactic(draggedCard, target);
    cleanupDrag();
    return;
  }
  if (draggedCard && dragOriginIdx == null && idx != null) {
    placeFromGate(draggedCard, idx);
  }
  if (draggedCard && dragOriginIdx != null && idx != null) {
    moveUnitTo(dragOriginIdx, idx);
  }
  cleanupDrag();
}

function startCardDrag(card) {
  draggedCard = card;
  dragOriginIdx = null;
  dragAvatar = createFloatingAvatar(card.name);
  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup", handlePointerUp);
}

function startTacticDrag(card) {
  draggedCard = card;
  dragOriginIdx = null;
  dragAvatar = createFloatingAvatar(card.name);
  clearDropTargets();
  highlightTacticTargets(card);
  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup", handlePointerUp);
}

function getValidTacticCells(card) {
  if (card.target === "ally") return state.board.map((u, idx) => (u ? idx : null)).filter((x) => x != null);
  if (card.target === "anyCell") return state.board.map((_, idx) => idx);
  return [];
}

function highlightTacticTargets(card) {
  const cells = getValidTacticCells(card);
  cells.forEach((idx) => {
    const cell = $(`.cell[data-idx='${idx}']`);
    if (cell) cell.classList.add("tactic-target");
  });
  if (card.target === "enemy" && state.entity) {
    const portrait = $("#entity-portrait");
    if (portrait) portrait.classList.add("tactic-target");
  }
}

function getTacticDrop(event, card) {
  const targetEl = document.elementFromPoint(event.clientX, event.clientY);
  const portrait = targetEl?.closest?.("#entity-portrait");
  if (card.target === "enemy" && portrait && state.entity) return { type: "enemy", entity: state.entity };
  const idx = getDropIndex(event);
  if (idx == null) return null;
  if (card.target === "ally" && state.board[idx]) return { type: "ally", idx };
  if (card.target === "anyCell") return { type: "cell", idx };
  return null;
}

function startUnitDrag(idx) {
  dragOriginIdx = idx;
  draggedCard = state.board[idx];
  dragAvatar = createFloatingAvatar(draggedCard.name);
  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup", handlePointerUp);
}

function resetState(mode) {
  Object.assign(state, {
    mode,
    money: 120,
    stage: 1,
    stageInCycle: 1,
    cyclesCompleted: 0,
    bossClearedCount: 0,
    restStage: false,
    board: Array(9).fill(null),
    gate: [],
    keywordCards: [],
    contracts: [],
    contractChoices: [],
    shopCards: [],
    shopTaken: new Set(),
    shopPicked: false,
    initialVanguardNeeded: true,
    rerollCost: 6,
    entity: null,
    currentTargets: [],
    nextTargets: [],
    pendingSpawn: true,
    selectedKeyword: null,
    selectedGateCard: null,
    turnBuff: { damage: 0, crit: 0, shieldFront: false },
    stageBuff: { damage: 0 },
    contractEffects: {
      allyDamage: 0,
      allyCrit: 0,
      frontDamage: 0,
      enemyDamageTaken: 0,
      moveCostFlat: 0,
      tacticCostMult: 1,
      rewardMult: 1,
      shopCostMult: 1,
      rerollFlat: 0,
    },
  });
  summon(true);
  render();
}

function renderBoard() {
  const boardEl = $("#board");
  boardEl.innerHTML = "";
  state.board.forEach((unit, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.idx = idx;
    cell.innerHTML = unit
      ? `<div><strong>${unit.name}</strong><div class="muted">${unit.hp}/${unit.maxHp}</div></div>`
      : "";
    cell.addEventListener("click", (e) => onCellClick(e, cell, idx));
    cell.addEventListener("pointerdown", () => {
      if (unit) startUnitDrag(idx);
    });
    cell.addEventListener("mouseenter", () => showInspect(unit || null));
    cell.addEventListener("mouseleave", hideInspect);
    boardEl.appendChild(cell);
  });
}

function render() {
  $("#money-label").textContent = `$${state.money}`;
  $("#shop-money").textContent = `$${state.money}`;
  $("#contract-money").textContent = `$${state.money}`;
  $("#card-count").textContent = `보유 중인 카드 수 ${state.gate.length}`;

  const typeEl = $("#stage-type");
  const stageCircle = $("#stage-number");
  const stageCycle = $("#stage-cycle");
  stageCircle.textContent = state.stage;
  typeEl.classList.remove("boss", "rest");
  if (state.restStage) {
    typeEl.textContent = "재정비";
    typeEl.classList.add("rest");
  } else if (state.stageInCycle === 4) {
    typeEl.textContent = "보스";
    typeEl.classList.add("boss");
  } else {
    typeEl.textContent = "일반";
  }
  if (stageCycle) {
    const pos = state.stageInCycle;
    if (pos === 4) stageCycle.textContent = "보스 스테이지 (4 / 4)";
    else stageCycle.textContent = `일반 스테이지 (${pos} / 3)`;
  }

  renderBoard();
  renderGate();
  renderContracts();
  renderEntityPanel();
  renderAttackPreview();
}

function updateKeywordDetail(target) {
  const panel = $("#keyword-detail");
  const body = $("#keyword-detail-body");
  if (!panel || !body) return;
  if (!target || !target.keywords || target.keywords.length === 0) {
    panel.classList.add("hidden");
    body.innerHTML = "";
    return;
  }
  panel.classList.remove("hidden");
  body.innerHTML = target.keywords
    .map((k) => `<div class="keyword-line"><span class="keyword-chip">${k}</span><span class="keyword-desc">${
      keywordDescriptions[k] || "효과 정보 없음"
    }</span></div>`)
    .join("");
}

function showInspect(target) {
  const panel = $("#inspect-panel");
  if (!panel) return;
  if (!target) {
    panel.classList.add("hidden");
    updateKeywordDetail(null);
    return;
  }
  const keywordHtml = (target.keywords || []).map((k) => `<span class="keyword">${k}</span>`).join("");
  const stats =
    target.atk !== undefined
      ? `<div class="row"><span class="stat">체력 ${target.hp ?? target.maxHp}/${target.maxHp ?? target.hp}</span>
          <span class="stat">물공 ${target.atk}</span>
          <span class="stat">물방 ${target.def}</span>
          <span class="stat">특공 ${target.satk}</span>
          <span class="stat">특방 ${target.sdef}</span></div>`
      : "";
  const descLabel =
    target.type === "tactic"
      ? "택틱"
      : target.range
      ? `사거리 ${target.range}`
      : "";
  panel.innerHTML = `
    <strong>${target.name || target.title || target.type}</strong>
    <div class="muted">${descLabel}</div>
    ${target.tribes ? `<div class="row"><span class="stat">종족: ${target.tribes.join(", ")}</span></div>` : ""}
    ${stats}
    ${target.text ? `<p class="muted">${target.text}</p>` : ""}
    <div class="row">${keywordHtml}</div>
  `;
  panel.classList.remove("hidden");
  updateKeywordDetail(target);
}

function hideInspect() {
  const panel = $("#inspect-panel");
  if (panel) panel.classList.add("hidden");
}

function renderGate() {
  renderCards(
    $("#gate"),
    state.gate,
    (card) => {
      if (card.type === "tactic") {
        if (card.target) {
          startTacticDrag(card);
        } else {
          attemptPlayTactic(card);
        }
        return;
      }
      return null;
    },
    { draggable: true, tacticOnlyClick: false }
  );
}

function renderEntityPanel() {
  const portrait = $("#entity-portrait");
  const inline = $("#entity-inline");
  if (!portrait) return;
  portrait.innerHTML = "";
  if (!state.entity) {
    portrait.classList.add("empty");
    const empty = document.createElement("div");
    empty.className = "placeholder";
    empty.textContent = "엔티티 없음";
    portrait.appendChild(empty);
    if (inline) inline.innerHTML = "";
    updateKeywordDetail(null);
    return;
  }
  portrait.classList.remove("empty");
  portrait.style.setProperty("--entity-color", state.entity.elementColor || "#60a5fa");
  portrait.classList.toggle("boss", !!state.entity.boss);
  const circle = document.createElement("div");
  circle.className = "circle ring";
  circle.textContent = state.entity.name;
  const meta = document.createElement("div");
  meta.className = "entity-meta";
  meta.innerHTML = `HP ${state.entity.hp}/${state.entity.maxHp}<br/>위협력 ${state.entity.threat}<br/>속성 ${
    state.entity.elementLabel || "-"
  }`;
  portrait.appendChild(circle);
  portrait.appendChild(meta);
  portrait.onmouseenter = () => showInspect(state.entity);
  portrait.onmouseleave = hideInspect;
  if (inline) {
    inline.innerHTML = `
      <div class="name">${state.entity.name}</div>
      <div class="stats">
        <span class="stat-chip">HP ${state.entity.hp}/${state.entity.maxHp}</span>
        <span class="stat-chip">위협력 ${state.entity.threat}</span>
        <span class="stat-chip">물공 ${state.entity.atk}</span>
        <span class="stat-chip">특공 ${state.entity.satk}</span>
        <span class="stat-chip">물방 ${state.entity.def}</span>
        <span class="stat-chip">특방 ${state.entity.sdef}</span>
        <span class="stat-chip">속성 ${state.entity.elementLabel || "-"}</span>
      </div>
      <div class="keyword-row">${(state.entity.keywords || [])
        .map((k) => `<span class="keyword">${k}</span>`)
        .join("")}</div>
    `;
  }
  updateKeywordDetail(state.entity);
}

function pickTargets() {
  if (!state.entity) return [];

  const totalCells = 9;
  const max = Math.min(state.entity.threat, totalCells);

  // 보드 상태 스냅샷
  const board = state.board;

  const frontIndexes = [0, 1, 2];
  const otherIndexes = [3, 4, 5, 6, 7, 8];

  // 4가지 그룹
  let frontWithUnit = frontIndexes.filter((i) => board[i]);
  let otherWithUnit = otherIndexes.filter((i) => board[i]);
  let frontEmpty = frontIndexes.filter((i) => !board[i]);
  let otherEmpty = otherIndexes.filter((i) => !board[i]);

  const result = [];

  // 그룹별 기본 가중치
  const baseWeights = {
    frontWithUnit: 50, // 전방 + 유닛: 가장 우선
    otherWithUnit: 25, // 후방 + 유닛
    frontEmpty: 15, // 전방 빈 칸
    otherEmpty: 10, // 후방 빈 칸
  };

  while (
    result.length < max &&
    (frontWithUnit.length || otherWithUnit.length || frontEmpty.length || otherEmpty.length)
  ) {
    // 현재 남아 있는 그룹만으로 가중치 재계산
    const groups = [];
    if (frontWithUnit.length) groups.push("frontWithUnit");
    if (otherWithUnit.length) groups.push("otherWithUnit");
    if (frontEmpty.length) groups.push("frontEmpty");
    if (otherEmpty.length) groups.push("otherEmpty");

    const totalWeight = groups.reduce((sum, key) => sum + baseWeights[key], 0);
    let r = Math.random() * totalWeight;
    let chosenGroup = groups[0];

    for (const key of groups) {
      if (r < baseWeights[key]) {
        chosenGroup = key;
        break;
      }
      r -= baseWeights[key];
    }

    let pool;
    if (chosenGroup === "frontWithUnit") pool = frontWithUnit;
    else if (chosenGroup === "otherWithUnit") pool = otherWithUnit;
    else if (chosenGroup === "frontEmpty") pool = frontEmpty;
    else pool = otherEmpty;

    const idxInPool = rand(0, pool.length - 1);
    const cellIndex = pool[idxInPool];

    if (!result.includes(cellIndex)) {
      result.push(cellIndex);

      // 선택된 칸은 모든 그룹에서 제거
      frontWithUnit = frontWithUnit.filter((i) => i !== cellIndex);
      otherWithUnit = otherWithUnit.filter((i) => i !== cellIndex);
      frontEmpty = frontEmpty.filter((i) => i !== cellIndex);
      otherEmpty = otherEmpty.filter((i) => i !== cellIndex);
    }
  }

  return result;
}

function refreshTargets() {
  if (!state.entity) return;
  state.currentTargets = pickTargets();
  state.nextTargets = pickTargets();
  renderAttackPreview();
}

function renderAttackPreview() {
  const nowGrid = $("#attack-now");
  const nextGrid = $("#attack-next");
  if (!nowGrid || !nextGrid) return;
  if (state.entity && state.currentTargets.length === 0) state.currentTargets = pickTargets();
  if (state.entity && state.nextTargets.length === 0) state.nextTargets = pickTargets();
  const now = state.entity ? state.currentTargets : [];
  const next = state.entity ? state.nextTargets : [];
  [nowGrid, nextGrid].forEach((grid, idx) => {
    const list = idx === 0 ? now : next;
    grid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "mini-cell";
      if (list.includes(i)) {
        cell.classList.add("target");
        if (idx === 0) cell.classList.add("pulse");
      }
      grid.appendChild(cell);
    }
  });
}

function showCellEffect(idx, text, tone = "hit") {
  const cell = $(`#board .cell[data-idx='${idx}']`);
  if (!cell) return;
  const eff = document.createElement("div");
  eff.className = `cell-effect ${tone === "heal" ? "heal" : ""}`;
  eff.textContent = text;
  cell.appendChild(eff);
  setTimeout(() => eff.remove(), 800);
}

function showEntityEffect(text) {
  const portrait = $("#entity-portrait");
  if (!portrait) return;
  const eff = document.createElement("div");
  eff.className = "cell-effect";
  eff.style.inset = "20px";
  eff.textContent = text;
  portrait.appendChild(eff);
  setTimeout(() => eff.remove(), 800);
}

function animateUnitDeath(idx) {
  const cell = $(`#board .cell[data-idx='${idx}']`);
  if (!cell) return;
  const boom = document.createElement("div");
  boom.className = "unit-death";
  cell.appendChild(boom);
  setTimeout(() => boom.remove(), 700);
}

function resetTurnTimer() {
  clearInterval(turnTimerId);
  const bar = $("#turn-timer");
  if (!bar || state.restStage || !state.entity) return;
  turnTimerRemaining = TURN_TIME;
  bar.style.width = "100%";
  turnTimerId = setInterval(() => {
    turnTimerRemaining -= 1;
    bar.style.width = `${Math.max(0, (turnTimerRemaining / TURN_TIME) * 100)}%`;
    if (turnTimerRemaining <= 0) {
      clearInterval(turnTimerId);
      endTurn();
    }
  }, 1000);
}

function renderContracts() {
  const wrap = $("#active-contracts");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (state.contracts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "선택된 계약이 없습니다.";
    wrap.appendChild(empty);
    return;
  }
  state.contracts.forEach((c) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `<div>${c.name}</div><div class="muted">${c.buff}</div>`;
    wrap.appendChild(chip);
  });
}

function renderRestLayer() {
  const keywordObjs = state.keywordCards.map((k) => ({ id: k, name: k, type: "keyword" }));
  renderCards($("#rest-keywords"), keywordObjs, (card) => {
    state.selectedKeyword = card.id;
    renderRestLayer();
  }, { selectable: true, showCost: false, selectedId: state.selectedKeyword });

  const gateCards = state.gate.filter((c) => c.type !== "tactic");
  renderCards($("#rest-gate"), gateCards, (card) => {
    state.selectedGateCard = card;
    renderRestLayer();
  }, { selectable: true, showCost: false, selectedId: state.selectedGateCard?.id });
}

function openRestLayer() {
  clearInterval(turnTimerId);
  $("#rest-layer").classList.remove("hidden");
  state.currentTargets = [];
  state.nextTargets = [];
  renderAttackPreview();
  renderRestLayer();
}

function applySelectedKeyword() {
  const keyword = state.selectedKeyword;
  const target = state.gate.find((c) => c.id === state.selectedGateCard?.id);
  if (!keyword || !target) return;
  applyKeywordToCard(keyword, target);
  state.selectedKeyword = null;
  state.selectedGateCard = null;
  renderRestLayer();
}

function finishRestStage() {
  $("#rest-layer").classList.add("hidden");
  state.restStage = false;
  state.selectedKeyword = null;
  state.selectedGateCard = null;
  summon();
  render();
}

function toggleShopCard(card) {
  if (state.shopTaken.has(card.id)) {
    state.shopTaken.delete(card.id);
    const idx = state.gate.findIndex((c) => c.id === card.id);
    if (idx !== -1) state.gate.splice(idx, 1);
    state.money += card.cost;
    state.shopPicked = state.shopTaken.size > 0;
    if (!state.gate.some((c) => c.type === "vanguard")) state.initialVanguardNeeded = true;
    renderShop();
    render();
    return;
  }
  if (state.money < card.cost) return;
  state.money -= card.cost;
  state.gate.push(card);
  state.shopTaken.add(card.id);
  state.shopPicked = true;
  if (state.initialVanguardNeeded && card.type === "vanguard") state.initialVanguardNeeded = false;
  renderShop();
  render();
}

function summon(forceVanguard = false) {
  state.shopCards = createShopCards(forceVanguard);
  state.shopTaken = new Set();
  state.shopPicked = false;
  state.pendingSpawn = true;
  renderShop();
}

function reroll() {
  const cost = getRerollCost();
  if (state.money < cost) return;
  state.money -= cost;
  state.rerollCost = Math.ceil(state.rerollCost * 1.35 + 2);
  summon();
  render();
}

function closeShopLayer() {
  const pickedVanguardCount = state.shopCards.filter((c) => state.shopTaken.has(c.id) && c.type === "vanguard").length;
  const ownsVanguard =
    pickedVanguardCount > 0 ||
    state.gate.some((c) => c.type === "vanguard") ||
    state.board.some((c) => c && c.type === "vanguard");

  if (state.initialVanguardNeeded && !ownsVanguard) {
    const cheapest = state.shopCards
      .filter((c) => c.type === "vanguard" && !state.shopTaken.has(c.id))
      .sort((a, b) => a.cost - b.cost)[0];
    if (cheapest && cheapest.cost > state.money) cheapest.cost = Math.max(1, Math.ceil(state.money));
    if (cheapest && state.money >= cheapest.cost) {
      toggleShopCard(cheapest);
      return closeShopLayer();
    }
    return;
  }

  if (pickedVanguardCount > 0 || ownsVanguard) {
    state.initialVanguardNeeded = false;
    state.shopPicked = true;
  }

  $("#shop-layer").classList.add("hidden");
  if (state.pendingSpawn && !state.restStage) {
    spawnEntity();
  }
  state.pendingSpawn = false;
  render();
}

function placeFromGate(card, targetIdx = null) {
  const emptyIndex = targetIdx != null ? targetIdx : state.board.findIndex((c) => !c);
  if (emptyIndex === -1 || state.board[emptyIndex]) return;
  state.board[emptyIndex] = { ...card, id: uuid() };
  state.gate = state.gate.filter((c) => c.id !== card.id);
  render();
}

function clearSacrificeButton() {
  if (activeSacrificeButton?.parentElement) {
    activeSacrificeButton.parentElement.removeChild(activeSacrificeButton);
  }
  activeSacrificeButton = null;
}

function sacrificeUnit(idx, unit) {
  const refund = Math.ceil(unit.cost * 0.3);
  state.money += refund;
  state.board[idx] = null;
  clearSacrificeButton();
  animateUnitDeath(idx);
  render();
}

function onCellClick(event, cell, idx) {
  const unit = state.board[idx];
  if (!unit) {
    clearSacrificeButton();
    return;
  }
  clearSacrificeButton();
  const btn = document.createElement("button");
  btn.className = "sacrifice-btn";
  btn.textContent = "희생";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    sacrificeUnit(idx, unit);
  });
  cell.appendChild(btn);
  activeSacrificeButton = btn;
}

function moveUnitTo(fromIdx, targetIdx) {
  if (targetIdx == null || fromIdx === targetIdx) return;
  if (!isAdjacent(fromIdx, targetIdx)) return;
  const cost = Math.ceil(3 + state.stage * 0.35 + state.contractEffects.moveCostFlat);
  if (state.money < cost) return;
  state.money -= cost;
  const temp = state.board[targetIdx];
  state.board[targetIdx] = state.board[fromIdx];
  state.board[fromIdx] = temp || null;
  render();
}

function attemptPlayTactic(card, target = null) {
  const cost = getTacticCost(card);
  if (state.money < cost) return;
  if (card.target === "ally" && (!target || target.idx == null || !state.board[target.idx])) return;
  if (card.target === "enemy" && !state.entity) return;
  state.money -= cost;
  card.effect(state, target);
  state.gate = state.gate.filter((c) => c.id !== card.id);
  render();
}

function healOne(stateRef, ratio, target) {
  const idx = target?.idx ?? stateRef.board.findIndex((u) => u);
  if (idx == null || idx < 0) return;
  const unit = stateRef.board[idx];
  if (!unit) return;
  const heal = Math.ceil(unit.maxHp * ratio);
  unit.hp = Math.min(unit.maxHp, unit.hp + heal);
  showCellEffect(idx, `+${heal}`, "heal");
}

function buffOne(stateRef, dmg, target) {
  const idx = target?.idx ?? stateRef.board.findIndex((u) => u);
  if (idx == null || idx < 0) return;
  const unit = stateRef.board[idx];
  if (!unit) return;
  unit.tempBonus = (unit.tempBonus || 0) + dmg;
  const cell = $(`#board .cell[data-idx='${idx}']`);
  if (cell) spawnExplosion(getCenter(cell), { color: "#22c55e" });
}

function damageEntity(stateRef, ratio, target) {
  if (!stateRef.entity) return;
  const dmg = Math.ceil(stateRef.entity.hp * ratio);
  stateRef.entity.hp -= dmg;
  const portrait = $("#entity-portrait");
  if (portrait) {
    showDamageNumber(getCenter(portrait), `-${dmg}`);
    spawnExplosion(getCenter(portrait), { strong: false, color: "#ef4444" });
  }
  if (stateRef.entity.hp <= 0) onEntityDefeated();
}

function applyKeywordToCard(keyword, card) {
  if (!keyword || !card) return;
  card.keywords = card.keywords || [];
  card.keywords.push(keyword);
  state.keywordCards = state.keywordCards.filter((k) => k !== keyword);
}

function spawnEntity() {
  const isBoss = state.stageInCycle === 4;
  const variance = 0.9 + Math.random() * 0.25;
  const element = elements[rand(0, elements.length - 1)];
  const isFinalBoss = isBoss && state.bossClearedCount >= 19;
  const hpBase = (isBoss ? lerpStat(state.stage, 220, 7600) : lerpStat(state.stage, 36, 3800)) * variance;
  const atkBase = (isBoss ? lerpStat(state.stage, 42, 5600) : lerpStat(state.stage, 30, 4500)) * variance;
  const satkBase = (isBoss ? lerpStat(state.stage, 42, 5600) : lerpStat(state.stage, 30, 4500)) * variance;
  const defBase = (isBoss ? lerpStat(state.stage, 22, 2800) : lerpStat(state.stage, 12, 2000)) * variance;
  const threat = isBoss ? Math.max(3, Math.round(3.5 + state.stage / 14)) : Math.max(2, Math.round(2 + state.stage / 18));
  const keywordsPicked = rollKeywords();
  if (isBoss && keywordsPicked.length < 1) keywordsPicked.push("천상의보호막");
  state.entity = {
    name: isFinalBoss ? "아키리히치" : randomName("enemy"),
    boss: isBoss,
    element: element.key,
    elementColor: element.color,
    elementLabel: element.label,
    hp: Math.ceil(hpBase),
    maxHp: Math.ceil(hpBase),
    atk: Math.ceil(atkBase),
    satk: Math.ceil(satkBase),
    def: Math.ceil(defBase),
    sdef: Math.ceil(defBase),
    threat,
    keywords: keywordsPicked,
  };
  state.currentTargets = pickTargets();
  state.nextTargets = pickTargets();
  state.pendingSpawn = false;
  renderAttackPreview();
  resetTurnTimer();
}

function calculateDamage(unit, entity, idx = 0) {
  const critChance = 0.05 + (unit.tempBonus ? 0.1 : 0) + state.turnBuff.crit + state.contractEffects.allyCrit;
  const isCrit = Math.random() < critChance;
  const ultra = !isCrit && Math.random() < 0.01;
  const physical = Math.max(0, unit.atk - entity.def);
  const magical = Math.max(0, unit.satk - entity.sdef);
  let dmg = physical + magical;
  if (dmg < 1) dmg = 1;
  if (unit.tempBonus) dmg *= 1 + unit.tempBonus;
  if (unit.keywords.includes("보스슬레이어") && entity.boss) dmg *= 1.2;
  if (unit.keywords.includes("미니언슬레이어") && !entity.boss) dmg *= 1.2;
  const frontBonus = idx < 3 ? state.contractEffects.frontDamage : 0;
  dmg *= 1 + state.turnBuff.damage + state.stageBuff.damage + state.contractEffects.allyDamage + frontBonus;
  dmg = Math.max(1, Math.ceil(dmg));
  if (isCrit) dmg *= 2;
  if (ultra) dmg *= 4;
  return { dmg, isCrit, ultra };
}

async function entityAttack() {
  if (!state.entity) return;
  const portrait = $("#entity-portrait");
  const targets = state.currentTargets.length ? [...state.currentTargets] : pickTargets();
  for (const idx of targets) {
    const unit = state.board[idx];
    const cell = $(`#board .cell[data-idx='${idx}']`);
    if (!cell) continue;
    if (!unit) {
      if (portrait) await animateLaser(portrait, cell, { color: "#ef4444" });
      continue;
    }
    if (state.turnBuff.shieldFront && idx < 3) {
      if (portrait) await animateLaser(portrait, cell, { color: "#94a3b8" });
      spawnExplosion(getCenter(cell), { color: "#94a3b8" });
      continue;
    }
    if (portrait) await animateLaser(portrait, cell, { color: "#ef4444" });
    const phys = Math.max(0, state.entity.atk - unit.def);
    const mag = Math.max(0, state.entity.satk - unit.sdef);
    let dmg = Math.ceil(phys + mag);
    if (dmg < 1) dmg = 1;
    dmg = Math.max(1, Math.ceil(dmg * Math.max(0, 1 + state.contractEffects.enemyDamageTaken)));
    unit.hp -= dmg;
    showDamageNumber(getCenter(cell), `-${dmg}`);
    showCellEffect(idx, `-${dmg}`);
    if (unit.hp <= 0) handleDeath(idx, unit);
    await wait(100);
  }
  state.currentTargets = state.nextTargets.length ? [...state.nextTargets] : pickTargets();
  state.nextTargets = pickTargets();
  renderAttackPreview();
}

function handleDeath(idx, unit) {
  if (unit.keywords.includes("끈질김") && !unit._usedGrit) {
    unit._usedGrit = true;
    unit.hp = 1;
    return;
  }
  if (unit.keywords.includes("부활") && !unit._usedRevive) {
    unit._usedRevive = true;
    unit.hp = unit.maxHp;
    state.gate.push(unit);
    state.board[idx] = null;
    return;
  }
  state.board[idx] = null;
  animateUnitDeath(idx);
  showCellEffect(idx, "퇴각");
}

async function endTurn() {
  clearInterval(turnTimerId);
  if (!state.entity) return;
  const portrait = $("#entity-portrait");
  const attackers = state.board
    .map((unit, idx) => {
      if (!unit) return null;
      const result = calculateDamage(unit, state.entity, idx);
      return { unit, idx, ...result };
    })
    .filter(Boolean)
    .sort((a, b) => a.dmg - b.dmg);

  for (const atk of attackers) {
    const cell = $(`#board .cell[data-idx='${atk.idx}']`);
    if (cell && portrait) {
      await animateLaser(cell, portrait, {
        color: atk.ultra ? "#a855f7" : atk.isCrit ? "#f97316" : "#38bdf8",
        crit: atk.isCrit,
      });
    }
    state.entity.hp -= atk.dmg;
    if (portrait) showDamageNumber(getCenter(portrait), `-${atk.dmg}`, atk.isCrit || atk.ultra ? "crit" : "hit");
    if (atk.ultra) screenShake(10, 260);
    if (state.entity.hp <= 0) {
      await onEntityDefeated();
      return;
    }
    await wait(80);
  }

  await entityAttack();
  state.turnBuff = { damage: 0, crit: 0, shieldFront: false };
  state.board.forEach((u) => {
    if (!u) return;
    if (u.keywords.includes("회복술사")) {
      const heal = 4;
      u.hp = Math.min(u.maxHp, u.hp + heal);
      const idx = state.board.findIndex((item) => item === u);
      if (idx >= 0) showCellEffect(idx, `+${heal}`, "heal");
    }
    u.tempBonus = 0;
  });
  render();
  checkGameOver();
  resetTurnTimer();
}

async function onEntityDefeated() {
  const defeated = state.entity;
  const portrait = $("#entity-portrait");
  if (portrait) {
    spawnExplosion(getCenter(portrait), { strong: true, color: defeated?.elementColor || "#f97316" });
    if (defeated?.boss) screenShake(12, 300);
  }
  const rewardBase = 16 + state.stage * (state.entity.boss ? 8 : 5);
  const reward = Math.ceil(rewardBase * state.contractEffects.rewardMult);
  state.money += reward;
  const dropChance = state.entity.boss ? 1 : 0.25;
  if (Math.random() < dropChance) {
    const card = keywordCardsPool[rand(0, keywordCardsPool.length - 1)];
    state.keywordCards.push(card);
  }
  const wasBoss = state.entity.boss;
  const wasFinal = wasBoss && state.entity.name === "아키리히치";
  if (wasBoss) state.bossClearedCount += 1;
  state.entity = null;
  state.currentTargets = [];
  state.nextTargets = [];
  renderAttackPreview();
  await wait(150);
  if (wasFinal && state.mode === "스토리 모드") {
    alert("최종 보스를 격파했습니다! 승리");
    showTitle();
    return;
  }
  if (wasBoss) {
    openContractModal();
    render();
    return;
  }
  advanceStage();
}

function advanceStage() {
  if (state.stageInCycle === 4) {
    state.cyclesCompleted += 1;
    state.stageInCycle = 1;
    state.stage += 1;
    if (state.cyclesCompleted % 2 === 0) {
      state.restStage = true;
      openRestLayer();
      return;
    }
  } else {
    state.stageInCycle += 1;
    state.stage += 1;
  }

  summon();
  render();
}

function checkGameOver() {
  const alive = state.board.some((u) => u);
  if (!alive) {
    if (state.mode === "무한 모드") state.records.push({ stage: state.stage });
    showTitle();
  }
}

function updateRecords() {
  const list = $("#record-list");
  list.innerHTML = "";
  state.records
    .sort((a, b) => b.stage - a.stage)
    .forEach((rec) => {
      const li = document.createElement("li");
      li.textContent = `${rec.stage} 스테이지 도달`;
      list.appendChild(li);
    });
}

const screens = ["title-screen", "record-screen", "game-screen"];

function showScreen(id) {
  screens.forEach((s) => {
    const el = document.getElementById(s);
    el.classList.toggle("active", s === id);
  });
  const titleActions = document.querySelector(".title-actions");
  if (titleActions) {
    titleActions.style.display = id === "title-screen" ? "flex" : "none";
  }
}

function showTitle() {
  showScreen("title-screen");
  $("#contract-layer").classList.add("hidden");
  $("#shop-layer").classList.add("hidden");
  $("#rest-layer").classList.add("hidden");
  clearSacrificeButton();
  hideInspect();
  clearInterval(turnTimerId);
  state.entity = null;
  state.pendingSpawn = false;
  state.restStage = false;
  state.selectedKeyword = null;
  state.selectedGateCard = null;
  state.currentTargets = [];
  state.nextTargets = [];
  state.shopTaken = new Set();
  state.shopPicked = false;
  state.initialVanguardNeeded = true;
}

$("#story-btn").addEventListener("click", () => {
  resetState("스토리 모드");
  showScreen("game-screen");
});

$("#endless-btn").addEventListener("click", () => {
  resetState("무한 모드");
  showScreen("game-screen");
});

$("#record-btn").addEventListener("click", () => {
  updateRecords();
  showScreen("record-screen");
});

$$('[data-action="to-title"]').forEach((btn) => btn.addEventListener("click", showTitle));
$("#overlay-reroll").addEventListener("click", reroll);
$("#close-shop").addEventListener("click", closeShopLayer);
$("#end-turn-btn").addEventListener("click", endTurn);
$("#skip-contract").addEventListener("click", () => {
  closeContractModal();
  advanceStage();
  render();
});
$("#apply-keyword").addEventListener("click", applySelectedKeyword);
$("#finish-rest").addEventListener("click", finishRestStage);

document.addEventListener("click", (e) => {
  if (!activeSacrificeButton) return;
  const inCell = e.target.closest?.(".cell");
  if (!inCell || inCell !== activeSacrificeButton.parentElement) {
    clearSacrificeButton();
  }
});

render();
