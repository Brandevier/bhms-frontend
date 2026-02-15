// utils/pharmacyAbbreviations.js

/**
 * Comprehensive list of pharmacy/medical abbreviations
 * Organized by category for better maintenance
 */

export const pharmacyAbbreviations = {
  // DOSAGE FREQUENCIES
  frequency: [
    // Once daily variations
    { value: 'OD', label: 'Once daily', category: 'Daily' },
    { value: 'Q24H', label: 'Every 24 hours', category: 'Daily' },
    { value: 'Q.D.', label: 'Every day', category: 'Daily' },
    
    // Multiple times daily
    { value: 'BD', label: 'Twice daily', category: 'Daily' },
    { value: 'BID', label: 'Twice a day', category: 'Daily' },
    { value: 'TDS', label: 'Three times daily', category: 'Daily' },
    { value: 'TID', label: 'Three times a day', category: 'Daily' },
    { value: 'QID', label: 'Four times daily', category: 'Daily' },
    { value: 'Q6H', label: 'Every 6 hours', category: 'Daily' },
    { value: 'Q8H', label: 'Every 8 hours', category: 'Daily' },
    
    // Hourly intervals
    { value: 'Q1H', label: 'Every hour', category: 'Hourly' },
    { value: 'Q2H', label: 'Every 2 hours', category: 'Hourly' },
    { value: 'Q3H', label: 'Every 3 hours', category: 'Hourly' },
    { value: 'Q4H', label: 'Every 4 hours', category: 'Hourly' },
    { value: 'Q12H', label: 'Every 12 hours', category: 'Hourly' },
    
    // Meal-related
    { value: 'AC', label: 'Before meals', category: 'Meal' },
    { value: 'PC', label: 'After meals', category: 'Meal' },
    { value: 'BPC', label: 'Before and after meals', category: 'Meal' },
    
    // Time of day
    { value: 'QAM', label: 'Every morning', category: 'Time' },
    { value: 'QPM', label: 'Every evening', category: 'Time' },
    { value: 'QHS', label: 'At bedtime', category: 'Time' },
    { value: 'HS', label: 'At bedtime', category: 'Time' },
    
    // Weekly/Monthly
    { value: 'QW', label: 'Once weekly', category: 'Long Term' },
    { value: 'QWK', label: 'Every week', category: 'Long Term' },
    { value: 'Q2W', label: 'Every 2 weeks', category: 'Long Term' },
    { value: 'QMO', label: 'Every month', category: 'Long Term' },
    { value: 'Q3MO', label: 'Every 3 months', category: 'Long Term' },
    
    // As needed/Conditional
    { value: 'PRN', label: 'As needed', category: 'Conditional' },
    { value: 'SOS', label: 'If needed (once)', category: 'Conditional' },
    { value: 'STAT', label: 'Immediately', category: 'Conditional' },
    { value: 'NOW', label: 'Now', category: 'Conditional' },
    
    // Other frequencies
    { value: 'QOD', label: 'Every other day', category: 'Other' },
    { value: 'Q2D', label: 'Every 2 days', category: 'Other' },
    { value: 'Q3D', label: 'Every 3 days', category: 'Other' },
  ],

  // ROUTES OF ADMINISTRATION
  route: [
    { value: 'PO', label: 'By mouth (Oral)' },
    { value: 'SC', label: 'Subcutaneous' },
    { value: 'IM', label: 'Intramuscular' },
    { value: 'IV', label: 'Intravenous' },
    { value: 'SL', label: 'Sublingual' },
    { value: 'BUCC', label: 'Buccal' },
    { value: 'PR', label: 'Rectal' },
    { value: 'PV', label: 'Vaginal' },
    { value: 'INH', label: 'Inhalation' },
    { value: 'TOP', label: 'Topical' },
    { value: 'OPHTH', label: 'Ophthalmic' },
    { value: 'OTIC', label: 'Otic' },
    { value: 'NAS', label: 'Nasal' },
  ],

  // DOSAGE FORMS
  dosageForm: [
    { value: 'TAB', label: 'Tablet' },
    { value: 'CAP', label: 'Capsule' },
    { value: 'SYR', label: 'Syrup' },
    { value: 'SUSP', label: 'Suspension' },
    { value: 'SOLN', label: 'Solution' },
    { value: 'INJ', label: 'Injection' },
    { value: 'CREAM', label: 'Cream' },
    { value: 'OINT', label: 'Ointment' },
    { value: 'GEL', label: 'Gel' },
    { value: 'PATCH', label: 'Transdermal patch' },
    { value: 'SUPP', label: 'Suppository' },
    { value: 'DROP', label: 'Drops' },
    { value: 'SPRAY', label: 'Spray' },
    { value: 'POWD', label: 'Powder' },
    { value: 'GARGLE', label: 'Gargle' },
  ],

  // TIME-RELATED
  time: [
    { value: 'AC', label: 'Before meals' },
    { value: 'PC', label: 'After meals' },
    { value: 'HS', label: 'At bedtime' },
    { value: 'QAM', label: 'Every morning' },
    { value: 'QPM', label: 'Every evening' },
    { value: 'QOD', label: 'Every other day' },
  ],

  // SPECIAL INSTRUCTIONS
  instructions: [
    { value: 'TAKE WITH FOOD', label: 'Take with food' },
    { value: 'TAKE ON EMPTY STOMACH', label: 'Take on empty stomach' },
    { value: 'DO NOT CRUSH', label: 'Do not crush or chew' },
    { value: 'CRUSH', label: 'May crush if needed' },
    { value: 'SHAKE WELL', label: 'Shake well before use' },
    { value: 'REFRI', label: 'Refrigerate' },
    { value: 'DO NOT REFRI', label: 'Do not refrigerate' },
    { value: 'PROTECT FROM LIGHT', label: 'Protect from light' },
    { value: 'AVOID ALCOHOL', label: 'Avoid alcohol' },
    { value: 'WITH PLENTY WATER', label: 'Take with plenty of water' },
  ],

  // UNITS OF MEASUREMENT
  units: [
    { value: 'MG', label: 'Milligram' },
    { value: 'G', label: 'Gram' },
    { value: 'MCG', label: 'Microgram' },
    { value: 'ML', label: 'Milliliter' },
    { value: 'L', label: 'Liter' },
    { value: 'IU', label: 'International Unit' },
    { value: 'MEQ', label: 'Milliequivalent' },
    { value: '%', label: 'Percent' },
    { value: 'M', label: 'Molar' },
    { value: 'MMOL', label: 'Millimole' },
  ],

  // COMMON MEDICAL ABBREVIATIONS
  medical: [
    { value: 'BP', label: 'Blood Pressure' },
    { value: 'HR', label: 'Heart Rate' },
    { value: 'RR', label: 'Respiratory Rate' },
    { value: 'TEMP', label: 'Temperature' },
    { value: 'SPO2', label: 'Oxygen Saturation' },
    { value: 'BMI', label: 'Body Mass Index' },
    { value: 'CBC', label: 'Complete Blood Count' },
    { value: 'LFT', label: 'Liver Function Test' },
    { value: 'RFT', label: 'Renal Function Test' },
    { value: 'ECG', label: 'Electrocardiogram' },
    { value: 'CT', label: 'Computed Tomography' },
    { value: 'MRI', label: 'Magnetic Resonance Imaging' },
  ],

  // PRESCRIPTION DIRECTIVES
  directives: [
    { value: 'DAW', label: 'Dispense As Written' },
    { value: 'SUB', label: 'Substitution allowed' },
    { value: 'NR', label: 'No refill' },
    { value: 'UD', label: 'As directed' },
    { value: 'AD LIB', label: 'As desired' },
    { value: 'TIW', label: 'Three times a week' },
    { value: 'BIW', label: 'Twice a week' },
  ]
};

// Helper function to get all frequency options for forms
export const getFrequencyOptions = () => {
  return pharmacyAbbreviations.frequency.map(item => ({
    value: item.value,
    label: item.label,
  }));
};

// Helper function to get options by category
export const getFrequencyOptionsByCategory = () => {
  const categories = {};
  pharmacyAbbreviations.frequency.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push({
      value: item.value,
      label: `${item.value} - ${item.label}`,
    });
  });
  return categories;
};

// Helper function to get full name by abbreviation
export const getFullText = (abbreviation, type = 'frequency') => {
  const category = pharmacyAbbreviations[type];
  if (!category) return abbreviation;
  
  const found = category.find(item => item.value === abbreviation);
  return found ? found.label : abbreviation;
};

// Export all abbreviations for easy import
export const ALL_ABBREVIATIONS = {
  ...pharmacyAbbreviations.frequency.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {}),
  ...pharmacyAbbreviations.route.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {}),
  ...pharmacyAbbreviations.dosageForm.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {}),
};