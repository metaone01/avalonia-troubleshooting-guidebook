---
tags:
  - Avalonia
  - Xaml
  - Style
---
# 为什么 `DataGrid` 没有显示

请检查是否在**App.axaml**中引入了样式

```diff
<Application.Styles>
+    <StyleInclude Source="avares://Avalonia.Controls.DataGrid/Themes/Fluent.xaml"/>
</Application.Styles>
```

💖 提供者[kongdetuo](https://github.com/kongdetuo)
