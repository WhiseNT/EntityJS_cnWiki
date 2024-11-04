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
     * While the entity builders come with pre-added default attributes you may
     * add your own attributes here as well for more control over your entity's attributes.
     * This also works to modify existing mob's attributes such as in this example we are modifying
     * an allay's max health.
     */
    event.modify('minecraft:allay', attribute => {
        //Overwrite an allay's max health attribute setting it to 30.
        attribute.add("minecraft:generic.max_health", 30)
    })
    //You are able to see existing attributes an entity may already have like so
    event.getAttributes('allay').forEach(attribute => {
        console.log(`Allay Attribute: ${attribute.descriptionId}: ${attribute.defaultValue}`)
    })
    // Returns a list of all entity types that can have their attributes modified by this event
    console.log(event.getAllTypes())
})
```
