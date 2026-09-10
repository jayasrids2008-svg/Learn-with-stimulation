import { PracticeExerciseSet, SubjectDifficulty } from '@/types';

export const CURATED_PRACTICE_SETS: Record<string, PracticeExerciseSet[]> = {
  'Mathematics': [
    {
      id: 'math-calculus-1',
      subject: 'Mathematics',
      topic: 'Calculus & Derivatives',
      difficulty: 'Intermediate',
      summaryNotes: 'Derivatives represent the instantaneous rate of change of a function. Key rules include Power Rule d/dx[x^n]=n*x^(n-1), Product Rule, Quotient Rule, and Chain Rule d/dx[f(g(x))]=f\'(g(x))*g\'(x).',
      keyFormulasOrConcepts: [
        'Power Rule: d/dx(x^n) = n*x^(n-1)',
        'Chain Rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)',
        'Product Rule: (uv)\' = u\'v + uv\'',
        'Quotient Rule: (u/v)\' = (u\'v - uv\') / v²',
        'Critical points occur where f\'(x) = 0 or f\'(x) is undefined'
      ],
      questions: [
        {
          id: 'mc-1',
          question: 'What is the derivative of f(x) = 4x^3 - 5x^2 + 7x - 9 with respect to x?',
          options: [
            '12x^2 - 10x + 7',
            '12x^3 - 10x^2 + 7',
            '4x^2 - 5x + 7',
            '12x^2 - 5x + 7'
          ],
          correctIndex: 0,
          explanation: 'Using the power rule: d/dx(4x^3) = 12x^2, d/dx(-5x^2) = -10x, d/dx(7x) = 7, and the derivative of a constant -9 is 0. Thus f\'(x) = 12x^2 - 10x + 7.',
          hint: 'Multiply the coefficient by the current exponent and reduce the exponent by 1.',
          conceptTag: 'Power Rule Differentiation'
        },
        {
          id: 'mc-2',
          question: 'If f(x) = sin(3x^2), what is f\'(x) using the Chain Rule?',
          options: [
            'cos(3x^2)',
            '6x · cos(3x^2)',
            '3x · cos(3x^2)',
            '6x · sin(3x^2)'
          ],
          correctIndex: 1,
          explanation: 'By Chain Rule: outer derivative is cos(3x^2), and inner derivative of 3x^2 is 6x. Multiplying them gives 6x · cos(3x^2).',
          hint: 'Differentiate the outside function (sin) then multiply by the derivative of inside (3x^2).',
          conceptTag: 'Chain Rule'
        },
        {
          id: 'mc-3',
          question: 'What is the definite integral of 3x^2 dx from x = 0 to x = 3?',
          options: [
            '9',
            '18',
            '27',
            '81'
          ],
          correctIndex: 2,
          explanation: 'The anti-derivative of 3x^2 is x^3. Evaluating [x^3] from 0 to 3 gives 3^3 - 0^3 = 27 - 0 = 27.',
          hint: 'Integrate 3x^2 to get x^3, then calculate F(3) - F(0).',
          conceptTag: 'Definite Integration'
        },
        {
          id: 'mc-4',
          question: 'At which point does the curve f(x) = x^2 - 6x + 8 achieve its minimum value?',
          options: [
            'x = 0',
            'x = 3',
            'x = 6',
            'x = -3'
          ],
          correctIndex: 1,
          explanation: 'Set derivative f\'(x) = 2x - 6 = 0 => 2x = 6 => x = 3. Since f\'\'(x) = 2 > 0, x = 3 is a local minimum.',
          hint: 'Find the first derivative and set it to zero.',
          conceptTag: 'Optimization & Critical Points'
        }
      ]
    },
    {
      id: 'math-linear-algebra-1',
      subject: 'Mathematics',
      topic: 'Linear Algebra & Matrices',
      difficulty: 'Intermediate',
      summaryNotes: 'Matrices represent linear transformations. Crucial concepts include Determinants det(A), matrix multiplication (rows dot columns), eigenvalues/eigenvectors Av = λv, and matrix inverse.',
      keyFormulasOrConcepts: [
        'Determinant of 2x2: det([a b; c d]) = ad - bc',
        'A matrix is invertible if and only if det(A) ≠ 0',
        'Eigenvalue equation: det(A - λI) = 0',
        'Matrix multiplication is associative but NOT commutative (AB ≠ BA generally)'
      ],
      questions: [
        {
          id: 'la-1',
          question: 'What is the determinant of the 2x2 matrix [[4, 2], [3, 5]]?',
          options: ['14', '20', '26', '6'],
          correctIndex: 0,
          explanation: 'det(A) = (4 * 5) - (2 * 3) = 20 - 6 = 14.',
          hint: 'Formula is (a*d) - (b*c).',
          conceptTag: 'Matrix Determinants'
        },
        {
          id: 'la-2',
          question: 'Which condition proves a square matrix A has an inverse A^-1?',
          options: [
            'det(A) = 0',
            'det(A) ≠ 0',
            'All diagonal elements are 0',
            'The matrix must be symmetric'
          ],
          correctIndex: 1,
          explanation: 'A matrix is invertible (non-singular) if and only if its determinant is non-zero (det(A) ≠ 0).',
          hint: 'Division by zero is impossible in the inverse formula (1/det(A) * adj(A)).',
          conceptTag: 'Matrix Invertibility'
        }
      ]
    }
  ],

  'Computer Science': [
    {
      id: 'cs-dsa-1',
      subject: 'Computer Science',
      topic: 'Data Structures & Algorithms',
      difficulty: 'Intermediate',
      summaryNotes: 'Data structures organize data for efficient computation. Understand Big-O complexities for Hash Maps O(1) avg lookup, Binary Search Trees O(log N) balanced, Graph BFS (queue) vs DFS (stack/recursion), and Dynamic Programming overlapping subproblems.',
      keyFormulasOrConcepts: [
        'Binary Search requires sorted array: O(log N) time',
        'Hash Map average lookup/insert: O(1)',
        'Balanced BST (AVL/Red-Black) lookup: O(log N)',
        'Breadth-First Search (BFS): Queue-based level order, shortest path in unweighted graph',
        'Depth-First Search (DFS): Stack/recursion, cycle detection, topological sort'
      ],
      questions: [
        {
          id: 'cs-1',
          question: 'What is the average time complexity to search an element in a Hash Table with good distribution?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctIndex: 0,
          explanation: 'Hash tables compute index in O(1) using the hash function, providing average constant time O(1) lookup.',
          hint: 'Direct key-to-bucket mapping requires minimal comparisons.',
          conceptTag: 'Hash Table Complexity'
        },
        {
          id: 'cs-2',
          question: 'Which traversal of a Binary Search Tree (BST) visits nodes in ascending sorted order?',
          options: ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
          correctIndex: 1,
          explanation: 'In-order traversal visits Left subtree (smaller values), then Root (current), then Right subtree (larger values), naturally generating sorted order.',
          hint: 'Think "In-between": Left -> Root -> Right.',
          conceptTag: 'Tree Traversals'
        },
        {
          id: 'cs-3',
          question: 'Which data structure is fundamentally used to implement Breadth-First Search (BFS)?',
          options: ['Stack (LIFO)', 'Queue (FIFO)', 'Max Heap', 'Disjoint Set'],
          correctIndex: 1,
          explanation: 'BFS explores nodes level-by-level in the order they are discovered, which requires a First-In-First-Out (FIFO) Queue.',
          hint: 'The first neighbor discovered must be the first neighbor processed.',
          conceptTag: 'Graph Search'
        },
        {
          id: 'cs-4',
          question: 'What is the worst-case time complexity of standard QuickSort on an already sorted array without random pivot?',
          options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'],
          correctIndex: 1,
          explanation: 'When choosing the first or last element as pivot on a sorted array, the partitions become unbalanced (sizes 0 and N-1), degrading performance to O(N^2).',
          hint: 'Unbalanced splits result in quadratic recursive depth.',
          conceptTag: 'Sorting Algorithms'
        }
      ]
    },
    {
      id: 'cs-web-1',
      subject: 'Computer Science',
      topic: 'Web Development & React',
      difficulty: 'Intermediate',
      summaryNotes: 'Modern React uses functional components with hooks. useState handles local reactive state, useEffect manages side-effects and cleanup, and virtual DOM diffing minimizes expensive DOM reflows.',
      keyFormulasOrConcepts: [
        'useState: triggers re-render when state value changes',
        'useEffect dependency array: [] runs once on mount, [dep] runs when dep changes',
        'Keys in lists help React reconcile virtual DOM trees efficiently',
        'State should be treated as immutable'
      ],
      questions: [
        {
          id: 'cs-w-1',
          question: 'Why must unique "key" props be provided when rendering lists of elements in React?',
          options: [
            'To apply unique CSS styles to each list item',
            'To help React identify which items have changed, been added, or been removed',
            'To automatically sort the array before rendering',
            'To prevent JavaScript memory leaks'
          ],
          correctIndex: 1,
          explanation: 'Keys give elements a stable identity inside an array, enabling React reconciliation algorithm to efficiently re-render only modified nodes.',
          hint: 'Think about Virtual DOM diffing during updates.',
          conceptTag: 'React Reconciliation'
        },
        {
          id: 'cs-w-2',
          question: 'When does a useEffect hook with an empty dependency array `[]` execute its callback?',
          options: [
            'On every single component render and update',
            'Only once after the initial component mount',
            'Never, unless manually invoked',
            'Only right before the component unmounts'
          ],
          correctIndex: 1,
          explanation: 'An empty dependency array tells React that the effect doesn\'t depend on any props or state, so it only runs once after the initial mount.',
          hint: 'No dependencies means no trigger values to cause re-execution.',
          conceptTag: 'React Hooks'
        }
      ]
    }
  ],

  'Physics': [
    {
      id: 'phys-thermo-1',
      subject: 'Physics',
      topic: 'Thermodynamics & Heat Engines',
      difficulty: 'Intermediate',
      summaryNotes: 'Thermodynamics governs heat, work, and energy. First Law: ΔU = Q - W (Conservation of Energy). Second Law: Total entropy of an isolated system always increases. Carnot engine represents the theoretical maximum efficiency: η = 1 - (Tc / Th).',
      keyFormulasOrConcepts: [
        'First Law: ΔU = Q - W',
        'Carnot Efficiency: η = 1 - (T_cold / T_hot) [temperatures in Kelvin]',
        'Ideal Gas Law: PV = nRT',
        'Entropy change: dS = dQ_rev / T ≥ 0'
      ],
      questions: [
        {
          id: 'phy-1',
          question: 'What is the maximum theoretical efficiency (Carnot efficiency) of a heat engine operating between 600 K (hot reservoir) and 300 K (cold reservoir)?',
          options: ['25%', '50%', '75%', '100%'],
          correctIndex: 1,
          explanation: 'Carnot efficiency η = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 1 - 0.5 = 0.5 or 50%.',
          hint: 'Formula is 1 - (Tc / Th).',
          conceptTag: 'Carnot Efficiency'
        },
        {
          id: 'phy-2',
          question: 'According to the Second Law of Thermodynamics, what happens to the total entropy of an isolated universe over time in any spontaneous process?',
          options: [
            'It decreases steadily to zero',
            'It remains strictly constant at all times',
            'It always increases (or remains constant in ideal reversible processes)',
            'It fluctuates unpredictably without any limit'
          ],
          correctIndex: 2,
          explanation: 'The Second Law states that in any spontaneous natural process, the total entropy (disorder/microstates) of an isolated system always increases: ΔS_total ≥ 0.',
          hint: 'Systems naturally evolve toward higher disorder and maximum probability.',
          conceptTag: 'Entropy & Second Law'
        },
        {
          id: 'phy-3',
          question: 'In an isothermal process for an ideal gas, what is the change in internal energy (ΔU)?',
          options: ['ΔU > 0', 'ΔU < 0', 'ΔU = 0', 'ΔU depends on pressure only'],
          correctIndex: 2,
          explanation: 'For an ideal gas, internal energy U depends solely on temperature T. In an isothermal process (constant T), ΔT = 0, therefore ΔU = 0.',
          hint: '"Iso-thermal" means constant temperature.',
          conceptTag: 'Isothermal Thermodynamic Process'
        }
      ]
    },
    {
      id: 'phys-em-1',
      subject: 'Physics',
      topic: 'Electromagnetism & Circuits',
      difficulty: 'Intermediate',
      summaryNotes: 'Governed by Maxwell\'s Equations. Ohm\'s Law V=IR, Coulomb\'s Law F=k(q1q2)/r^2, Faraday\'s Law of Electromagnetic Induction ε = -dΦ_B/dt, and Lorentz Force F = q(E + v x B).',
      keyFormulasOrConcepts: [
        'Ohm\'s Law: V = I · R',
        'Faraday\'s Law: EMF = -dΦ/dt',
        'Coulomb\'s Law: F = k · (q1 · q2) / r²',
        'Power: P = V · I = I² · R = V² / R'
      ],
      questions: [
        {
          id: 'em-1',
          question: 'If a 12V battery is connected across two 6-ohm resistors in series, what is the current flowing through the circuit?',
          options: ['1 A', '2 A', '4 A', '0.5 A'],
          correctIndex: 0,
          explanation: 'Total series resistance R_eq = 6 + 6 = 12 ohms. Current I = V / R_eq = 12V / 12 ohms = 1 A.',
          hint: 'Sum the resistances first: R_total = R1 + R2.',
          conceptTag: 'Resistors in Series'
        },
        {
          id: 'em-2',
          question: 'According to Faraday\'s Law of Induction, an electromotive force (EMF) is induced in a coil whenever there is a change in:',
          options: [
            'Magnetic flux through the coil over time',
            'The physical mass of the coil',
            'The ambient room temperature',
            'The color of the wire insulation'
          ],
          correctIndex: 0,
          explanation: 'Faraday\'s Law states induced EMF is directly proportional to the negative rate of change of magnetic flux (ε = -N · dΦ/dt).',
          hint: 'Think about relative motion between a magnet and a coil of wire.',
          conceptTag: 'Electromagnetic Induction'
        }
      ]
    }
  ],

  'Chemistry': [
    {
      id: 'chem-organic-1',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms',
      difficulty: 'Intermediate',
      summaryNotes: 'Organic reactions proceed via nucleophilic/electrophilic pathways. SN1 reactions are two-step (carbocation intermediate, favored by tertiary substrates & polar protic solvents). SN2 reactions are concerted one-step with backside attack (inversion of stereochemistry, favored by primary substrates).',
      keyFormulasOrConcepts: [
        'SN1: 2-step, carbocation, rate = k[Substrate], racemization',
        'SN2: 1-step concerted, rate = k[Substrate][Nucleophile], Walden inversion',
        'Carbocation stability: 3° > 2° > 1° > methyl',
        'Electronegativity trend: increases up and to the right on periodic table'
      ],
      questions: [
        {
          id: 'chem-1',
          question: 'Which of the following alkyl halides undergoes an SN1 substitution reaction fastest?',
          options: [
            'Methyl bromide (CH3Br)',
            'Ethyl bromide (CH3CH2Br)',
            'Isopropyl bromide ((CH3)2CHBr)',
            'tert-Butyl bromide ((CH3)3CBr)'
          ],
          correctIndex: 3,
          explanation: 'tert-Butyl bromide forms a tertiary (3°) carbocation, which is the most stable due to hyperconjugation and inductive donation from 3 methyl groups.',
          hint: 'SN1 reaction rate depends on the stability of the carbocation intermediate.',
          conceptTag: 'SN1 vs SN2 Mechanisms'
        },
        {
          id: 'chem-2',
          question: 'What stereochemical outcome characteristically occurs during a bimolecular nucleophilic substitution (SN2) reaction at a chiral center?',
          options: [
            'Complete inversion of configuration (Walden Inversion)',
            'Complete retention of configuration',
            'Racemization (50% retention, 50% inversion)',
            'Loss of optical activity through dimerization'
          ],
          correctIndex: 0,
          explanation: 'The nucleophile attacks from the backside 180° opposite the leaving group, turning the tetrahedral center inside-out (Walden Inversion).',
          hint: 'Think of an umbrella turning inside out in a gust of wind.',
          conceptTag: 'Stereochemistry'
        }
      ]
    }
  ],

  'Biology': [
    {
      id: 'bio-genetics-1',
      subject: 'Biology',
      topic: 'Genetics & Molecular Biology',
      difficulty: 'Intermediate',
      summaryNotes: 'The Central Dogma of Molecular Biology: DNA -> RNA (Transcription) -> Protein (Translation). DNA replication is semi-conservative using DNA Polymerase. In humans, chromosomes carry genes with dominant and recessive alleles.',
      keyFormulasOrConcepts: [
        'Transcription: DNA template -> mRNA (RNA Polymerase, 5\' to 3\')',
        'Translation: mRNA codons -> Amino acid chain (Ribosome & tRNA)',
        'Base pairing: A-T (2 H-bonds), G-C (3 H-bonds) in DNA; A-U in RNA',
        'Mendelian Monohybrid Cross (Aa x Aa): 3:1 phenotypic ratio, 1:2:1 genotypic ratio'
      ],
      questions: [
        {
          id: 'bio-1',
          question: 'If a DNA template strand has the sequence 3\'-TAC GGC TTA-5\', what is the complementary mRNA sequence produced during transcription?',
          options: [
            '5\'-AUG CCG AAU-3\'',
            '5\'-ATG CCG AAT-3\'',
            '5\'-UAC GGC UUA-3\'',
            '3\'-AUG CCG AAU-5\''
          ],
          correctIndex: 0,
          explanation: 'RNA base pairs with DNA template anti-parallel (5\' to 3\'): T pairs with A, A pairs with U (uracil replaces thymine in RNA), C pairs with G, and G pairs with C.',
          hint: 'RNA uses Uracil (U) instead of Thymine (T) and runs in the opposite direction (5\' to 3\').',
          conceptTag: 'Transcription & Codons'
        },
        {
          id: 'bio-2',
          question: 'In a standard Mendelian monohybrid cross between two heterozygous individuals (Aa x Aa), what percentage of offspring is expected to display the dominant phenotype?',
          options: ['25%', '50%', '75%', '100%'],
          correctIndex: 2,
          explanation: 'Punnett square yields genotypes 1 AA, 2 Aa, 1 aa. The 3 out of 4 (75%) with AA or Aa express the dominant phenotype.',
          hint: 'Both AA and Aa individuals display the dominant trait.',
          conceptTag: 'Mendelian Genetics'
        }
      ]
    }
  ]
};

