---
tags:
  - Avalonia
  - Xaml
  - Style
---
# 为什么 `DataGrid` 没有显示

请检查是否在**App.axaml**中引入了样式

```xml hl_lines="2"
<Application.Styles>
    <StyleInclude Source="avares://Avalonia.Controls.DataGrid/Themes/Fluent.xaml"/>
</Application.Styles>
```

💖 提供者 [kongdetuo](https://github.com/kongdetuo)

🔗 原文档链接 [Avalonia 常见问题](https://kongdetuo.github.io/posts/avalonia-faq/)

（已获得原作者许可,有改动）
