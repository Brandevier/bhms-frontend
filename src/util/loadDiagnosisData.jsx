// utils/diagnosisParser.js
export const loadDiagnosisData = async () => {
    try {
      const response = await fetch('/medi/diagnosis.csv');
      const csvData = await response.text();
      
      return csvData.split('\n')
        .map(line => {
          // Remove quotes and split by tab or multiple spaces
          const cleanedLine = line.replace(/"/g, '').trim();
          const [id, code, level, name, description] = cleanedLine.split(/\t|\s{2,}/);
          
          return {
            id,
            code: code?.trim(),
            level: parseInt(level),
            name: name?.trim(),
            description: description?.trim()
          };
        })
        .filter(d => d.code && d.name); // Filter out invalid entries
    } catch (error) {
      console.error('Error loading diagnosis data:', error);
      return [];
    }
  };