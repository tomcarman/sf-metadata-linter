export type SfCustomField = {
  CustomField: SfCustomFieldContents;
};

export type SfCustomFieldContents = {
  fullName?: string;
  description?: string;
  encryptionScheme?: string;
  externalId?: boolean;
  label?: string;
  required?: boolean;
  trackFeedHistory?: boolean;
  trackHistory?: boolean;
  type?: string;
  formula?: string;
  formulaTreatBlanksAs?: string;
  unique?: boolean;
  inlineHelpText?: string;
  isNameField?: boolean;
  isSortingDisabled?: boolean;
  length?: number;
  visibleLines?: number;
  precision?: number;
  scale?: number;
  deleteConstraint?: string;
  referenceTo?: string;
  relationshipLabel?: string;
  relationshipName?: string;
  valueSet?: SfValueSet;
  lookupFilter?: SfLookupFilter;
};

export type SfValueSet = {
  controllingField?: string;
  restricted?: boolean;
  valueSetDefinition?: SfValueSetDefinition;
  valueSettings?: SfValueSetting[];
};

export type SfValueSetDefinition = {
  sorted?: boolean;
  value?: SfValue[];
};

export type SfValue = {
  fullName?: string;
  default?: boolean;
  label?: string;
};

export type SfValueSetting = {
  controllingFieldValue?: string[];
  valueName?: string;
};

export type SfLookupFilter = {
  active?: boolean;
  errorMessage?: string;
  filterItems?: SfFilterItems;
  isOptional?: boolean;
};

export type SfFilterItems = {
  field?: string;
  operation?: string;
  value?: string;
};
