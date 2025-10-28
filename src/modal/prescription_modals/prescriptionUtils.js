// Helper function to extract numeric strength from string
export const extractStrengthValue = (strengthString) => {
  if (!strengthString) return null;
  
  // Handle various formats: "500mg", "500 mg", "0.5g", "10mg/ml", etc.
  const match = strengthString.match(/(\d+(\.\d+)?)\s*([a-zA-Z]+\/?[a-zA-Z]*)/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[3].toLowerCase(),
      original: strengthString
    };
  }
  return null;
};

// Helper function to convert units if needed
export const convertToCommonUnit = (value, fromUnit, toUnit) => {
  const unitConversions = {
    'g': { 'mg': 1000, 'mcg': 1000000 },
    'mg': { 'mcg': 1000, 'g': 0.001 },
    'mcg': { 'mg': 0.001, 'g': 0.000001 },
    'kg': { 'g': 1000 },
    'ml': { 'l': 0.001 },
    'l': { 'ml': 1000 }
  };
  
  if (fromUnit === toUnit) return value;
  return value * (unitConversions[fromUnit]?.[toUnit] || 1);
};

// Check if we're dealing with whole units (tablets, capsules) vs weight/volume units
export const isWholeUnit = (unit) => {
  return unit.includes('tablet') || unit.includes('capsule') || unit.includes('unit');
};

// Calculate quantity with strength adjustment - SIMPLIFIED LOGIC
export const calculateMedicationQuantity = (dosage, frequency, duration, doseUnitType, availableStrength) => {
  console.log('Calculating with:', { dosage, frequency, duration, doseUnitType, availableStrength });
  
  // Basic validation
  if (!dosage || !frequency || !duration || !availableStrength) {
    return {
      quantity: 0,
      adjustmentInfo: null,
      requiresStrengthAdjustment: false
    };
  }

  // If using whole units (tablets, capsules), no strength adjustment needed
  if (isWholeUnit(doseUnitType)) {
    const quantity = dosage * frequency * duration;
    console.log('Using whole units, quantity:', quantity);
    
    return {
      quantity: Math.ceil(quantity),
      adjustmentInfo: null,
      requiresStrengthAdjustment: false
    };
  }

  // For weight/volume units, we need to compare with available strength
  const prescribedStrength = extractStrengthValue(`${dosage}${doseUnitType}`);
  const availableStrengthInfo = extractStrengthValue(availableStrength);

  if (!prescribedStrength || !availableStrengthInfo) {
    // If we can't parse the strengths, fall back to basic calculation
    const quantity = dosage * frequency * duration;
    console.log('Could not parse strengths, using basic calculation:', quantity);
    
    return {
      quantity: Math.ceil(quantity),
      adjustmentInfo: null,
      requiresStrengthAdjustment: false
    };
  }

  // Convert both to common unit (mg) for calculation
  const prescribedInMg = convertToCommonUnit(prescribedStrength.value, prescribedStrength.unit, 'mg');
  const availableInMg = convertToCommonUnit(availableStrengthInfo.value, availableStrengthInfo.unit, 'mg');

  console.log('Strength comparison:', {
    prescribed: `${prescribedInMg}mg`,
    available: `${availableInMg}mg`
  });

  // Calculate how many units needed based on strength ratio
  const strengthRatio = prescribedInMg / availableInMg;
  const baseQuantity = frequency * duration; // This is the number of administration events
  const calculatedQty = baseQuantity * strengthRatio;

  console.log('Strength ratio:', strengthRatio, 'Base quantity:', baseQuantity, 'Final quantity:', calculatedQty);

  const adjustmentInfo = {
    prescribedMg: prescribedInMg,
    availableMg: availableInMg,
    adjustmentFactor: strengthRatio,
    calculatedQuantity: Math.ceil(calculatedQty)
  };

  return {
    quantity: Math.ceil(calculatedQty),
    adjustmentInfo,
    requiresStrengthAdjustment: Math.abs(strengthRatio - 1) > 0.001
  };
};

// Quick calculation for simple cases (when no strength adjustment needed)
export const quickCalculateQuantity = (dosage, frequency, duration) => {
  if (!dosage || !frequency || !duration) return 0;
  return Math.ceil(dosage * frequency * duration);
};

// Constants
export const frequencyOptions = [
  { label: "QD (Once daily)", value: 1 },
  { label: "BID (Twice daily)", value: 2 },
  { label: "TID (Three times daily)", value: 3 },
  { label: "QID (Four times daily)", value: 4 },
  { label: "Q4H (Every 4 hours)", value: 6 },
  { label: "Q6H (Every 6 hours)", value: 4 },
  { label: "Q8H (Every 8 hours)", value: 3 },
  { label: "Q12H (Every 12 hours)", value: 2 },
  { label: "QHS (At bedtime)", value: 1 },
  { label: "PRN (As needed)", value: 0 },
];

export const doseUnitOptions = [
  { value: "tablet(s)", label: "Tablet(s)" },
  { value: "capsule(s)", label: "Capsule(s)" },
  { value: "ml", label: "ml" },
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "mcg", label: "mcg" },
  { value: "IU", label: "IU" },
  { value: "unit(s)", label: "Unit(s)" },
];

export const routeOptions = [
  { value: "oral", label: "Oral" },
  { value: "injection", label: "Injection" },
  { value: "topical", label: "Topical" },
  { value: "inhalation", label: "Inhalation" },
  { value: "rectal", label: "Rectal" },
  { value: "iv", label: "IV" },
  { value: "im", label: "IM" },
];