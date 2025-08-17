# Contributing to Avalonia Troubleshooting Guidebook

## Code of Conduct

This project has adopted the code of conduct defined by the Contributor Covenant to clarify expected behavior in our community. 
For more information see the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org).
Please read and follow our Code of Conduct. 
We expect all contributors to be respectful and considerate of others in all interactions.

## Language

Currently the core maintainer team can only understand Chinese and English. 
You are welcomed to submit issues, discussions or pull requests with any language, 
but we can't not guarantee an accurate understanding of your thought with the help of machine translation.

## How Can I Contribute?

Before opening any issues or discussions,please search existing issues to ensure the bug hasn't already been reported.
They are usually in [Github Issues](https://github.com/metaone01/avalonia-troubleshooting-guidebook/issues)
or [GitHub Discussions](https://github.com/metaone01/avalonia-troubleshooting-guidebook/discussions)

**Bugs have been documented are in CLOSED issues. 
Some may not have updated to the main branch. 
Don't miss this part when searching.**

**Please note that in order to reduce maintenance pressure, we will only maintain Chinese and English documentation. 
If the PR's any commit contains other languages, it will not be merged. 
If you want to participate in the translation, please do it in your fork
then open a new issue here, we will add your repository link to this guidebook.**

### New Guides and Questions

If you experienced a bug that has not yet been documented,please:

#### If the bug has not being solved:

Create a discussion and include:

* A clear description of the problem.
* Steps to reproduce the bug.
* Screenshots or logs, if applicable.
* Your environment details (OS, browser version, etc.).

**When solved, please @ maintainers to change it into an issue**.

#### If the bug has been solved:

Create an issue and include:

* A clear description of the problem.
* Steps to reproduce the bug.
* Screenshots or logs, if applicable.
* Your environment details (OS, browser version, etc.).
* Your detailed debugging process.

### Reporting Document Wrongs and Outdates

If you find wrong or outdated guides in the project, please submit an issue with following template:

```markdown
    [**<FILENAME>** line <LINE>](<URL>) 
    
    <REASON>
    
    <!-- Add this line if outdated -->
    [<SOURCE_NAME>]<SOURCE_LATEST_UPDATE_URL>
```

example:

```markdown
    [**CONTRIBUTING.md** line 58](https://github.com/metaone01/avalonia-troubleshooting-guidebook/blob/english/CONTRIBUTING.md#L58)
    This is template reason.
    [Latest Avalonia Release](https://github.com/AvaloniaUI/Avalonia/releases/latest)
```

Its Preview will like this:

[**CONTRIBUTING.md** line 58](https://github.com/metaone01/avalonia-troubleshooting-guidebook/blob/english/CONTRIBUTING.md#L58)

This is template reason.

[Latest Avalonia Release](https://github.com/AvaloniaUI/Avalonia/releases/latest)

#### Open a Pull Request

To contribute with a Pull Request, you need to:

1. Fork the repository and clone your fork locally.
2. Create a new branch for your changes.
3. Make your changes, following the Style Guide.
4. Commit your changes with a descriptive commit message.
5. Push your branch to GitHub and open a Pull Request with detailed explanation.
