---
tags:
  - Avalonia
  - Binding
---
# 如何绑定 DataTable

## 背景

Avalonia 支持常见的集合类型，但是 DataTable 并非集合无法直接绑定。DataTable.Rows 和 DataTable.DefaultView 是集合，可以作为数据源使用，但是 DataRow 和 DataRowView 不是标准数据类型，绑定引擎无法正确识别，本文记录两种方法解决这个问题。

!!! Info
    两种方法都可以正常展示数据，目前这两个方法做的事情基本一致，方法一比较简单，方法二在未来可能有更好的支持，请按需选择。

    两种方法都使用 DataRowView，因为它实现了 INotifyPropertyChanged 接口, 绑定起来方便一些。

!!! Tip
    如需分组，需要继承 DataGridGroupDescription 编写分组逻辑，内置的 DataGridPathGroupDescription 不太行。

!!! Tip
    由于 DataGrid 的绑定实现，现在总是只读的，如果需要编辑，请使用模板列 或者 fork Avalonia.Controls.DataGrid 修改。

!!! Warning
    方法一无法实现自动生成列，方法二理论上可以，但是目前 DataGrid 的实现还不行

    !!! Tip ""
        想要自动生成列，目前只能选择 Behavior 或者 fork Avalonia.Controls.DataGrid 修改

!!! Danger
    由于 DataGrid 不支持 IBindingList 接口，DataView 的增删操作无法正常工作，需要额外的封装

