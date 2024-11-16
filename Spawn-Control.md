# **Entity Spawning Control (FORGE ONLY)** 🌱

> **EntityJS** provides powerful tools for controlling entity spawning in Minecraft. Using the `spawnPlacement` feature, you can define precise conditions for entity spawns, while the `biomeSpawns` event allows for easy additions or removals of biome spawns without needing predicates.

---

## Key Concepts 🔑

<table>
  <tr>
    <td><strong>🌍 Spawn Conditions</strong></td>
    <td>定义生成条件,例如生物群系、光照等级、一天中的时间以及与特定区块的距离</td>
  </tr>
  <tr>
    <td><strong>🔄 Spawn Rates</strong></td>
    <td>根据具体情况设置实体生成的频率以控制实体密度.</td>
  </tr>
  <tr>
    <td><strong>📍 Spawn Locations</strong></td>
    <td>指定实体可以生成的位置,包括生物群系、维度或者自定义的区域.</td>
  </tr>
</table>

---

## Example of `biomeSpawns` 🗺️

> The `biomeSpawns` 事件允许你在特定生物群系中添加或者删除实体生成.此事件对于没有谓词条件的简单修改很有用,更改需要重载世界生效.

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

> The `spawnPlacement`用于更精确地自定义生成. 你可以添加自定义条件,谓词, 或者替换特定实体类型的生成规则.以下脚本演示了实体生成的(`and`, `or`, `replace`)逻辑条件.

```javascript
//spawnPlacement Startup Script
EntityJSEvents.spawnPlacement(event => {
    // 添加"and"谓词: 只允许溺尸在y轴44格以上生成.
    event.and('minecraft:drowned', (entitypredicate, levelaccessor, spawntype, blockpos, randomsource) => {
        return blockpos.y > 44;
    });

    // 添加 "or" 谓词: 允许末影人在末地以外的维度生成
    event.or('minecraft:enderman', (entitypredicate, levelaccessor, spawntype, blockpos, randomsource) => {
        return levelaccessor.level.dimension != 'minecraft:the_end';
    });

    // 替换生成规则:允许烈焰人在主世界生成
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

