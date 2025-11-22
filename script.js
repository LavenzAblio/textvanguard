/* eslint-disable no-alert */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const nameFragments = [
  "란", "뷅", "잉", "기", "슝", "딩", "무", "톤", "아", "리", "히", "치", "카", "로", "메", "탄",
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
  sacrificeMode: false,
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
  while (cards.length === 0 || (forceVanguard && vanguardCount === 0)) {
    cards = [];
    vanguardCount = 0;
    for (let i = 0; i < 6; i++) {
      const roll = Math.random();
      const isVanguard = roll < 0.6 || (forceVanguard && vanguardCount === 0 && i === 5);
      if (isVanguard) {
        cards.push(createVanguard(state.stage));
        vanguardCount++;
      } else {
        cards.push(createTactic());
      }
    }
  }
  const adjusted = cards.map((card) => applyShopCost(card));
  return adjusted.filter((card) => (card.type === "tactic" ? true : card.cost <= state.money * 1.5));
}

function renderShop() {
  $("#shop").classList.remove("hidden");
  $("#shop-money").textContent = `$${state.money}`;
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
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <div class="cost">버프</div>
      <h4>${c.name}</h4>
      <p class="muted">${c.buff}</p>
      <p class="muted">${c.debuff}</p>
    `;
    const btn = document.createElement("button");
    btn.textContent = "체결";
    btn.addEventListener("click", () => chooseContract(c));
    el.appendChild(btn);
    wrap.appendChild(el);
  });
}

function openContractModal() {
  state.contractChoices = pickContracts();
  renderContractChoices();
  $("#contract-screen").classList.remove("hidden");
}

function closeContractModal() {
  $("#contract-screen").classList.add("hidden");
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

function renderCards(container, cards, onClick) {
  container.innerHTML = "";
  cards.forEach((card) => container.appendChild(renderCard(card, () => onClick(card))));
}

function renderCard(card, onClick) {
  const el = document.createElement("article");
  el.className = "card";
  const btn = document.createElement("button");
  btn.textContent = card.type === "tactic" ? "사용" : "배치";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick(card);
  });

  const shownCost = card.type === "tactic" ? getTacticCost(card) : card.cost;

  el.innerHTML = `
    <div class="cost">$${shownCost}</div>
    <h4>${card.name}</h4>
    <div class="muted">${card.type === "tactic" ? "택틱" : `${card.role} · 사거리 ${card.range}`}</div>
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
  el.appendChild(btn);
  return el;
}

function log(msg) {
  state.log.unshift(msg);
  $("#log").textContent = state.log.slice(0, 60).join("\n");
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
    sacrificeMode: false,
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
    cell.addEventListener("click", () => onCellClick(idx));
    boardEl.appendChild(cell);
  });
}

function render() {
  $("#money-label").textContent = `$${state.money}`;
  const stageText = state.restStage ? `재정비 스테이지 (턴 종료 시 진행)` : `스테이지 ${state.stage}`;
  $("#stage-label").textContent = stageText;
  $("#cycle-label").textContent = `사이클 ${state.cyclesCompleted + 1}`;
  renderBoard();
  renderCards($("#gate"), state.gate, (card) => placeFromGate(card));
  renderCards($("#hand"), state.hand, (card) => playTactic(card));
  renderCards($("#keyword-cards"), state.keywordCards, (card) => applyKeyword(card));
  renderContracts();
  $("#shop-money").textContent = `$${state.money}`;
}

function renderContracts() {
  const wrap = $("#contracts");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (state.contracts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "아직 체결된 계약이 없습니다.";
    wrap.appendChild(empty);
    return;
  }
  state.contracts.forEach((c) => {
    const el = document.createElement("article");
    el.className = "card mini";
    el.innerHTML = `<h4>${c.name}</h4><p class="muted">${c.buff}</p><p class="muted">${c.debuff}</p>`;
    wrap.appendChild(el);
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

function placeFromGate(card) {
  const emptyIndex = state.board.findIndex((c) => !c);
  if (emptyIndex === -1) return alert("전장에 빈 칸이 없습니다.");
  state.board[emptyIndex] = { ...card, id: crypto.randomUUID() };
  state.gate = state.gate.filter((c) => c.id !== card.id);
  log(`${card.name}을(를) 전장에 배치했습니다.`);
  render();
}

function onCellClick(idx) {
  const unit = state.board[idx];
  if (state.sacrificeMode && unit) {
    const refund = Math.ceil(unit.cost * 0.3);
    state.money += refund;
    state.board[idx] = null;
    log(`${unit.name} 희생, $${refund} 환급.`);
    render();
    return;
  }
  if (unit) {
    moveUnit(idx);
  }
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
  const targets = [];
  for (let i = 0; i < state.entity.threat; i++) {
    const occupied = state.board.map((u, idx) => (u ? idx : null)).filter((v) => v != null);
    if (occupied.length === 0) break;
    const t = occupied[rand(0, occupied.length - 1)];
    targets.push(t);
  }
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
    if (unit.hp <= 0) handleDeath(idx, unit);
  });
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
    }
    u.tempBonus = 0;
  });
  render();
  checkGameOver();
}

function onEntityDefeated() {
  const rewardBase = 6 + state.stage * (state.entity.boss ? 4 : 2);
  const reward = Math.ceil(rewardBase * state.contractEffects.rewardMult);
  state.money += reward;
  log(`${state.entity.name} 격파! $${reward} 획득.`);
  const dropChance = state.entity.boss ? 1 : 0.25;
  if (Math.random() < dropChance) {
    const card = keywordCardsPool[rand(0, keywordCardsPool.length - 1)];
    state.keywordCards.push(card);
    log(`키워드 부여 카드 획득: ${card}`);
  }
  const wasBoss = state.entity.boss;
  state.entity = null;
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

function showTitle() {
  $$(".panel").forEach((p) => p.classList.add("hidden"));
  $("#title-screen").classList.remove("hidden");
}

$("#story-btn").addEventListener("click", () => {
  resetState("스토리 모드");
  spawnEntity();
  $("#mode-label").textContent = "스토리 모드";
  $("#title-screen").classList.add("hidden");
  $("#game-screen").classList.remove("hidden");
});

$("#endless-btn").addEventListener("click", () => {
  resetState("무한 모드");
  spawnEntity();
  $("#mode-label").textContent = "무한 모드";
  $("#title-screen").classList.add("hidden");
  $("#game-screen").classList.remove("hidden");
});

$("#record-btn").addEventListener("click", () => {
  updateRecords();
  $$(".panel").forEach((p) => p.classList.add("hidden"));
  $("#record-screen").classList.remove("hidden");
});

$$('[data-action="to-title"]').forEach((btn) => btn.addEventListener("click", showTitle));
$("#summon-btn").addEventListener("click", () => summon(true));
$("#reroll-btn").addEventListener("click", reroll);
$("#close-shop").addEventListener("click", () => $("#shop").classList.add("hidden"));
$("#end-turn-btn").addEventListener("click", endTurn);
$("[data-action='sacrifice']").addEventListener("click", () => {
  state.sacrificeMode = !state.sacrificeMode;
  log(state.sacrificeMode ? "희생 모드 활성화" : "희생 모드 종료");
});
$("#skip-contract").addEventListener("click", () => {
  log("계약을 건너뜀");
  closeContractModal();
  advanceStage();
  render();
});

renderBoard();
renderCards($("#gate"), [], () => {});
renderCards($("#hand"), [], () => {});