=== "方法一：使用 IPropertyAccessorPlugin"

    Avalonia 提供了 `IPropertyAccessorPlugin` 接口，这个接口可以实现自定义的属性访问逻辑，实现自定义的属性访问器之后，就可以按照列名绑定单元格内容了。

    ```csharp
    public class DataRowViewPropertyAccessorPlugin : IPropertyAccessorPlugin
    {
        public bool Match(object obj, string propertyName) => obj is DataRowView row && row.Row.Table.Columns.Contains(propertyName);

        public IPropertyAccessor? Start(WeakReference<object?> reference, string propertyName)
        {
            ArgumentNullException.ThrowIfNull(reference);
            ArgumentNullException.ThrowIfNull(propertyName);

            if (!reference.TryGetTarget(out var instance) || instance is null)
                return null;

            return new DataRowViewPropertyAccessor(reference, propertyName);
        }
    }

    public class DataRowViewPropertyAccessor : PropertyAccessorBase, IWeakEventSubscriber<PropertyChangedEventArgs>
    {
        private readonly WeakReference<object?> reference;
        private readonly string propertyName;
        private bool eventRaised;

        public DataRowViewPropertyAccessor(WeakReference<object?> reference, string propertyName)
        {
            this.reference = reference;
            this.propertyName = propertyName;
        }

        public override Type? PropertyType => GetReferenceTarget()?.Row?.Table?.Columns?[propertyName]?.DataType;

        public override object? Value => GetReferenceTarget()?[propertyName];

        public void OnEvent(object? sender, WeakEvent ev, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == propertyName)
            {
                eventRaised = true;
                SendCurrentValue();
            }
        }

        public override bool SetValue(object? value, BindingPriority priority)
        {
            eventRaised = false;

            var row = GetReferenceTarget();
            if(row is not null)
                row[propertyName] = value;

            if (!eventRaised)
            {
                SendCurrentValue();
            }
            return true;
        }

        protected override void SubscribeCore()
        {
            if (GetReferenceTarget() is INotifyPropertyChanged inpc)
                WeakEvents.ThreadSafePropertyChanged.Subscribe(inpc, this);

            SendCurrentValue();
        }

        protected override void UnsubscribeCore()
        {
            if (GetReferenceTarget() is INotifyPropertyChanged inpc)
                WeakEvents.ThreadSafePropertyChanged.Unsubscribe(inpc, this);
        }

        private DataRowView? GetReferenceTarget()
        {
            reference.TryGetTarget(out var target);
            return target as DataRowView;
        }

        private void SendCurrentValue()
        {
            try
            {
                var value = Value;
                PublishValue(value);
            }
            catch
            {
                // ignored
            }
        }
    }
    ```

    打开 **App.axaml.cs** 文件，在 `OnFrameworkInitializationCompleted` 方法中添加如下代码即可生效：

    ```csharp
    BindingPlugins.PropertyAccessors.Add(new DataRowViewPropertyAccessorPlugin());
    ```

    绑定示例：

    ```xml
    <DataGrid AutoGenerateColumns="False" ItemsSource="{Binding DataTable.DefaultView}">
        <DataGrid.Columns>
            <DataGridTextColumn Header="id" Binding="{ReflectionBinding name}"/>
            <DataGridTextColumn Header="name" Binding="{ReflectionBinding name}"/>
        </DataGrid.Columns>
    </DataGrid>
    ```

    !!! Warning
        此处不支持编译绑定`CompiledBinding`。

    参考链接

    - [Avalonia-Tutorials](https://github.com/irihitech/Avalonia-Tutorials)
    - [Binding to ExpandoObject (dynamic)](https://github.com/AvaloniaUI/Avalonia/issues/2289)

=== "方法二：使用 IReflectableType"

    Avalonia 可以通过 `IReflectableType` 接口支持动态类型，可以简单封装一下`DataRowView`，实现 `IReflectableType` 接口。
    !!! Note
        `DataRowView` 实现了 [ICustomTypeDescriptor](https://learn.microsoft.com/dotnet/api/system.componentmodel.icustomtypedescriptor?view=net-9.0) 接口，也就是说 `DataRowView` 本身就是一个动态类型, 可惜 Avalonia 暂时不认这个接口
    !!! Tip
        这里只是简单封装，实际使用时仿照 `DataRowView` 创建一个动态类型可能更好一些。
        创建类型 `DataRowWrapper` 实现 `IReflectableType` 和 `INotifyPropertyChanged` 接口

    ```csharp
    public class DataRowViewWrapper : IReflectableType, INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        public DataRowView Row { get; set; }

        public DataRowViewWrapper(DataRowView row)
        {
            this.Row = row;
            (row as INotifyPropertyChanged).PropertyChanged += (sender, e) =>
            {
                PropertyChanged?.Invoke(this, e);
            };
        }

        TypeInfo IReflectableType.GetTypeInfo()
        {
            return new DynamicTypeInfo(this);
        }

        private class DynamicTypeInfo : TypeInfo
        {
            private DataRowViewWrapper row;

            public DynamicTypeInfo(DataRowViewWrapper reflectableContact)
            {
                this.row = reflectableContact;
            }

            protected override PropertyInfo? GetPropertyImpl(string name, BindingFlags bindingAttr, Binder? binder, Type? returnType, Type[]? types,
                ParameterModifier[]? modifiers)
            {
                if (row.Row.Row.Table.Columns.Contains(name))
                {
                    return new DynamicPropertyInfo(row.Row.Row.Table.Columns[name]!);
                }
                return null;
            }

            // 其他属性方法暂时用不到，保持默认继承即可
        }

        private class DynamicPropertyInfo : PropertyInfo
        {
            private DataColumn dataColumn;

            public DynamicPropertyInfo(DataColumn dataColumn)
            {
                this.dataColumn = dataColumn;
            }

            public override bool CanRead => true;

            public override bool CanWrite => true;

            public override Type PropertyType => dataColumn.DataType;

            public override string Name => dataColumn.ColumnName;

            public override object? GetValue(object? obj, BindingFlags invokeAttr, Binder? binder, object?[]? index, CultureInfo? culture)
            {
                if (obj is not null && obj is DataRowViewWrapper row)
                {
                    return row.Row[Name];
                }
                return null;
            }

            public override void SetValue(object? obj, object? value, BindingFlags invokeAttr, Binder? binder, object?[]? index, CultureInfo? culture)
            {
                if (obj is not null && obj is DataRowViewWrapper row)
                {
                    row.Row[Name] = value ?? DBNull.Value;
                }
            }

            // 其他属性方法暂时用不到，保持默认继承即可
        }
    }

    ```

    !!! Example "使用示例"

        ```csharp
        public class MainViewModel : ViewModelBase
        {
            public List<DataRowViewWrapper> List { get; set; }

            public DataTable DataTable { get; set; }

            public MainViewModel()
            {

                this.DataTable = new DataTable();
                DataTable.Columns.Add(new DataColumn("id", typeof(int)));
                DataTable.Columns.Add(new DataColumn("name", typeof(string)));
                for (int i = 0; i < 10; i++)
                {
                    var row = DataTable.NewRow();
                    row["id"] = i;
                    row["name"] = i.ToString();
                    DataTable.Rows.Add(row);
                }

                this.List = this.DataTable.DefaultView.OfType<DataRowView>()
                    .Select(p => new DataRowViewWrapper(p))
                    .ToList();
            }
        }
        ```

        !!! Warning
            这里使用了一个普通 `List` 存储 `DataRowViewWrapper`，没有考虑增删同步逻辑。
            如果需要可以自行封装一个类似 `DataView` 的类型。
    
    !!! Example "绑定示例"
        ```xml
        <DataGrid AutoGenerateColumns="False" ItemsSource="{Binding List}">
            <DataGrid.Columns>
                <DataGridTextColumn Header="id" Binding="{ReflectionBinding name}"/>
                <DataGridTextColumn Header="name" Binding="{ReflectionBinding name}"/>
            </DataGrid.Columns>
        </DataGrid>
        ```

    参考链接

    - [Feature: ICustomTypeDescriptor support in bindings](https://github.com/AvaloniaUI/Avalonia/issues/5225)
    - [Bindings uses only "dynamic" properties when DataGrid item inherited from IReflectableType](https://github.com/AvaloniaUI/Avalonia.Controls.DataGrid/issues/93)

-----

💖 提供者 [kongdetuo](https://github.com/kongdetuo)

🔗 原文档链接 [【Avalonia】如何绑定 DataTable](https://kongdetuo.github.io/posts/avalonia-binding-to-datatable/)

（已获得原作者许可,有改动）
