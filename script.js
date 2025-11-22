/* eslint-disable no-alert */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const nameFragments = [
  "기", "르", "크", "마", "빈", "터", "빅", "워", "일", "리", "아", "어", "이", "렐", "비", "루", "로", "라", "메",
  "모", "몰", "바", "칸", "켄", "세", "스", "탄", "벨", "말", "파", "트", "겐", "즈", "조", "얼", "슈", "멘", "타",
  "커", "소", "수", "키", "페", "무", "벡", "잔", "슨", "센", "자", "지", "보", "레", "넌", "리엘", "론", "릴", "렘",
  "렌", "링", "로스", "룬", "라크", "라스", "로크", "루크", "람", "란", "리안", "레온", "로안", "리스", "로드", "라일",
  "랑", "렉", "르크", "룩", "렉스", "르스", "린", "렌", "림", "룸", "렁", "발", "벅", "벱", "벡", "브렌", "봄",
  "볼", "반", "벼", "벽", "바스", "브락", "브롤", "백스", "보르", "벤", "베온", "비엘", "보안", "브락스", "브론",
  "브릭", "브렉", "빈트", "빌", "벨", "벨크", "잔", "젠", "족", "제르", "조안", "증", "진스", "젤", "조크", "줄",
  "존", "젠트", "족스", "잘", "즈렌", "제바", "제온", "제프", "조알", "칸", "켄", "켈", "킨", "킥", "크스", "캘",
  "캔", "케프", "코르", "콜", "콕", "콩", "칼", "카브", "컥", "큼", "쿠르", "켄트", "칵", "켁", "켐", "콘",
  "케온", "콘스", "콕스", "콘트", "탈", "텐", "톤", "틸", "틱", "트스", "텔", "테프", "톡", "톨", "톤스", "타르",
  "토브", "티엔", "택스", "타크", "텐트", "톨크", "타브", "파", "펜", "폴", "픽", "프렌", "판", "팔", "포르",
  "패스", "포익", "폴트", "팩스", "팜", "프릴", "포안", "프록", "멘", "먼", "멜", "몬", "몰", "맥", "맨", "맘",
  "믄", "멘스", "멜크", "멘트", "슈", "실", "셀", "숀", "숀트", "속", "스크", "스텔", "스탄", "스록", "스몬",
  "스브", "스렌", "스톤", "커", "켠", "켜", "케르", "코스", "컽", "케온", "컬크", "켈트", "커브", "컨트", "케브",
  "콘트", "쿠스", "겔", "겐", "글", "고르", "그렌", "그렉", "골트", "그란", "델", "던", "돌", "닐", "님", "넨",
  "넬", "닉", "네프", "논", "넥스", "낙", "낟", "낚", "워", "위엘", "윈", "웬", "웰", "원", "웅", "웁", "웁스",
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

const tacticCards = [
  { name: "밴드", type: "tactic", cost: 5, text: "체력 25% 회복", effect: (state) => healOne(state, 0.25) },
  { name: "메드킷", type: "tactic", cost: 10, text: "체력 50% 회복", effect: (state) => healOne(state, 0.5) },
  { name: "신의눈물", type: "tactic", cost: 15, text: "체력 모두 회복", effect: (state) => healOne(state, 1) },
  { name: "고무", type: "tactic", cost: 20, text: "턴 동안 피해 +20%", effect: (state) => (state.turnBuff.damage += 0.2) },
  { name: "파이어볼", type: "tactic", cost: 25, text: "엔티티 체력 20% 피해", effect: (state) => damageEntity(state, 0.2) },
  { name: "자극제", type: "tactic", cost: 15, text: "한 뱅가드 피해 +100%", effect: (state) => buffOne(state, 1.0) },
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
  money: 100,
  stage: 1,
  stageInCycle: 1,
  cyclesCompleted: 0,
  restStage: false,
  board: Array(9).fill(null),
  gate: [],
  hand: [],
  keywordCards: [],
  contracts: [],
  contractChoices: [],
  shopCards: [],
  rerollCost: 5,
  log: [],
  records: [],
  turnBuff: { damage: 0, crit: 0, shieldFront: false },
  stageBuff: { damage: 0 },
  entity: null,
  nextTargets: [],
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
let turnTimerId = null;
const TURN_TIME = 16;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName() {
  const len = rand(2, 4);
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

function calcRole(unit) {
  const atkSum = unit.atk + unit.satk;
  if (atkSum > unit.def + unit.sdef + 5) return "후방";
  if (unit.hp > unit.atk + unit.satk) return "전방";
  return "중간";
}

function rollKeywords() {
  const list = Object.keys(keywords);
  const count = Math.random() < 0.25 ? 2 : Math.random() < 0.6 ? 1 : 0;
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function createVanguard(stage, guaranteedKeyword) {
  const base = 10 + Math.ceil(stage * 0.8);
  const unit = {
    id: crypto.randomUUID(),
    name: randomName(),
    tribes: randomTribe(),
    range: rand(1, 3),
    hp: base + rand(-3, 4),
    maxHp: 0,
    atk: base + rand(-3, 5),
    def: base + rand(-2, 4),
    satk: base + rand(-3, 5),
    sdef: base + rand(-2, 4),
    keywords: rollKeywords(),
    role: "중간",
    cost: 0,
  };
  if (guaranteedKeyword) unit.keywords.push(guaranteedKeyword);
  unit.maxHp = unit.hp;
  unit.role = calcRole(unit);
  const power = unit.hp + unit.atk + unit.satk + unit.def + unit.sdef + unit.range * 5 + unit.keywords.length * 10;
  unit.cost = Math.max(3, Math.ceil(power / 8));
  return unit;
}

function createTactic() {
  const base = tacticCards[rand(0, tacticCards.length - 1)];
  return { ...base, id: crypto.randomUUID(), type: "tactic" };
}

function getTacticCost(card) {
  return Math.max(1, Math.ceil(card.cost * state.contractEffects.tacticCostMult));
}

function getRerollCost() {
  return Math.max(1, Math.ceil(state.rerollCost + state.contractEffects.rerollFlat));
}

function applyShopCost(card) {
  const copy = { ...card };
  copy.cost = Math.max(1, Math.ceil(copy.cost * state.contractEffects.shopCostMult));
  return copy;
}

function createShopCards(forceVanguard = false) {
  let cards = [];
  let vanguardCount = 0;
  const seen = new Set();
  while (cards.length === 0 || (forceVanguard && vanguardCount === 0)) {
    cards = [];
    vanguardCount = 0;
    seen.clear();
    for (let i = 0; i < 6; i++) {
      const roll = Math.random();
      const isVanguard = roll < 0.6 || (forceVanguard && vanguardCount === 0 && i === 5);
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
  }
  const adjusted = cards.map((card) => applyShopCost(card));
  return adjusted.filter((card) => (card.type === "tactic" ? true : card.cost <= state.money * 1.5));
}

function renderShop() {
  $("#shop-layer").classList.remove("hidden");
  $("#shop-money").textContent = `$${state.money}`;
  $("#overlay-card-count").textContent = state.gate.length + state.hand.length;
  const wrap = $("#shop-cards");
  wrap.innerHTML = "";
  state.shopCards.forEach((card) => wrap.appendChild(renderCard(card, () => buyCard(card))));
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
    el.innerHTML = `<div class="muted">축복</div><div>${c.name}</div><div class="muted">${c.buff}</div><div>${c.debuff}</div>`;
    el.addEventListener("click", () => chooseContract(c));
    wrap.appendChild(el);
  });
}

function openContractModal() {
  state.contractChoices = pickContracts();
  renderContractChoices();
  $("#contract-money").textContent = `$${state.money}`;
  $("#contract-card-count").textContent = state.gate.length + state.hand.length;
  $("#contract-layer").classList.remove("hidden");
}

function closeContractModal() {
  $("#contract-layer").classList.add("hidden");
  state.contractChoices = [];
}

function chooseContract(contract) {
  contract.apply(state);
  state.contracts.push(contract);
  log(`계약 '${contract.name}' 체결: ${contract.buff} / ${contract.debuff}`);
  closeContractModal();
  advanceStage();
  render();
}

function renderCards(container, cards, onClick, options = {}) {
  const { compact = false, draggable = false, showButton = true, showCost = true } = options;
  container.innerHTML = "";
  cards.forEach((card) => {
    const display =
      typeof card === "string"
        ? { id: card, name: card, type: "keyword", text: "키워드 부여" }
        : card;
    container.appendChild(renderCard(display, () => onClick(card), { compact, draggable, showButton, showCost }));
  });
}

function renderCard(card, onClick, options = {}) {
  const { compact = false, draggable = false, showButton = true, showCost = true } = options;
  const el = document.createElement("article");
  el.className = `card ${compact ? "mini" : ""}`;
  const shownCost = card.type === "tactic" ? getTacticCost(card) : card.cost;
  const label = card.type === "tactic" ? "택틱" : card.type === "keyword" ? "키워드" : `${card.role} · 사거리 ${card.range}`;

  el.innerHTML = `
    ${showCost ? `<div class="cost">$${shownCost}</div>` : ""}
    <h4>${card.name}</h4>
    <div class="muted">${label}</div>
    ${card.tribes ? `<div class="row"><span class="stat">종족: ${card.tribes.join(", ")}</span></div>` : ""}
    ${card.atk !== undefined ? `<div class="row">
      <span class="stat">체력 ${card.hp}/${card.maxHp ?? card.hp}</span>
      <span class="stat">물공 ${card.atk}</span>
      <span class="stat">물방 ${card.def}</span>
      <span class="stat">특공 ${card.satk}</span>
      <span class="stat">특방 ${card.sdef}</span>
    </div>` : ""}
    ${card.text ? `<p class="muted">${card.text}</p>` : ""}
    <div class="row">${(card.keywords || []).map((k) => `<span class="keyword">${k}</span>`).join("")}</div>
  `;

  if (showButton) {
    const btn = document.createElement("button");
    btn.textContent = card.type === "tactic" ? "사용" : "배치";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick(card);
    });
    el.appendChild(btn);
  }

  el.addEventListener("mouseenter", () => showInspect(card));
  el.addEventListener("mouseleave", hideInspect);

  if (draggable) {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", () => {
      draggedCard = card;
      document.body.classList.add("dragging-card");
    });
    el.addEventListener("dragend", () => {
      draggedCard = null;
      document.body.classList.remove("dragging-card");
    });
  }

  return el;
}

