---
tags:
  - Avalonia
  - Xaml
  - Style
---
# 为什么 `:pointerover` 设置背景色没有生效

## 快速修复

因为你的样式优先级比较低，需要写详细一些才能覆盖主题中的样式:

```xml
<Style Selector="Button:pointerover /template/ ContentPresenter#PART_ContentPresenter">
    <Setter Property="Background" Value="Orange" />
</Style>
```

## 细节

这是为了保证背景色等属性的响应性。
如果模板按下面这种写法：

```xml
<ControlTemplate>
    <ContentPresenter x:Name="PART_ContentPresenter"
                      Background="{TemplateBinding Background}"/>
</ControlTemplate>
```

当用户直接设置 Background = "Red" 后，鼠标放上去无法变色，这就失去了响应能力。为了避免这种情况，开发组在自带的样式中写了比较高优先级的选择器，导致了重写样式需要写这么一长串。

💖 提供者 [kongdetuo](https://github.com/kongdetuo)

🔗 原文档链接 [Avalonia 常见问题](https://kongdetuo.github.io/posts/avalonia-faq/)

（已获得原作者许可,有改动）