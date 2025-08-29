---
tags:
  - Avalonia
  - Xaml
  - Style
---
# Why did setting the color with `:pointerover` have no effect?

## TL;DR

Because your style has a lower priority.
You need to write a more specific selector to override the styles in the theme:

```xml
<Style Selector="Button:pointerover /template/ ContentPresenter#PART_ContentPresenter">
    <Setter Property="Background" Value="Orange" />
</Style>
```

## Details

This is to ensure properties like background color are responsive.
If the template is written like this:

```xml
<ControlTemplate>
    <ContentPresenter x:Name="PART_ContentPresenter"
                      Background="{TemplateBinding Background}"/>
</ControlTemplate>
```

When the user sets `Background = "Red"` directly, hovering the mouse will not change the color, which loses responsiveness. To avoid this, the development team wrote higher-priority selectors in the styles, so you need to write such a long selector to override them.

💖 Provided by [kongdetuo](https://github.com/kongdetuo)
