# **Attribute Modification Overview** 📊

> The **Entity Attribute Modification Event** in EntityJS allows you to customize various entity attributes like health, speed, and damage. This gives you fine-grained control over entity behavior and gameplay mechanics by modifying existing attributes or adding new ones.

---

## Key Features 🌟

<table>
  <tr>
    <td><strong>🔧 Attribute Modification</strong></td>
    <td>Adjust key attributes like health, damage, and speed to match your gameplay needs.</td>
  </tr>
  <tr>
    <td><strong>🔄 Compatibility</strong></td>
    <td>Works with both vanilla Minecraft mobs and custom entities created using EntityJS.</td>
  </tr>
  <tr>
    <td><strong>🛠️ Debugging & Inspection</strong></td>
    <td>Inspect entity attributes, view their default values, and make adjustments accordingly.</td>
  </tr>
</table>

---

## Attribute Script Example 📜

```javascript
//attributes Startup Script
EntityJSEvents.attributes(event => {
    /**
     * 虽然实体构建器预置了默认属性,但你可以
     * 在此处添加你自定义属性,用以更好地控制实体的属性
     * 这也同样适用于修改现有怪物(mob)的属性,例如本例我们正在修改的属性:
     * 悦灵的最大生命值
     */
    event.modify('minecraft:allay', attribute => {
        //Overwrite an allay's max health attribute setting it to 30.
        attribute.add("minecraft:generic.max_health", 30)
    })
    //你可以通过下述代码输出实体可能已经具有的属性
    event.getAttributes('allay').forEach(attribute => {
        console.log(`Allay Attribute: ${attribute.descriptionId}: ${attribute.defaultValue}`)
    })
    // 下句可以以列表形式输出所有能够通过此事件修改属性的实体类型,
    console.log(event.getAllTypes())
})
```
