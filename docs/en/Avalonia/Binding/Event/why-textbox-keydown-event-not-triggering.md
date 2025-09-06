---
tags:
  - Avalonia
  - Event
---
# Why is the KeyDown event of TextBox not triggered?

Because TextBox handles the KeyDown event internally.
If you need to handle the event before TextBox processes it, you should register a tunnel event:

```csharp
target.AddHandler(InputElement.KeyDownEvent, OnTextBoxKeyDown, RoutingStrategies.Tunnel);

void OnTextBoxKeyDown(object sender, KeyEventArgs e)
{
    // Write your codes here
}
```

💖 Provided by [kongdetuo](https://github.com/kongdetuo)

🔗 Original Document [Avalonia 常见问题](https://kongdetuo.github.io/posts/avalonia-faq/)

（Obtained permission from original author，Modified）