function log(msg) {
  state.log.unshift(msg);
}

function resetState(mode) {
  Object.assign(state, {
    mode,
    money: 100,
    stage: 1,
    stageInCycle: 1,
    cyclesCompleted: 0,
    restStage: false,
    board: Array(9).fill(null),
    gate: [],
    hand: [],
    keywordCards: [],
    contracts: [],
    contractChoices: [],
    shopCards: createShopCards(true),
    rerollCost: 5,
    log: [],
    entity: null,
    nextTargets: [],
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
  log(`${mode} 시작! 소환으로 첫 뱅가드를 확보하세요.`);
  summon(true);
  resetTurnTimer();
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
      ? `<div><strong>${unit.name}</strong><div class="muted">${unit.hp}/${unit.maxHp}</div></div><span class="tag">${unit.role}</span>`
      : "<span class=\"muted\">빈 칸</span>";
    cell.addEventListener("click", (e) => onCellClick(e, cell, idx));
    cell.addEventListener("dblclick", () => moveUnit(idx));
    cell.addEventListener("dragover", (e) => {
      if (!draggedCard) return;
      e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
      if (!draggedCard) return;
      e.preventDefault();
      placeFromGate(draggedCard, idx);
    });
    cell.addEventListener("mouseenter", () => showInspect(unit || { name: "빈 칸" }));
    cell.addEventListener("mouseleave", hideInspect);
    boardEl.appendChild(cell);
  });
}

