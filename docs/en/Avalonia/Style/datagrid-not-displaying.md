---
tags:
  - Avalonia
  - Xaml
  - Style
---
# Why did the `DataGrid` not display

Please check whether you have included the style in **App.axaml**:

```diff
<Application.Styles>
+    <StyleInclude Source="avares://Avalonia.Controls.DataGrid/Themes/Fluent.xaml"/>
</Application.Styles>
```

💖 Provided by [kongdetuo](https://github.com/kongdetuo)
