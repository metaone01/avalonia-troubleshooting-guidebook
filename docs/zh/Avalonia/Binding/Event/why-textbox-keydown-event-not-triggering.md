---
tags:
  - Avalonia
  - Event
---
# 为什么 TextBox 的 KeyDown 事件没有触发？

因为 TextBox 会自行处理 KeyDown 事件，如果需要在 TextBox 之前处理事件，需要注册隧道事件：

```csharp
target.AddHandler(InputElement.KeyDownEvent, OnTextBoxKeyDown, RoutingStrategies.Tunnel);

void OnTextBoxKeyDown(object sender, KeyEventArgs e)
{
    // 处理程序代码
}
```

💖 提供者 [kongdetuo](https://github.com/kongdetuo)

🔗 原文档链接 [Avalonia 常见问题](https://kongdetuo.github.io/posts/avalonia-faq/)

（已获得原作者许可,有改动）
