import * as fs from 'node:fs';

export function fieldsMustHaveDescriptions(files: string[]): string[] {
  const customFields = files.filter(
    (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.field-meta.xml')
  );

  const customFieldsWithoutDescriptions = customFields.filter((file) => {
    const contents = fs.readFileSync(file, 'utf-8');
    return !contents.includes('<description>');
  });

  return customFieldsWithoutDescriptions;
}
