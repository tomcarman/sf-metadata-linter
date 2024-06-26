# sf-metadata-linter

[![NPM](https://img.shields.io/npm/v/sf-metadata-linter.svg?label=sf-metadata-linter)](https://www.npmjs.com/package/sf-metadata-linter) [![Downloads/week](https://img.shields.io/npm/dw/sf-metadata-linter.svg)](https://npmjs.org/package/sf-metadata-linter) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/sf-metadata-linter/main/LICENSE.txt)

Custom plugin for the [Salesforce CLI](https://github.com/salesforcecli) to "lint" metadata and to check it meets a customisable ruleset.

## Installation

tbc

### Updating

tbc

## Usage

### sf metalint run

Run the linter against a set of Salesforce metadata files

```
USAGE
  $ sf metalint run --config ruleset.yaml --directory forceapp/

FLAGS
  -c, --config=<value>  (required) Path to a config.yaml file that defines the rules and options for the linter.
  -d, --directory=<value> (required) Path to a directory containing Salesforce metadata.
  -f, --format=[csv|sarif|table] (optional) Output format of the results (defaults to table which is displayed in the CLI in not specified)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Run the linter against a set of Salesforce metadata files

EXAMPLES
  $ $ sf metalint run --config /path/to/my/config.yaml --directory forceapp/
  $ sf metalint run --config /path/to/my/config.yaml --directory forceapp/ --format csv
  $ sf metalint run --config /path/to/my/config.yaml --directory forceapp/ --format sarif
```


## Output formats

Several different output formats are available for the results, defined by the `--format` flag.

### Table

* This is the default output format, and what is used as default when no other format is supplied.
* Not all fields are included (eg. rule full description) in order to save space.
* A summary of the results is also displayed - this is shown regardless of output format.

![table-output](https://github.com/tomcarman/sf-metadata-linter/assets/1554713/5b285a7d-651f-4aed-b715-1add2622d8e8)


### SARIF

* [SARIF (Static Analysis Results Interchange Format)](https://sarifweb.azurewebsites.net/#Specification) is an OASIS approved standardised format for static analysis tools.
* Its supported by DevOps tools - eg. GitHub, Azure DevOps, so static analysis results can be viewed inline within code.

![sarif-output](https://github.com/tomcarman/sf-metadata-linter/assets/1554713/31944661-7c9e-4a73-834d-857b9df6bc8d)

### CSV

* Results can be outputted to a CSV - useful for one-off audits etc.

![csv-output](https://github.com/tomcarman/sf-metadata-linter/assets/1554713/b35d5dcd-e9ad-4e1f-95dc-7a199159eb5f)

## Config


## Rules

**See the [documentation](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules) for a full description of the rules.**

| rule                                                                                                                                                            | description                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [object-should-have-a-description](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#object-should-have-a-description)                                 | Custom objects should have a description, describing how the object is used.                                                                                                                                       |
| [object-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#object-description-minimum-length)                               | A custom object should have a description, describing how the object is used. The description should be at least `{option.minimumLength}` characters long.                                                         |
| [field-should-have-a-description](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#field-should-have-a-description)                                   | Custom fields should have a description, describing how the field is used.                                                                                                                                         |
| [field-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#field-description-minimum-length)                                 | A custom field should have a description, describing how the field is used. The description should be at least `{option.minimumLength}` characters long.                                                           |
| [flow-should-have-a-description](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#flow-should-have-a-description)                                     | Flows should have a description, describing how the Flow is used.                                                                                                                                                  |
| [flow-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#flow-description-minimum-length)                                   | A Flow should have a description, describing how the flow is used. The description should be at least `{option.minimumLength}` characters long.                                                                    |
| [validation-rule-description-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#validation-rule-description-minimum-length)             | A Validation Rule should have a description, describing how the Validation Rule is used. The description should be at least `{option.minimumLength}` characters long.                                              |
| [validation-rule-error-minimum-length](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#validation-rule-error-minimum-length)                         | A Validation Rule should have a description, describing how the Validation Rule is used. The description should be at least `{option.minimumLength}` characters long.                                              |
| [metadata-should-have-prefix](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#metadata-should-have-prefix)                                           | All metata must have an API name prefix of one of the following: `{option.prefixes}`<br><br>or<br><br>Metadata of types: `{option.types}` should have one of the following prefixes: `{option.prefixes}`           |
| [metadata-should-not-have-prefix](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#metadata-should-not-have-prefix)                                   | <br>Metadata should not be prefixed with any of the following: `{option.prefixes}`<br><br>or<br><br>Metadata should not have a prefix of: `{option.prefixes}`. This applies to metadata of types: `{option.types}` |
| [picklist-values-should-not-contain-double-spaces](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#picklist-values-should-not-contain-double-spaces) | Picklist labales and values should not contain double spaces eg. `Offer  Made`.                                                                                                                                    |
