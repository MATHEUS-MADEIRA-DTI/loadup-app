/**
 * MuscleGroup Enum — 11 muscle groups for exercise classification
 * Expanded from 8 to 11 groups to support new exercises (Spec 005)
 */
export enum MuscleGroup {
  // Original 8 groups
  Peito = 'Peito',
  Tríceps = 'Tríceps',
  Costas = 'Costas',
  Bíceps = 'Bíceps',
  Ombros = 'Ombros',
  Abdômen = 'Abdômen',
  Perna = 'Perna',
  Glúteo = 'Glúteo',

  // New 3 groups (added in Spec 005)
  Trapézio = 'Trapézio',
  Antebraço = 'Antebraço',
  Panturrilha = 'Panturrilha',
}
