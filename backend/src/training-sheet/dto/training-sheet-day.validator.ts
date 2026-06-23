import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

@ValidatorConstraint({ name: 'TrainingSheetDayValidator', async: false })
export class TrainingSheetDayValidator implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const keys = Object.keys(value as Record<string, unknown>);
    if (keys.length !== DAYS_OF_WEEK.length) {
      return false;
    }
    return DAYS_OF_WEEK.every((day) => {
      const entry = (value as Record<string, any>)[day];
      return entry && (entry.status === 'training' || entry.status === 'rest');
    });
  }

  defaultMessage() {
    return 'days must contain exactly 7 entries for monday through sunday with status training or rest';
  }
}
