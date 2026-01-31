// Engineering Standards Database for Calculators
// IS (Indian Standard), ASTM (American), BS (British), EN (European)

export const STANDARDS_DATA = {
  // CONCRETE TECHNOLOGY STANDARDS
  concrete: {
    cement: {
      title: 'Cement Concrete Mix Design',
      formula: 'Dry Volume = Wet Volume × 1.54 | Cement (bags) = (Dry Volume × Ratio%) ÷ 0.0347',
      standards: [
        'IS 456:2000 - Code of Practice for Plain and Reinforced Concrete',
        'IS 1199:1959 - Method of Sampling and Analysis of Concrete',
        'ASTM C 31 - Practice for Making and Curing Concrete Test Specimens',
        'BS 1881-101:1983 - Testing Concrete'
      ],
      grades: {
        'M5': { ratio: '1:5:10', strength: '5 MPa', description: 'Lean concrete for leveling' },
        'M7.5': { ratio: '1:4:8', strength: '7.5 MPa', description: 'Foundation concrete' },
        'M10': { ratio: '1:3:6', strength: '10 MPa', description: 'Light structural work' },
        'M15': { ratio: '1:2:4', strength: '15 MPa', description: 'General structural work' },
        'M20': { ratio: '1:1.5:3', strength: '20 MPa', description: 'Reinforced concrete' },
        'M25': { ratio: '1:1:2', strength: '25 MPa', description: 'High-strength work' },
        'M30': { ratio: '1:1:2', strength: '30 MPa', description: 'RCC columns and beams' },
        'M40': { ratio: '1:0.82:1.64', strength: '40 MPa', description: 'Pre-stressed concrete' },
        'M80': { ratio: '1:0.41:0.82', strength: '80 MPa', description: 'High-performance concrete' },
      },
      cementTypes: {
        'OPC': 'Ordinary Portland Cement - 53 Grade',
        'PPC': 'Portland Pozzolana Cement',
        'SRC': 'Slag Rich Cement',
        'PSC': 'Portland Slag Cement'
      }
    },
    brick: {
      title: 'Brick Masonry Calculation',
      formula: 'No. of Bricks = (Wall Area ÷ Brick Area) × (1 + wastage%)',
      standards: [
        'IS 1077:1992 - Common Burnt Clay Building Bricks',
        'IS 2222:1991 - Bricks and Blocks - Types and Properties',
        'ASTM C 62 - Standard Specification for Building Brick',
        'BS 3921:1985 - Specification for Clay Bricks'
      ],
      brickTypes: {
        'Standard': { size: '190×90×90 mm', count: 500 },
        'Modular': { size: '190×90×90 mm', count: 500 },
        'Closure': { size: '190×90×40 mm', count: 1000 },
        'Jumbo': { size: '290×140×90 mm', count: 200 }
      }
    },
    block: {
      title: 'Concrete Block Calculator',
      formula: 'No. of Blocks = Wall Area ÷ Block Area (with 10mm mortar joint)',
      standards: [
        'IS 2185 (Part 1):2008 - Concrete Blocks for General Building Construction',
        'IS 2185 (Part 2):2008 - Hollow Concrete Block',
        'ASTM C 90 - Standard Specification for Load-bearing Concrete Masonry Units',
        'BS 2028:1364 - Precast Concrete Blocks'
      ],
      blockSizes: {
        '400×200×100': { usage: 'Walls' },
        '400×200×150': { usage: 'Heavy-duty structures' },
        '600×200×150': { usage: 'Large spans' },
        '300×200×100': { usage: 'Partition walls' }
      }
    },
    plaster: {
      title: 'Plastering Material Estimation',
      formula: 'Sand = Plaster Area × Thickness × Density | Cement Bags = (Ratio × Sand Volume) ÷ 50',
      standards: [
        'IS 1521:1992 - Lime (For Building Purpose)',
        'IS 1498:2012 - Sand for Masonry Work',
        'ASTM C 144 - Standard Specification for Aggregate for Masonry Mortar',
        'BS 1199-1200:1976 - Mortar Specifications'
      ],
      ratio: '1:3 or 1:4'
    }
  },

  // SOIL & GEOTECHNICAL STANDARDS
  soil: {
    waterContent: {
      title: 'Water Content Test (Moisture Content)',
      formula: 'Water Content (%) = [(Moist Mass - Dry Mass) ÷ Dry Mass] × 100',
      standards: [
        'IS 2720 (Part II):1973 - Determination of Water Content',
        'ASTM D 2216 - Standard Test Method for Laboratory Determination of Water Content',
        'BS 1377:2-3:1990 - Soil Testing'
      ]
    },
    specificGravity: {
      title: 'Specific Gravity of Soil',
      formula: 'Gs = (Mass of Soil ÷ Volume of Soil) ÷ Density of Water',
      standards: [
        'IS 2720 (Part III):1980 - Determination of Specific Gravity',
        'ASTM D 854 - Standard Test Methods for Specific Gravity of Soil Solids',
        'BS 1377:2.2:1990 - Specific Gravity Determination'
      ]
    },
    freeSwell: {
      title: 'Free Swell Index',
      formula: 'FSI (%) = [(V₂ - V₁) ÷ V₁] × 100',
      standards: [
        'IS 2720 (Part XL):1977 - Free Swell Index of Soils',
        'ASTM D 4546 - Standard Test Method for One-Dimensional Swell (or Settlement) Potential',
        'BS 1377:5.5:1990 - Expansion Testing'
      ]
    },
    liquidLimit: {
      title: 'Liquid Limit (Atterberg Limit)',
      formula: 'LL = 0.417 × Number of blows^0.121 × Water Content%',
      standards: [
        'IS 2720 (Part V):1985 - Determination of Liquid and Plastic Limit',
        'ASTM D 4318 - Standard Test Methods for Liquid Limit, Plastic Limit, and Plasticity Index',
        'BS 1377:2.4:1990 - Liquid Limit Determination'
      ]
    },
    CBR: {
      title: 'California Bearing Ratio',
      formula: 'CBR (%) = [Load at 2.5mm Penetration ÷ Standard Load] × 100',
      standards: [
        'IS 2720 (Part XVI):1979 - Laboratory Determination of CBR',
        'ASTM D 1883 - Standard Test Method for CBR of Laboratory-Compacted Soils',
        'BS 1377:4.3:1990 - CBR Testing'
      ]
    }
  },

  // FOUNDATION STANDARDS
  foundation: {
    sieveAnalysis: {
      title: 'Sieve Analysis - Soil Gradation',
      formula: '% Passing = (Mass Passing ÷ Total Mass) × 100',
      standards: [
        'IS 2720 (Part IV):1985 - Grain Size Analysis',
        'ASTM D 6913 - Standard Test Methods for Particle-Size Distribution (Gradation)',
        'BS 1377:2.1:1990 - Sieve Analysis'
      ]
    },
    bearingCapacity: {
      title: 'Bearing Capacity of Soil',
      formula: 'qf = cNc + γDfNq + 0.5γBNγ',
      standards: [
        'IS 6403:1981 - Code of Practice for Determination of Bearing Capacity',
        'ASTM D 3441 - Standard Test Method for Mechanical Cone Penetrometer',
        'BS 8103:1985 - Foundation Design'
      ]
    }
  },

  // STEEL DESIGN STANDARDS
  steel: {
    weight: {
      title: 'Steel Bar Weight Calculation',
      formula: 'Weight (kg) = (d² ÷ 162) × Length (m) [where d = dia in mm]',
      standards: [
        'IS 432 (Part 1):1982 - Mild Steel and Medium Tensile Steel',
        'IS 1786:2008 - High Strength Deformed Steel Bars',
        'ASTM A 615 - Standard Specification for Deformed and Plain Carbon-Steel Bars',
        'BS 4449:2005 - Steel for the Reinforcement of Concrete'
      ],
      barSizes: {
        '6 mm': '0.222 kg/m',
        '8 mm': '0.395 kg/m',
        '10 mm': '0.617 kg/m',
        '12 mm': '0.889 kg/m',
        '16 mm': '1.578 kg/m',
        '20 mm': '2.466 kg/m',
        '25 mm': '3.853 kg/m',
        '32 mm': '6.313 kg/m',
        '40 mm': '9.864 kg/m'
      }
    },
    quantity: {
      title: 'Steel Quantity Estimation',
      formula: 'Total Steel = Main Steel + Distribution Steel + Ties',
      standards: [
        'IS 456:2000 - RCC Code',
        'IS 1786:2008 - Deformed Steel Bars',
        'ASTM A 706 - Specification for Low-Alloy Steel Deformed Bars',
        'EN 10080:2005 - Steel for the Reinforcement of Concrete'
      ],
      percentages: {
        'Slab': '0.6-0.8%',
        'Beam': '0.8-1.2%',
        'Column': '1.0-3.0%',
        'Foundation': '0.5-1.0%'
      }
    },
    roundColumn: {
      title: 'Round Column Design',
      formula: 'Steel (%) = [4 × π × (d/2)² × n] ÷ [π × (D/2)²] × 100',
      standards: [
        'IS 456:2000 - Plain and Reinforced Concrete',
        'IS 13920:2016 - Ductile Detailing of Reinforced Concrete Structures',
        'ASTM C 805 - Standard Test Method for Access Covers and Grates'
      ]
    }
  },

  // FLUID MECHANICS STANDARDS
  fluid: {
    tankVolume: {
      title: 'Tank Volume Calculation',
      formula: 'Volume = π × r² × h (cylindrical) | Volume = l × w × h (rectangular)',
      standards: [
        'IS 2825:1974 - Code of Practice for Design and Fabrication of Vertical Mild Steel',
        'IS 4651:1971 - Code of Practice for Welded Cylindrical Oil Storage Tanks',
        'ASTM D 1052 - Standard Practice for Measuring Dimensions and Specifications'
      ]
    },
    openChannelFlow: {
      title: 'Open Channel Flow (Manning Equation)',
      formula: 'Q = (1/n) × A × R^(2/3) × S^(1/2)',
      standards: [
        'IS 2596:1974 - Open Channel Flow',
        'ASTM D 5233 - Standard Guide for Using the Manning Equation',
        'EN ISO 748 - Hydrometric Determinations'
      ]
    }
  },

  // SURVEYING STANDARDS
  surveying: {
    unitConverter: {
      title: 'Unit Conversion',
      standards: [
        'IS 2:1960 - Units and Standards of Measurements',
        'ASTM IEEE 260.1 - Standard Letter Symbols and Abbreviations',
        'EN ISO 80000 - Quantities and Units'
      ]
    },
    roofPitch: {
      title: 'Roof Pitch Calculation',
      formula: 'Pitch = Rise ÷ Run (typically expressed as X:12)',
      standards: [
        'IS 875 (Part 2):1987 - Design Loads for Buildings - Wind Loads',
        'ASTM F 3087 - Standard Safety Specification for Roof Slope Verification'
      ]
    }
  },

  // HEALTH STANDARDS
  health: {
    bmi: {
      title: 'Body Mass Index (BMI)',
      formula: 'BMI = Weight (kg) ÷ [Height (m)]²',
      standards: [
        'WHO - World Health Organization Guidelines',
        'National Heart, Lung, and Blood Institute Standards',
        'ISO/IEC 27001:2013 - Health Data Management'
      ],
      categories: {
        'Underweight': '< 18.5',
        'Normal Weight': '18.5 - 24.9',
        'Overweight': '25.0 - 29.9',
        'Obese': '>= 30'
      }
    }
  },

  // MATHEMATICAL STANDARDS
  math: {
    percentage: {
      title: 'Percentage Calculation',
      formula: 'Percentage = (Part ÷ Whole) × 100',
      standards: [
        'ISO/IEC 80000-2:2019 - Quantities and Units - Mathematical Notations'
      ]
    },
    constructionCost: {
      title: 'Construction Cost Estimation',
      formula: 'Total Cost = Rate per Unit × Quantity',
      standards: [
        'IS 13430:1992 - Methodology for Determining Cost of Standard Activities'
      ]
    }
  }
};

// Helper function to get standards for a calculator
export const getCalculatorStandards = (category, calculatorType) => {
  const categoryStandards = STANDARDS_DATA[category];
  if (!categoryStandards) return [];
  
  const calcStandards = categoryStandards[calculatorType];
  return calcStandards ? calcStandards.standards : [];
};

// Helper function to get formula
export const getCalculatorFormula = (category, calculatorType) => {
  const categoryStandards = STANDARDS_DATA[category];
  if (!categoryStandards) return '';
  
  const calcStandards = categoryStandards[calculatorType];
  return calcStandards ? calcStandards.formula : '';
};