// Smart dynamic generator for any custom subject & topic entered by the user
export function generateExerciseSetForSubject(
  subjectName: string, 
  topicName?: string, 
  difficulty: SubjectDifficulty = 'Intermediate'
): PracticeExerciseSet {
  // Check exact subject matches first
  const normalizedSubject = Object.keys(CURATED_PRACTICE_SETS).find(
    s => s.toLowerCase() === subjectName.trim().toLowerCase()
  );

  if (normalizedSubject) {
    const sets = CURATED_PRACTICE_SETS[normalizedSubject];
    if (topicName && topicName.trim()) {
      const matchedSet = sets.find(s => 
        s.topic.toLowerCase().includes(topicName.trim().toLowerCase()) ||
        topicName.trim().toLowerCase().includes(s.topic.toLowerCase())
      );
      if (matchedSet) return matchedSet;
    }
    return sets[0];
  }

  // Also check if topic matches any curated set topic across all subjects
  for (const sub of Object.keys(CURATED_PRACTICE_SETS)) {
    for (const set of CURATED_PRACTICE_SETS[sub]) {
      if (
        (topicName && set.topic.toLowerCase().includes(topicName.toLowerCase())) ||
        set.subject.toLowerCase().includes(subjectName.toLowerCase())
      ) {
        return set;
      }
    }
  }

  // If completely custom subject / topic, dynamically generate tailored high-quality exercise set!
  const effectiveSubject = subjectName.trim() || 'General Focus';
  const effectiveTopic = topicName?.trim() || 'Core Principles & Active Recall';

  return {
    id: `dyn-set-${Date.now()}`,
    subject: effectiveSubject,
    topic: effectiveTopic,
    difficulty,
    summaryNotes: `Key study guide for ${effectiveSubject} (${effectiveTopic}). Focus on primary definitions, fundamental principles, practical problem solving, and synthesis of core concepts.`,
    keyFormulasOrConcepts: [
      `Foundational definition and scope of ${effectiveTopic}`,
      `Critical methodology and application rules in ${effectiveSubject}`,
      `Common pitfalls, edge cases, and active recall checkpoints`,
      `Synthesizing theory with practical problem solving`
    ],
    questions: [
      {
        id: 'dyn-q1',
        question: `In the study of ${effectiveSubject}, which core principle is most essential when analyzing "${effectiveTopic}"?`,
        options: [
          `Establishing clear baseline definitions and fundamental governing laws`,
          `Skipping theoretical foundations to guess the final outcome`,
          `Memorizing isolated facts without understanding interconnected relationships`,
          `Assuming all variables remain static and invariant in real-world scenarios`
        ],
        correctIndex: 0,
        explanation: `Mastery in ${effectiveSubject} starts with solidifying first principles, clear definitions, and understanding the causal mechanisms behind ${effectiveTopic}.`,
        hint: `Think about first-principles reasoning and foundational concepts.`,
        conceptTag: `${effectiveTopic} - First Principles`
      },
      {
        id: 'dyn-q2',
        question: `When solving practical problems in "${effectiveTopic}", what is the recommended systematic workflow?`,
        options: [
          `Jump directly to computation without identifying given constraints`,
          `Identify given variables & constraints, select relevant formulas/theorems, solve step-by-step, and verify units/sanity`,
          `Rely solely on intuitive guesswork and skip validation`,
          `Stop at the first hypothesis without checking contradictory evidence`
        ],
        correctIndex: 1,
        explanation: `Systematic problem solving requires: (1) Understanding given constraints, (2) Applying governing theorems, (3) Executing calculation/proof, and (4) Sanity checking the result.`,
        hint: `A structured 4-step engineering and scientific method is always most reliable.`,
        conceptTag: `${effectiveSubject} Problem Solving Workflow`
      },
      {
        id: 'dyn-q3',
        question: `What is the most effective active recall technique to retain complex material from "${effectiveTopic}" long-term?`,
        options: [
          `Passive re-reading of highlighting text multiple times`,
          `Testing yourself with practice questions and explaining the concepts in your own words (Feynman Technique)`,
          `Cramming the entire chapter in one single unspaced sitting`,
          `Avoiding mistakes by never testing yourself without looking at answers`
        ],
        correctIndex: 1,
        explanation: `Active recall combined with self-explanation (Feynman Technique) and spaced repetition strengthens neural retrieval pathways far better than passive re-reading.`,
        hint: `Testing your own retrieval capacity creates strong memory consolidation.`,
        conceptTag: 'Active Recall & Cognitive Retention'
      },
      {
        id: 'dyn-q4',
        question: `When evaluating edge cases or advanced scenarios in "${effectiveTopic}", how should you verify your conclusions?`,
        options: [
          `Cross-reference against boundary conditions and empirical validations`,
          `Disregard any edge cases that don't fit the simplest ideal scenario`,
          `Assume edge cases have zero probability of occurring`,
          `Only verify when an external exam requires it`
        ],
        correctIndex: 0,
        explanation: `Testing boundary conditions (e.g. limits, extreme values, conservation laws) is the gold standard for validating solutions in ${effectiveSubject}.`,
        hint: `Boundary condition testing catches flawed assumptions immediately.`,
        conceptTag: 'Boundary Analysis & Validation'
      }
    ]
  };
}
