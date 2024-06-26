<br>
<p align="center">
  <img src="https://github.com/tomcarman/sf-metadata-linter/assets/1554713/394bea11-ab9a-48bf-8ab5-494652a79bdf" width="400px" align="center" alt="sf metadata linter logo" />
<!--   <h1 align="center">sf metadata linter</h1> -->
<!--   <hr> -->
  <p align="center">
    <a href="https://github.com/salesforcecli">sf cli</a> plugin to lint metadata.
  </p>
</p>
<p align="center">
<a href="https://www.npmjs.com/package/sf-metadata-linter" rel="nofollow"><img src="https://img.shields.io/npm/v/sf-metadata-linter.svg?label=sf-metadata-linter" alt="npm"></a>
<a href="https://raw.githubusercontent.com/salesforcecli/sf-metadata-linter/main/LICENSE.txt" rel="nofollow"><img src="https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg" alt="license"></a>
</p>

<br>

## Installation

Assuming you already have the [sf cli](https://developer.salesforce.com/tools/salesforcecli) installed, the plugin can be installed by running:

`sf plugins install sf-metadata-linter`

Note: You'll be prompted that this is not officially code-signed by Salesforce - like any custom plugin. You can just accept this when prompted, or alternatively you can [whitelist it](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_allowlist.htm)

### Updating

The plugin can be updated to the latest version using

`sf plugins update`

<br>

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
  $ sf metalint run --config /path/to/my/config.yaml --directory forceapp/
  $ sf metalint run --config /path/to/my/config.yaml --directory forceapp/ --format csv
  $ sf metalint run --config /path/to/my/config.yaml --directory forceapp/ --format sarif
```

<br>

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
| [picklist-values-should-not-contain-double-spaces](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#picklist-values-should-not-contain-double-spaces) | Picklist labels and values should not contain double spaces eg. `Offer  Made`.                                                                                                                                     |
| [value-set-should-not-contain-double-spaces](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules#value-set-should-not-contain-double-spaces)             | Value Set labels and values should not contain double spaces eg. `Offer  Made`.                                                                                                                                    |

<br>

## Config

Configuring which rules run, their level, and other options, is managed via a config file thats passed into the linter when executing.

An example config file is available in this repo: https://github.com/tomcarman/sf-metadata-linter/blob/main/example/config.yaml

### Global Settings

| Name            | Description                                                                                                                                                                         | Example                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| csvFilename     | The name of the file when outputting to CSV.                                                                                                                                        | `results.csv`             |
| sarifFilename   | The name of the file when outputting to SARIF.                                                                                                                                      | `results.sarif`           |
| parentDirectory | This is the path above the specific metadata folders (eg. classes, flows, objects etc). If supplied, it will strip this from the results when rending the CLI table (saving space). | `force-app/main/default/` |

### Rule Settings

All rules support the following:

| Name   | Description                                   | Example                       |
| ------ | --------------------------------------------- | ----------------------------- |
| active | (boolean) Controls if the rule is run or not. | `true` or `false`             |
| level  | (enum) The level of the rule.                 | `info`, `warning`, or `error` |

Some rules can be customised with additional options, see the [rule documentation](https://github.com/tomcarman/sf-metadata-linter/wiki/Rules) for further information.

<br>

## Output formats

Different output formats are available for the results, defined by the `--format` flag.

### Table

- This is the default output format, and what is used as default when no other format is supplied.
- Not all fields are included (eg. rule full description) in order to save space.
- A summary of the results is also displayed - this is shown regardless of output format.

![table-output](https://github.com/tomcarman/sf-metadata-linter/assets/1554713/cf8b4f94-4cd3-40f4-b5d0-adfa5f54dfae)

<br>

### SARIF

- [SARIF (Static Analysis Results Interchange Format)](https://sarifweb.azurewebsites.net/#Specification) is an OASIS approved standardised format for static analysis tools.
- Its supported by DevOps tools - eg. GitHub, Azure DevOps, so static analysis results can be viewed inline within code.

![sarif-output](https://github.com/tomcarman/sf-metadata-linter/assets/1554713/31944661-7c9e-4a73-834d-857b9df6bc8d)

<br>

#### Example SARIF integration with GitHub Advanced Security, results inline in a pull request

<img src="https://github.com/tomcarman/sf-metadata-linter/assets/1554713/ac485881-c63a-43cb-9ad9-4946f621cc5b" width="800">

<br>
<br>

### CSV

- Results can be outputted to a CSV - useful for one-off audits etc.

![csv-output](https://github.com/tomcarman/sf-metadata-linter/assets/1554713/b35d5dcd-e9ad-4e1f-95dc-7a199159eb5f)

<br>

## Adding new rules

TBC
