# 为Avalonia Troubleshooting Guidebook做贡献

## 行为准则

本项目采用了Contributor Covenant Code of Conduct定义的行为准则，以阐明我们社区中的预期行为。
有关详细信息，请参阅[Contributor Covenant Code of Conduct](https://www.contributor-covenant.org)。
请阅读并遵守我们的行为准则。
我们希望所有贡献者在所有互动中都能尊重和体谅他人。

## 语言

目前核心维护团队只懂中文和英文。我们欢迎您使用任何语言提交Issue、Discussion或PR，但我们无法保证您的想法能够得到准确理解

## 我该如何贡献？

在打开任何问题或讨论之前，请搜索现有问题以确保尚未报告错误。
它们通常出现在
[Github Issue](https://github.com/metaone01/avalonia-troubleshooting-guidebook/issues)
或
[Github Discussion](https://github.com/metaone01/avalonia-troubleshooting-guidebook/discussions)中。

**已经记录的错误在Closed Issues中。有些可能没有更新到主分支。搜索的时候不要遗漏这一部分。**

**请注意，为了减少维护压力，我们将只维护中文和英文文档。
如果PR commit中含有其他语言，则这个PR将不会被合并。
如果您想参与翻译，请在您自己的fork里进行，然后在这里打开一个新的Issue，我们将把您的repo链接添加到此Guidebook中。**

### 新指南和问题

如果您遇到尚未记录的错误，请:

## 如果Bug没有解决:

创建包含以下内容的Discussion:

* 问题的清晰描述。
* 重现错误的步骤。
* 屏幕截图或日志（如适用）。
* 您的环境详细信息（操作系统、浏览器版本等）。

**解决后，请@维护人员将其更改为Issue**。

## 如果Bug已经解决:

创建问题并包括:
* 问题的清晰描述。
* 重现错误的步骤。
* 屏幕截图或日志（如适用）。
* 您的环境详细信息（操作系统、浏览器版本等）。
* 您的详细调试过程。

### 报告文档错误和过时

如果您在项目中发现错误或过时的指南，请使用以下模板提交问题:
```markdown
[**<文件名>** line <行数>](<链接>)  

<原因说明>

<!-- 如果过时，请添加以下行 -->
[<最新源的名称>]<源的最新版本的链接>
```
样例：
```markdown
[**CONTRIBUTING.md** line 58](https://github.com/metaone01/avalonia-troubleshooting-guidebook/blob/english/CONTRIBUTING.md#L58)

样例原因。

[Avalonia最新发行版](https://github.com/AvaloniaUI/Avalonia/releases/latest)
```
预览如下：

[**CONTRIBUTING.md** line 58](https://github.com/metaone01/avalonia-troubleshooting-guidebook/blob/english/CONTRIBUTING.md#L58)

样例原因。

[Avalonia最新发行版](https://github.com/AvaloniaUI/Avalonia/releases/latest)

## 创建Pull Request

如果要创建新的PR，您需要:

1. fork本仓库并在本地clone您的fork repo。
2. 为您的更改创建一个新分支。
3. 按照样式指南进行更改。
4. 清晰简练地描述您做出的更改。
5. 将您的分支推送到GitHub，并打开一个带有详细说明的PR。