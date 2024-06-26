# sf-metadata-linter

[![NPM](https://img.shields.io/npm/v/sf-metadata-linter.svg?label=sf-metadata-linter)](https://www.npmjs.com/package/sf-metadata-linter) [![Downloads/week](https://img.shields.io/npm/dw/sf-metadata-linter.svg)](https://npmjs.org/package/sf-metadata-linter) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/sf-metadata-linter/main/LICENSE.txt)

# Rules

| rule | description |

| [object-should-have-a-description](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#object-should-have-a-description) | Custom objects should have a description, describing how the object is used. |
| [object-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#object-description-minimum-length) | A custom object should have a description, describing how the object is used. The description should be at least `{option.minimumLength}` characters long. |
| [field-should-have-a-description](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#field-should-have-a-description) | Custom fields should have a description, describing how the field is used. |
| [field-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#field-description-minimum-length) | A custom field should have a description, describing how the field is used. The description should be at least `{option.minimumLength}` characters long. |
| [flow-should-have-a-description](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#flow-should-have-a-description) | Flows should have a description, describing how the Flow is used. |
| [flow-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#flow-description-minimum-length) | A Flow should have a description, describing how the flow is used. The description should be at least `{option.minimumLength}` characters long. |
| [validation-rule-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#validation-rule-description-minimum-length) | A Validation Rule should have a description, describing how the Validation Rule is used. The description should be at least `{option.minimumLength}` characters long. |
| [validation-rule-error-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#validation-rule-error-minimum-length) | A Validation Rule should have a description, describing how the Validation Rule is used. The description should be at least `{option.minimumLength}` characters long. |
| [metadata-should-have-prefix](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#metadata-should-have-prefix) | All metata must have an API name prefix of one of the following: `{option.prefixes}`<br><br>or<br><br>Metadata of types: `{option.types}` should have one of the following prefixes: `{option.prefixes}` |
| [metadata-should-not-have-prefix](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#metadata-should-not-have-prefix) | <br>Metadata should not be prefixed with any of the following: `{option.prefixes}`<br><br>or<br><br>Metadata should not have a prefix of: `{option.prefixes}`. This applies to metadata of types: `{option.types}` |
| [picklist-values-should-not-contain-double-spaces](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#picklist-values-should-not-contain-double-spaces) | Picklist labales and values should not contain double spaces eg. `Offer  Made`. |
