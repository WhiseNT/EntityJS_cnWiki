# **Entity Spawning Control (FORGE ONLY)** 🌱

> **EntityJS** provides powerful tools for controlling entity spawning in Minecraft. Using the `spawnPlacement` feature, you can define precise conditions for entity spawns, while the `biomeSpawns` event allows for easy additions or removals of biome spawns without needing predicates.

---

## Key Concepts 🔑

<table>
  <tr>
    <td><strong>🌍 Spawn Conditions</strong></td>
    <td>Define conditions for spawning, such as biome type, light level, time of day, and proximity to specific blocks.</td>
  </tr>
  <tr>
    <td><strong>🔄 Spawn Rates</strong></td>
    <td>Set the frequency of entity spawns based on specific conditions to control entity density.</td>
  </tr>
  <tr>
    <td><strong>📍 Spawn Locations</strong></td>
    <td>Specify where entities can spawn, including biomes, dimensions, or custom-defined areas.</td>
  </tr>
</table>

---

## Example of `biomeSpawns` 🗺️

> The `biomeSpawns` event allows you to add or remove entity spawns in specific biomes. This event is useful for simple modifications without predicate conditions. Changes require a full world restart.

```javascript
//biomeSpawns Server Script
EntityJSEvents.biomeSpawns(event => {
    event.addSpawn('kubejs:sasuke', ['#minecraft:is_overworld'], 20, 3, 5);
    event.addSpawn('kubejs:wyrm', ['#minecraft:is_overworld'], 20, 3, 5);
    event.addSpawn('minecraft:wither_skeleton', ['#minecraft:is_overworld'], 20, 3, 5);

    event.removeSpawn('minecraft:zombie', ['#minecraft:is_overworld']);
});
```

---

## Example of `spawnPlacement` 🎯

> The `spawnPlacement` feature is used to customize spawning more precisely. You can add custom conditions, apply predicates, or replace spawn rules for specific entity types. The following script demonstrates logical conditions (`and`, `or`, `replace`) for entity spawns.

```javascript
//spawnPlacement Startup Script
EntityJSEvents.spawnPlacement(event => {
    // Add an "and" predicate: Only allow drowned to spawn above y level 44
    event.and('minecraft:drowned', (entitypredicate, levelaccessor, spawntype, blockpos, randomsource) => {
        return blockpos.y > 44;
    });

    // Add an "or" predicate: Allow enderman to spawn outside the End dimension
    event.or('minecraft:enderman', (entitypredicate, levelaccessor, spawntype, blockpos, randomsource) => {
        return levelaccessor.level.dimension != 'minecraft:the_end';
    });

    // Replace spawn rules: Allow blaze spawns in the Overworld
    event.replace('minecraft:blaze', 'no_restrictions', 'world_surface', (entitypredicate, levelaccessor, spawntype, blockpos, randomsource) => {
        return levelaccessor.level.dimension == 'minecraft:overworld';
    });
});
```

---

## Key Takeaways 📌

> - Use `biomeSpawns` for simple additions and removals of biome spawns.  
> - Use `spawnPlacement` to apply more precise conditions or replace existing spawn rules.  
> - A full world restart is required for changes to take effect.

