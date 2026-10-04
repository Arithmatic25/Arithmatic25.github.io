(function exposeFrameLabLogic(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.FrameLabLogic = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createFrameLabLogic() {
  'use strict';

  const finite = (value) => Number.isFinite(Number(value));
  const number = (value) => Number(value);
  const round = (value, places = 4) => {
    const factor = 10 ** places;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  };

  function truePosition({ nominalX, nominalY, measuredX, measuredY }) {
    if (![nominalX, nominalY, measuredX, measuredY].every(finite)) {
      return { ok: false, error: 'Enter all four coordinate values.' };
    }
    const dx = number(measuredX) - number(nominalX);
    const dy = number(measuredY) - number(nominalY);
    const radial = Math.hypot(dx, dy);
    return {
      ok: true,
      dx: round(dx),
      dy: round(dy),
      radial: round(radial),
      diametrical: round(radial * 2)
    };
  }

  function materialBonus({ featureType = 'internal', mmc, actual, statedTolerance }) {
    if (![mmc, actual, statedTolerance].every(finite)) {
      return { ok: false, error: 'Enter MMC size, actual size, and stated tolerance.' };
    }
    const mmcValue = number(mmc);
    const actualValue = number(actual);
    const stated = number(statedTolerance);
    if (mmcValue <= 0 || actualValue <= 0 || stated < 0) {
      return { ok: false, error: 'Sizes must be positive and tolerance cannot be negative.' };
    }
    const rawBonus = featureType === 'external' ? mmcValue - actualValue : actualValue - mmcValue;
    const bonus = Math.max(0, rawBonus);
    return {
      ok: true,
      bonus: round(bonus),
      totalTolerance: round(stated + bonus),
      warning: rawBonus < 0 ? 'Actual size is beyond MMC; verify the size requirement.' : ''
    };
  }

  function fixedFastener({ clearanceMmc, fastenerMmc, allocation = 50 }) {
    if (![clearanceMmc, fastenerMmc, allocation].every(finite)) {
      return { ok: false, error: 'Enter both MMC sizes and an allocation.' };
    }
    const hole = number(clearanceMmc);
    const fastener = number(fastenerMmc);
    const share = number(allocation);
    if (hole <= 0 || fastener <= 0 || share < 0 || share > 100) {
      return { ok: false, error: 'Use positive sizes and an allocation from 0% to 100%.' };
    }
    const budget = hole - fastener;
    if (budget < 0) {
      return { ok: false, error: 'The fastener MMC is larger than the clearance-hole MMC.' };
    }
    const clearanceTolerance = budget * (share / 100);
    return {
      ok: true,
      totalBudget: round(budget),
      clearanceTolerance: round(clearanceTolerance),
      threadedTolerance: round(budget - clearanceTolerance)
    };
  }

  function projectedZone({ zoneDiameter, projectedHeight, angleDegrees, basePosition = 0 }) {
    if (![zoneDiameter, projectedHeight, angleDegrees, basePosition].every(finite)) {
      return { ok: false, error: 'Enter the zone, projection height, angle, and base position.' };
    }
    const zone = number(zoneDiameter);
    const height = number(projectedHeight);
    const angle = Math.abs(number(angleDegrees));
    const base = Math.max(0, number(basePosition));
    if (zone < 0 || height <= 0 || angle >= 90) {
      return { ok: false, error: 'Use a positive height and an angle below 90°.' };
    }
    const diametricalDrift = 2 * height * Math.tan(angle * Math.PI / 180);
    const worstCase = base + diametricalDrift;
    const margin = zone - worstCase;
    const maxAngle = zone > base
      ? Math.atan(((zone - base) / 2) / height) * 180 / Math.PI
      : 0;
    return {
      ok: true,
      diametricalDrift: round(diametricalDrift),
      worstCase: round(worstCase),
      margin: round(margin),
      maxAngle: round(maxAngle, 5),
      passes: margin >= -1e-10
    };
  }

  function coaxialBudget({ holeOneMmc, holeTwoMmc, shaftOneMmc, shaftTwoMmc, allocation = 50 }) {
    if (![holeOneMmc, holeTwoMmc, shaftOneMmc, shaftTwoMmc, allocation].every(finite)) {
      return { ok: false, error: 'Enter all four MMC diameters and an allocation.' };
    }
    const share = number(allocation);
    if (share < 0 || share > 100) return { ok: false, error: 'Allocation must be from 0% to 100%.' };
    const budget = number(holeOneMmc) + number(holeTwoMmc) - number(shaftOneMmc) - number(shaftTwoMmc);
    if (budget < 0) return { ok: false, error: 'The mating shaft stack is larger than the hole stack.' };
    const firstTolerance = budget * (share / 100);
    return {
      ok: true,
      totalBudget: round(budget),
      firstTolerance: round(firstTolerance),
      secondTolerance: round(budget - firstTolerance)
    };
  }

  return { truePosition, materialBonus, fixedFastener, projectedZone, coaxialBudget, round };
}));
