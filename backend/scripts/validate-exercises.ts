/**
 * Validate exercises.json structure and content
 * Run: npx ts-node scripts/validate-exercises.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const REQUIRED_MUSCLE_GROUPS = [
  'Peito',
  'Tríceps',
  'Costas',
  'Bíceps',
  'Ombros',
  'Abdômen',
  'Perna',
  'Glúteo',
  'Trapézio',
  'Antebraço',
  'Panturrilha',
];

interface Exercise {
  name: string;
  muscleGroup: string;
  videoUrl: string;
  tip?: string;
}

function validateExercises(): void {
  console.log('🔍 Validating exercises.json...\n');

  const filePath = path.join(__dirname, '..', 'src', 'assets', 'exercises.json');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  let exercises: Exercise[];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    exercises = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to parse exercises.json:`, error);
    process.exit(1);
  }

  if (!Array.isArray(exercises)) {
    console.error('❌ exercises.json must be an array');
    process.exit(1);
  }

  console.log(`✅ Found ${exercises.length} exercises\n`);

  const errors: string[] = [];
  const groupCounts: Record<string, number> = {};

  exercises.forEach((exercise, index) => {
    // Check required fields
    if (!exercise.name || typeof exercise.name !== 'string') {
      errors.push(`Row ${index + 1}: Missing or invalid "name" field`);
    }

    if (!exercise.muscleGroup || typeof exercise.muscleGroup !== 'string') {
      errors.push(`Row ${index + 1}: Missing or invalid "muscleGroup" field`);
    } else {
      // Check valid muscle group
      if (!REQUIRED_MUSCLE_GROUPS.includes(exercise.muscleGroup)) {
        errors.push(`Row ${index + 1}: Invalid muscleGroup "${exercise.muscleGroup}"`);
      }
      groupCounts[exercise.muscleGroup] = (groupCounts[exercise.muscleGroup] || 0) + 1;
    }

    if (!exercise.videoUrl || typeof exercise.videoUrl !== 'string') {
      errors.push(`Row ${index + 1}: Missing or invalid "videoUrl" field`);
    } else {
      // Check URL format (basic YouTube URL validation)
      if (
        !exercise.videoUrl.startsWith('https://youtu.be/') &&
        !exercise.videoUrl.startsWith('https://www.youtube.com/')
      ) {
        errors.push(`Row ${index + 1}: videoUrl doesn't look like a YouTube URL`);
      }
    }

    // Optional fields
    if (exercise.tip && typeof exercise.tip !== 'string') {
      errors.push(`Row ${index + 1}: "tip" must be a string`);
    }
  });

  if (errors.length > 0) {
    console.log('❌ VALIDATION ERRORS:\n');
    errors.forEach((error) => console.log(`  ${error}`));
    console.log();
    process.exit(1);
  }

  console.log('✅ All exercises are valid!\n');

  console.log('📊 Exercise distribution by muscle group:');
  REQUIRED_MUSCLE_GROUPS.forEach((group) => {
    const count = groupCounts[group] || 0;
    console.log(`  ${group}: ${count} exercises`);
  });

  console.log(
    `\n✅ TOTAL: ${exercises.length} exercises across ${Object.keys(groupCounts).length} muscle groups`,
  );
  console.log('✅ exercises.json validation PASSED');
}

validateExercises();
