/**
 * Créditos EscortBenidorm
 * 1 crédito base ≈ 1 € pagado
 *
 * Recarga libre: enteros de 1 a 1000 € (sin decimales)
 * Bonus:
 *   50–999 €  → +20 % créditos
 *   1000 €    → +50 % créditos
 *   1–49 €    → sin bonus
 */

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

const RECHARGE_MIN = 1;
const RECHARGE_MAX = 1000;
const BONUS_20_MIN = num(process.env.CREDIT_BONUS_MIN_EUR, 50); // inclusive
const BONUS_20_PCT = num(process.env.CREDIT_BONUS_PCT, 20);
const BONUS_50_AT = num(process.env.CREDIT_BONUS_MAX_AT, 1000); // exact max pack
const BONUS_50_PCT = num(process.env.CREDIT_BONUS_MAX_PCT, 50);

/**
 * Solo enteros 1..1000. Rechaza decimales, NaN, strings raras.
 * @returns {{ ok: true, amount: number } | { ok: false, error: string }}
 */
function parseRechargeAmount(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return { ok: false, error: "Indica un importe entre 1 y 1000 (solo enteros)" };
  }
  // reject decimals explicitly (string "10.5" or number 10.5)
  if (typeof raw === "string" && /[.,]/.test(raw.trim())) {
    return { ok: false, error: "No se permiten decimales. Usa un número entero de 1 a 1000." };
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: "No se permiten decimales. Usa un número entero de 1 a 1000." };
  }
  if (n < RECHARGE_MIN || n > RECHARGE_MAX) {
    return { ok: false, error: `El importe debe estar entre ${RECHARGE_MIN} y ${RECHARGE_MAX} €` };
  }
  return { ok: true, amount: n };
}

/**
 * Calcula base, bonus y total para un importe entero de recarga.
 * 1–49: +0% | 50–999: +20% | 1000: +50%
 */
function creditsForRechargeAmount(amountEur) {
  const parsed = parseRechargeAmount(amountEur);
  if (!parsed.ok) {
    return { ...parsed, base: 0, bonus: 0, totalCredits: 0, bonusPercent: 0 };
  }
  const amount = parsed.amount;
  const base = amount; // 1€ = 1 crédito base
  let bonusPercent = 0;
  if (amount >= BONUS_50_AT) {
    bonusPercent = BONUS_50_PCT;
  } else if (amount >= BONUS_20_MIN) {
    bonusPercent = BONUS_20_PCT;
  }
  // entero: floor para no generar fracciones
  const bonus = Math.floor((base * bonusPercent) / 100);
  const totalCredits = base + bonus;
  return {
    ok: true,
    amount,
    base,
    baseCredits: base,
    bonus,
    bonusPercent,
    totalCredits,
    qualifiesBonus: bonusPercent > 0,
    bonusLabel:
      bonusPercent > 0
        ? `+${bonusPercent}% extra (+${bonus} créd.)`
        : null,
  };
}

/** Atajos opcionales (usan la misma regla de bonus) */
const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000];

function listCreditPacks() {
  return QUICK_AMOUNTS.map((amount) => {
    const calc = creditsForRechargeAmount(amount);
    return {
      id: `a${amount}`,
      name: `${amount} €`,
      credits: amount,
      baseCredits: calc.base,
      price: amount,
      currency: "EUR",
      amount,
      bonus: calc.bonus,
      bonusPercent: calc.bonusPercent,
      totalCredits: calc.totalCredits,
      qualifiesBigBonus: calc.qualifiesBonus,
      qualifiesBonus: calc.qualifiesBonus,
      bonusLabel: calc.bonusLabel,
      tagline:
        calc.bonusPercent === 50
          ? "Máximo · +50% extra"
          : calc.bonusPercent === 20
            ? "+20% extra"
            : "Sin bonus",
      popular: amount === 50 || amount === 100,
    };
  });
}

function getCreditPack(id) {
  // a50, a100, p50 legacy, or numeric
  if (!id) return null;
  const s = String(id);
  let amount = null;
  if (/^a\d+$/i.test(s)) amount = Number(s.slice(1));
  else if (/^p(\d+)$/i.test(s)) amount = Number(RegExp.$1);
  else if (/^\d+$/.test(s)) amount = Number(s);
  if (amount == null) return null;
  const calc = creditsForRechargeAmount(amount);
  if (!calc.ok) return null;
  return {
    id: `a${amount}`,
    name: `${amount} €`,
    credits: amount,
    baseCredits: calc.base,
    price: amount,
    currency: "EUR",
    amount,
    bonus: calc.bonus,
    bonusPercent: calc.bonusPercent,
    totalCredits: calc.totalCredits,
    qualifiesBigBonus: calc.qualifiesBonus,
    qualifiesBonus: calc.qualifiesBonus,
    bonusLabel: calc.bonusLabel,
    tagline: calc.bonusLabel || "Recarga",
  };
}

/** Coste en créditos de un plan × días (enteros) */
function creditCostForPlan(plan, days = 1) {
  if (!plan || plan.price <= 0) return 0;
  const d = Math.min(30, Math.max(1, Math.floor(Number(days) || 1)));
  return Math.floor(Number(plan.price) * d);
}

module.exports = {
  RECHARGE_MIN,
  RECHARGE_MAX,
  BONUS_20_MIN,
  BONUS_20_PCT,
  BONUS_50_AT,
  BONUS_50_PCT,
  QUICK_AMOUNTS,
  parseRechargeAmount,
  creditsForRechargeAmount,
  listCreditPacks,
  getCreditPack,
  creditCostForPlan,
};