function render() {
  $("#money-label").textContent = `$${state.money}`;
  $("#shop-money").textContent = `$${state.money}`;
  $("#contract-money").textContent = `$${state.money}`;
  $("#card-count").textContent = `보유 중인 카드 수 ${state.gate.length + state.hand.length}`;
  $("#overlay-card-count").textContent = state.gate.length + state.hand.length;
  $("#contract-card-count").textContent = state.gate.length + state.hand.length;

  const typeEl = $("#stage-type");
  const stageCircle = $("#stage-number");
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
  $("#cycle-label").textContent = state.restStage ? "재정비 스테이지" : `사이클 ${state.cyclesCompleted + 1}`;

  renderStageTrack();
  renderBoard();
  renderGate();
  renderCards($("#hand"), state.hand, (card) => playTactic(card), { compact: true });
  renderCards($("#keyword-cards"), state.keywordCards, (card) => applyKeyword(card), { compact: true, showCost: false });
  renderContracts();
  renderEntityPanel();
  renderAttackPreview();
}

function showInspect(target) {
  const panel = $("#inspect-panel");
  if (!panel) return;
  if (!target) {
    panel.classList.add("hidden");
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
  panel.innerHTML = `
    <strong>${target.name || target.title || target.type}</strong>
    <div class="muted">${target.type === "tactic" ? "택틱" : target.role ? `${target.role} · 사거리 ${target.range}` : ""}</div>
    ${target.tribes ? `<div class="row"><span class="stat">종족: ${target.tribes.join(", ")}</span></div>` : ""}
    ${stats}
    ${target.text ? `<p class="muted">${target.text}</p>` : ""}
    <div class="row">${keywordHtml}</div>
  `;
  panel.classList.remove("hidden");
}

function hideInspect() {
  const panel = $("#inspect-panel");
  if (panel) panel.classList.add("hidden");
}

function renderStageTrack() {
  const wrap = $("#stage-track");
  if (!wrap) return;
  wrap.innerHTML = "";
  const nodes = [1, 2, 3, 4];
  nodes.forEach((n) => {
    const node = document.createElement("div");
    node.className = "stage-node";
    if (n === 4) node.classList.add("boss");
    if (n === state.stageInCycle) node.classList.add("active");
    wrap.appendChild(node);
  });
  if (state.restStage) {
    const rest = document.createElement("div");
    rest.className = "stage-node rest active";
    wrap.appendChild(rest);
  }
}

function renderGate() {
  renderCards($("#gate"), state.gate, (card) => placeFromGate(card), { draggable: true });
}

function renderEntityPanel() {
  const portrait = $("#entity-portrait");
  if (!portrait) return;
  portrait.innerHTML = "";
  if (!state.entity) {
    portrait.classList.add("empty");
    const empty = document.createElement("div");
    empty.className = "placeholder";
    empty.textContent = "엔티티 없음";
    portrait.appendChild(empty);
    return;
  }
  portrait.classList.remove("empty");
  const circle = document.createElement("div");
  circle.className = "circle ring";
  circle.textContent = state.entity.name;
  const meta = document.createElement("div");
  meta.className = "entity-meta";
  meta.innerHTML = `HP ${state.entity.hp}/${state.entity.maxHp}<br/>위협력 ${state.entity.threat}`;
  portrait.appendChild(circle);
  portrait.appendChild(meta);
}

function pickTargets() {
  if (!state.entity) return [];
  const occupied = state.board.map((u, idx) => (u ? idx : null)).filter((v) => v != null);
  if (occupied.length === 0) return [];
  const result = [];
  const max = Math.min(state.entity.threat, occupied.length);
  while (result.length < max) {
    const t = occupied[rand(0, occupied.length - 1)];
    if (!result.includes(t)) result.push(t);
  }
  return result;
}

function renderAttackPreview() {
  const grid = $("#attack-preview-grid");
  if (!grid) return;
  const preview = state.entity ? pickTargets() : [];
  if (state.entity) state.nextTargets = preview;
  grid.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "mini-cell";
    if (preview.includes(i)) cell.classList.add("target");
    grid.appendChild(cell);
  }
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

function resetTurnTimer() {
  clearInterval(turnTimerId);
  const bar = $("#turn-timer");
  if (!bar) return;
  let remaining = TURN_TIME;
  bar.style.width = "100%";
  turnTimerId = setInterval(() => {
    remaining -= 1;
    bar.style.width = `${Math.max(0, (remaining / TURN_TIME) * 100)}%`;
    if (remaining <= 0) clearInterval(turnTimerId);
  }, 1000);
}

function renderContracts() {
  const wrap = $("#active-contracts");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (state.contracts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "선택된 축복이 없습니다.";
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

function buyCard(card) {
  if (state.money < card.cost) return alert("자금이 부족합니다.");
  state.money -= card.cost;
  if (card.type === "tactic") state.hand.push(card);
  else state.gate.push(card);
  state.shopCards = state.shopCards.filter((c) => c.id !== card.id);
  log(`${card.name}을(를) 구매했습니다.`);
  render();
}

function summon(forceVanguard = false) {
  state.shopCards = createShopCards(forceVanguard);
  renderShop();
}

function reroll() {
  const cost = getRerollCost();
  if (state.money < cost) return alert("재소환 비용 부족");
  state.money -= cost;
  state.rerollCost = Math.ceil(state.rerollCost * 1.25 + 1);
  summon();
  log(`재소환! 새로운 카드 6장 등장. 비용은 이제 $${getRerollCost()}`);
  render();
}

function placeFromGate(card, targetIdx = null) {
  const emptyIndex = targetIdx != null ? targetIdx : state.board.findIndex((c) => !c);
  if (emptyIndex === -1 || state.board[emptyIndex]) return alert("전장에 배치할 수 없습니다.");
  state.board[emptyIndex] = { ...card, id: crypto.randomUUID() };
  state.gate = state.gate.filter((c) => c.id !== card.id);
  log(`${card.name}을(를) 전장에 배치했습니다.`);
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
  log(`${unit.name} 희생, $${refund} 환급.`);
  clearSacrificeButton();
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

function moveUnit(idx) {
  const neighbors = [idx - 3, idx + 3, idx % 3 !== 0 ? idx - 1 : null, idx % 3 !== 2 ? idx + 1 : null].filter((i) => i >= 0 && i < 9);
  const target = neighbors.find((i) => !state.board[i]);
  if (target == null) return alert("인접 칸이 없습니다.");
  const cost = Math.ceil(2 + Math.floor(state.stage * 0.2) + state.contractEffects.moveCostFlat);
  if (state.money < cost) return alert("이동 비용 부족");
  state.money -= cost;
  state.board[target] = state.board[idx];
  state.board[idx] = null;
  log(`뱅가드를 이동했습니다. 비용 $${cost}`);
  render();
}

function playTactic(card) {
  const cost = getTacticCost(card);
  if (state.money < cost) return alert("자금 부족");
  state.money -= cost;
  card.effect(state);
  state.hand = state.hand.filter((c) => c.id !== card.id);
  log(`택틱 ${card.name} 사용.`);
  render();
}

function healOne(stateRef, ratio) {
  const unit = stateRef.board.find((u) => u);
  if (!unit) return;
  const heal = Math.ceil(unit.maxHp * ratio);
  unit.hp = Math.min(unit.maxHp, unit.hp + heal);
  log(`${unit.name}이(가) ${heal}만큼 회복.`);
  const idx = stateRef.board.findIndex((u) => u === unit);
  if (idx >= 0) showCellEffect(idx, `+${heal}`, "heal");
}

function buffOne(stateRef, dmg) {
  const unit = stateRef.board.find((u) => u);
  if (!unit) return;
  unit.tempBonus = (unit.tempBonus || 0) + dmg;
  log(`${unit.name}에게 추가 피해 ${Math.round(dmg * 100)}% 부여.`);
}

function damageEntity(stateRef, ratio) {
  if (!stateRef.entity) return;
  const dmg = Math.ceil(stateRef.entity.hp * ratio);
  stateRef.entity.hp -= dmg;
  log(`엔티티에게 ${dmg} 피해.`);
  showEntityEffect(`-${dmg}`);
  if (stateRef.entity.hp <= 0) onEntityDefeated();
}

function applyKeyword(card) {
  const unit = state.board.find((u) => u);
  if (!unit) return alert("전장에 뱅가드가 없습니다.");
  unit.keywords.push(card);
  log(`${unit.name}이(가) 키워드 ${card}를 획득.`);
  state.keywordCards = state.keywordCards.filter((k) => k !== card);
  render();
}

function spawnEntity() {
  const base = 8 + Math.ceil(state.stage * 1.1);
  const isBoss = state.stageInCycle === 4;
  const hp = isBoss ? base * 2.2 : base;
  const atk = isBoss ? base * 1.6 : base * 0.9;
  const satk = isBoss ? base * 1.6 : base * 0.9;
  const def = isBoss ? base * 1.2 : base * 0.8;
  const sdef = def;
  const threat = isBoss ? 3 + rand(1, 3) : 1 + rand(0, 2);
  state.entity = {
    name: isBoss && state.stage === 20 ? "아키리히치" : randomName(),
    boss: isBoss,
    hp: Math.ceil(hp),
    maxHp: Math.ceil(hp),
    atk: Math.ceil(atk),
    satk: Math.ceil(satk),
    def: Math.ceil(def),
    sdef: Math.ceil(sdef),
    threat,
    keywords: rollKeywords(),
  };
  log(`${state.entity.boss ? "보스" : "엔티티"} ${state.entity.name} 등장! 위협력 ${state.entity.threat}`);
  state.nextTargets = pickTargets();
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
  if (unit.tempBonus) dmg *= 1 + unit.tempBonus;
  if (unit.keywords.includes("보스슬레이어") && entity.boss) dmg *= 1.2;
  if (unit.keywords.includes("미니언슬레이어") && !entity.boss) dmg *= 1.2;
  const frontBonus = idx < 3 ? state.contractEffects.frontDamage : 0;
  dmg *= 1 + state.turnBuff.damage + state.stageBuff.damage + state.contractEffects.allyDamage + frontBonus;
  dmg = Math.ceil(dmg);
  if (isCrit) dmg *= 2;
  if (ultra) dmg *= 4;
  return dmg;
}

function entityAttack() {
  if (!state.entity) return;
  const targets = state.nextTargets.length ? [...state.nextTargets] : pickTargets();
  state.nextTargets = [];
  showEntityEffect("공격");
  targets.forEach((idx) => {
    const unit = state.board[idx];
    if (!unit) return;
    if (state.turnBuff.shieldFront && idx < 3) {
      log(`최전방 보호막으로 ${unit.name} 피해 무시`);
      return;
    }
    const phys = Math.max(0, state.entity.atk - unit.def);
    const mag = Math.max(0, state.entity.satk - unit.sdef);
    let dmg = Math.ceil(phys + mag);
    dmg = Math.max(0, Math.ceil(dmg * Math.max(0, 1 + state.contractEffects.enemyDamageTaken)));
    unit.hp -= dmg;
    log(`${state.entity.name}이(가) ${unit.name}에게 ${dmg} 피해.`);
    showCellEffect(idx, `피해량 ${dmg}`);
    if (unit.hp <= 0) handleDeath(idx, unit);
  });
  state.nextTargets = pickTargets();
  renderAttackPreview();
}

function handleDeath(idx, unit) {
  if (unit.keywords.includes("끈질김") && !unit._usedGrit) {
    unit._usedGrit = true;
    unit.hp = 1;
    log(`${unit.name}이(가) 끈질김으로 생존!`);
    return;
  }
  if (unit.keywords.includes("부활") && !unit._usedRevive) {
    unit._usedRevive = true;
    unit.hp = unit.maxHp;
    state.gate.push(unit);
    state.board[idx] = null;
    log(`${unit.name}이(가) 부활하여 게이트로 돌아감.`);
    return;
  }
  log(`${unit.name}이(가) 처치되었습니다.`);
  state.board[idx] = null;
  showCellEffect(idx, "퇴각");
}

function endTurn() {
  if (!state.entity) {
    if (state.restStage) {
      state.restStage = false;
      log("재정비 완료. 다음 스테이지 시작");
    }
    spawnEntity();
    render();
    return;
  }
  // player attacks first
  state.board.forEach((unit, idx) => {
    if (!unit) return;
    const dmg = calculateDamage(unit, state.entity, idx);
    state.entity.hp -= dmg;
    log(`${unit.name} -> ${state.entity.name}: ${dmg} 피해`);
    showEntityEffect(`-${dmg}`);
  });

  if (state.entity.hp <= 0) {
    onEntityDefeated();
    return;
  }

  entityAttack();
  state.turnBuff = { damage: 0, crit: 0, shieldFront: false };
  state.board.forEach((u) => {
    if (!u) return;
    if (u.keywords.includes("회복술사")) {
      const heal = 4;
      u.hp = Math.min(u.maxHp, u.hp + heal);
      log(`${u.name}이(가) 회복술사로 ${heal} 회복.`);
      const idx = state.board.findIndex((item) => item === u);
      if (idx >= 0) showCellEffect(idx, `+${heal}`, "heal");
    }
    u.tempBonus = 0;
  });
  render();
  checkGameOver();
  resetTurnTimer();
}

function onEntityDefeated() {
  const rewardBase = 6 + state.stage * (state.entity.boss ? 4 : 2);
  const reward = Math.ceil(rewardBase * state.contractEffects.rewardMult);
  state.money += reward;
  log(`${state.entity.name} 격파! $${reward} 획득.`);
  showEntityEffect("격파");
  const dropChance = state.entity.boss ? 1 : 0.25;
  if (Math.random() < dropChance) {
    const card = keywordCardsPool[rand(0, keywordCardsPool.length - 1)];
    state.keywordCards.push(card);
    log(`키워드 부여 카드 획득: ${card}`);
  }
  const wasBoss = state.entity.boss;
  state.entity = null;
  state.nextTargets = [];
  renderAttackPreview();
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
      log("재정비 스테이지: 키워드를 부여하세요.");
      state.nextTargets = [];
      renderAttackPreview();
      resetTurnTimer();
      render();
      return;
    }
  } else {
    state.stageInCycle += 1;
    state.stage += 1;
  }

  spawnEntity();
  render();
}

function checkGameOver() {
  const alive = state.board.some((u) => u);
  if (!alive) {
    log("전장 전멸! 게임 종료");
    if (state.mode === "무한 모드") state.records.push({ stage: state.stage });
    showTitle();
  }
  if (state.mode === "스토리 모드" && state.stage > 20) {
    alert("최종 보스를 격파했습니다! 승리");
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

function activateScreen(id) {
  $$(".screen").forEach((p) => {
    p.classList.toggle("active", p.id === id);
  });
}

function showTitle() {
  activateScreen("title-screen");
  $("#contract-layer").classList.add("hidden");
  $("#shop-layer").classList.add("hidden");
  clearSacrificeButton();
  hideInspect();
  clearInterval(turnTimerId);
}

$("#story-btn").addEventListener("click", () => {
  resetState("스토리 모드");
  spawnEntity();
  activateScreen("game-screen");
});

$("#endless-btn").addEventListener("click", () => {
  resetState("무한 모드");
  spawnEntity();
  activateScreen("game-screen");
});

$("#record-btn").addEventListener("click", () => {
  updateRecords();
  activateScreen("record-screen");
});

$$('[data-action="to-title"]').forEach((btn) => btn.addEventListener("click", showTitle));
$("#summon-btn").addEventListener("click", () => summon(true));
$("#reroll-btn").addEventListener("click", reroll);
$("#overlay-reroll").addEventListener("click", reroll);
$("#close-shop").addEventListener("click", () => $("#shop-layer").classList.add("hidden"));
$("#end-turn-btn").addEventListener("click", endTurn);
$("#skip-contract").addEventListener("click", () => {
  log("계약을 건너뜀");
  closeContractModal();
  advanceStage();
  render();
});

document.addEventListener("click", (e) => {
  if (!activeSacrificeButton) return;
  const inCell = e.target.closest?.(".cell");
  if (!inCell || inCell !== activeSacrificeButton.parentElement) {
    clearSacrificeButton();
  }
});

render();
