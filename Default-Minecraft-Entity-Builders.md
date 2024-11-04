# **Entity Builders Overview** 🏗️

> These builders for various Minecraft mobs provide flexibility in enabling or disabling built-in goals and behaviors, allowing you to customize the behavior of entities in your world.

---

## Entity Registration Example 📜

> The script below demonstrates how to register custom entities based on existing Minecraft mobs. While models/textures are not included, you can use the Blockbench CEM Entity Plugin for those.

```js
// Entity Registration Example
StartupEvents.registry('entity_type', event => {
    event.create('custom_zombie', 'minecraft:zombie') // Basic Zombie Entity
    event.create('custom_allay', 'minecraft:allay') // Basic AllayEntity
    event.create('custom_axolotl', 'minecraft:axolotl') // Basic Axolotl Entity
    event.create('custom_bat', 'minecraft:bat') // Basic Bat Entity
    event.create('custom_bee', 'minecraft:bee') // Basic Bee Entity
    event.create('custom_blaze', 'minecraft:blaze') // Basic Blaze Entity
    event.create('custom_boat', 'minecraft:boat') // Basic Boat Entity
    event.create('custom_cat', 'minecraft:cat') // Basic Cat Entity
    event.create('custom_camel', 'minecraft:camel') // Basic Camel Entity (1.20.1+)
    event.create('custom_chicken', 'minecraft:chicken') // Basic Chicken Entity
    event.create('custom_cow', 'minecraft:cow') // Basic Cow Entity
    event.create('custom_creeper', 'minecraft:creeper') // Basic Creeper Entity
    event.create('custom_dolphin', 'minecraft:dolphin') // Basic Dolphin Entity
    event.create('custom_donkey', 'minecraft:donkey') // Basic Donkey Entity
    event.create('custom_enderman', 'minecraft:enderman') // Basic Enderman Entity
    event.create('custom_evoker', 'minecraft:evoker') // Basic Evoker Entity
    event.create('custom_ghast', 'minecraft:ghast') // Basic Ghast Entity
    event.create('custom_goat', 'minecraft:goat') // Basic Goat Entity
    event.create('custom_guardian', 'minecraft:guardian') // Basic Guardian Entity
    event.create('custom_horse', 'minecraft:horse') // Basic Horse Entity
    event.create('custom_illusioner', 'minecraft:illusioner') // Basic Illusioner Entity
    event.create('custom_iron_golem', 'minecraft:iron_golem') // Basic Iron Golem Entity
    event.create('custom_panda', 'minecraft:panda') // Basic Panda Entity
    event.create('custom_parrot', 'minecraft:parrot') // Basic Parrot Entity
    event.create('custom_eye_of_ender', 'minecraft:eye_of_ender') // Basic Eye of Ender Entity
    event.create('custom_wither', 'minecraft:wither') // Basic Wither Entity
    event.create('custom_piglin', 'minecraft:piglin') // Basic Piglin Entity
    event.create("custom_slime", "minecraft:slime") // Basic Slime Entity
    event.create("custom_skeleton", "minecraft:skeleton") // Basic Skeleton Entity
    event.create("custom_wolf", "minecraft:wolf") // Basic Wolf Entity
    event.create("custom_trident", "minecraft:trident") // Basic ThrownTrident Entity
})
```

---

## Enabling/Disabling Default Entity Goals ⚙️

> When registering entities, you have the option to enable or disable their default goals and behaviors. By default, goals are enabled, but for more custom behavior, you can disable them using `.defaultGoals(false)` or `.defaultBehaviourGoals(false)`.

```js
// Disabling Default Entity Goals and Behaviors
StartupEvents.registry('entity_type', event => {
    event.create('custom_zombie', 'minecraft:zombie')
        .defaultBehaviourGoals(false)
        .defaultGoals(false)
})
```

