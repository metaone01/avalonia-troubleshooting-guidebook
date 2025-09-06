---
tags:
  - Avalonia
  - Xaml
  - Style
---
# Why did the `DataGrid` not display

Please check whether you have included the style in **App.axaml**:

```xml hl_lines="2"
<Application.Styles>
    <StyleInclude Source="avares://Avalonia.Controls.DataGrid/Themes/Fluent.xaml"/>
</Application.Styles>
```

💖 Provided by [kongdetuo](https://github.com/kongdetuo)

🔗 Original Document [Avalonia 常见问题](https://kongdetuo.github.io/posts/avalonia-faq/)

（Obtained permission from original author，Modified）