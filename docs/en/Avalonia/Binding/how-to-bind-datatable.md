---
tags:
  - Avalonia
  - Binding
---
# How to Bind DataTable

## Background

Avalonia supports common collection types, but DataTable itself is not a collection and cannot be bound directly. DataTable.Rows and DataTable.DefaultView are collections and can be used as data sources, but DataRow and DataRowView are not standard data types, so the binding engine cannot recognize them correctly. This article records two methods to solve this problem.

!!! Info
    Both methods can display data normally. Currently, these two methods do basically the same thing. Method 1 is simpler, while Method 2 may have better support in the future. Please choose as needed.

    Both methods use DataRowView because it implements the INotifyPropertyChanged interface, making binding easier.

!!! Tip
    If you need grouping, you need to inherit DataGridGroupDescription and write your own grouping logic. The built-in DataGridPathGroupDescription is not very useful.

!!! Tip
    Due to the binding implementation of DataGrid, it is always read-only now. If you need to edit, please use template columns or fork Avalonia.Controls.DataGrid for modification.

!!! Warning
    Method 1 cannot auto-generate columns. Method 2 theoretically can, but the current DataGrid implementation does not support it yet.

    !!! Tip ""
        If you want to auto-generate columns, you can currently only choose Behavior or fork Avalonia.Controls.DataGrid for modification.

!!! Danger
    Since DataGrid does not support the IBindingList interface, add/delete operations on DataView do not work properly and require additional encapsulation.

=== "Method 1: Using IPropertyAccessorPlugin"

    Avalonia provides the `IPropertyAccessorPlugin` interface, which allows you to implement custom property access logic. After implementing a custom property accessor, you can bind cell content by column name.

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

    Open the **App.axaml.cs** file and add the following code in the `OnFrameworkInitializationCompleted` method to take effect:

    ```csharp
    BindingPlugins.PropertyAccessors.Add(new DataRowViewPropertyAccessorPlugin());
    ```

    !!! Example "Binding example"

        ```xml
        <DataGrid AutoGenerateColumns="False" ItemsSource="{Binding DataTable.DefaultView}">
            <DataGrid.Columns>
                <DataGridTextColumn Header="id" Binding="{ReflectionBinding name}"/>
                <DataGridTextColumn Header="name" Binding="{ReflectionBinding name}"/>
            </DataGrid.Columns>
        </DataGrid>
        ```

        !!! Warning
            CompiledBinding is not supported here.

    References

    - [Avalonia-Tutorials](https://github.com/irihitech/Avalonia-Tutorials)
    - [Binding to ExpandoObject (dynamic)](https://github.com/AvaloniaUI/Avalonia/issues/2289)

=== "Method 2: Using IReflectableType"

    Avalonia can support dynamic types through the `IReflectableType` interface. You can simply wrap `DataRowView` and implement the `IReflectableType` interface.
    !!! Note
        `DataRowView` implements the [ICustomTypeDescriptor](https://learn.microsoft.com/dotnet/api/system.componentmodel.icustomtypedescriptor?view=net-9.0) interface, which means `DataRowView` itself is a dynamic type, but unfortunately Avalonia does not recognize this interface yet.
    !!! Tip
        This is just a simple wrapper. In actual use, it may be better to create a dynamic type similar to `DataRowView`.
        Create a type `DataRowWrapper` that implements the `IReflectableType` and `INotifyPropertyChanged` interfaces.

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
        }
    }

    ```

    !!! Example "Usage Example"

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
            Here, a regular `List` is used to store `DataRowViewWrapper`, and the add/delete synchronization logic is not considered.
            If needed, you can encapsulate a type similar to `DataView` yourself.
    
    !!! Example "Binding Example"

        ```xml
        <DataGrid AutoGenerateColumns="False" ItemsSource="{Binding List}">
            <DataGrid.Columns>
                <DataGridTextColumn Header="id" Binding="{ReflectionBinding name}"/>
                <DataGridTextColumn Header="name" Binding="{ReflectionBinding name}"/>
            </DataGrid.Columns>
        </DataGrid>
        ```

    References

    - [Feature: ICustomTypeDescriptor support in bindings](https://github.com/AvaloniaUI/Avalonia/issues/5225)
    - [Bindings uses only "dynamic" properties when DataGrid item inherited from IReflectableType](https://github.com/AvaloniaUI/Avalonia.Controls.DataGrid/issues/93)

-----

💖 Provided by [kongdetuo](https://github.com/kongdetuo)

🔗 Original document [【Avalonia】如何绑定 DataTable](https://kongdetuo.github.io/posts/avalonia-binding-to-datatable/)

（Obtained permission from original author，Modified）
