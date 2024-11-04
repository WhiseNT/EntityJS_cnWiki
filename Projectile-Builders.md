# **Projectile Builder Overview** 🚀

> The **Projectile Builder** in EntityJS allows you to create custom projectiles, offering flexibility in defining ranged attacks or environmental effects within Minecraft. This builder enables you to configure various attributes and behaviors for your projectiles.

---

## Key Features 🌟

<table>
  <tr>
    <td><strong>🔧 Customize Projectile Properties</strong></td>
    <td>Adjust attributes like size, rendering scale, and update intervals.</td>
  </tr>
  <tr>
    <td><strong>🎯 Define Hit Behaviors</strong></td>
    <td>Specify unique effects or interactions upon collision with entities or blocks.</td>
  </tr>
  <tr>
    <td><strong>🎨 Rendering Conditions</strong></td>
    <td>Control rendering based on player distance or other factors.</td>
  </tr>
  <tr>
    <td><strong>💨 Custom Movement Logic</strong></td>
    <td>Implement velocity and lerping behavior for precise projectile movement.</td>
  </tr>
  <tr>
    <td><strong>🔁 Utilize Callbacks</strong></td>
    <td>Use callbacks for player interactions, tick events, and despawn conditions to fine-tune projectile behavior.</td>
  </tr>
</table>

---

# **Arrow Builder Overview** 🏹

> The **Arrow Builder** in EntityJS allows you to create custom arrow entities, providing flexibility to customize properties and behaviors for enhanced combat mechanics and projectile-based gameplay.

---

## Key Features 🔑

<table>
  <tr>
    <td><strong>💥 Set Damage and Knockback</strong></td>
    <td>Adjust base damage and knockback values to influence combat effectiveness.</td>
  </tr>
  <tr>
    <td><strong>👁️ Rendering Options</strong></td>
    <td>Control size and visibility based on player distance or specific conditions.</td>
  </tr>
  <tr>
    <td><strong>🛡️ Custom Hit Behaviors</strong></td>
    <td>Define effects upon collision with entities or blocks for diverse interactions.</td>
  </tr>
  <tr>
    <td><strong>🎯 Arrow Pickup Conditions</strong></td>
    <td>Specify conditions under which players can retrieve arrows, controlling item retrieval mechanics.</td>
  </tr>
  <tr>
    <td><strong>🏹 Customize Movement</strong></td>
    <td>Implement lerping and movement behavior for dynamic projectile trajectories.</td>
  </tr>
</table>


---

# **Full Projectile Entity Example**
<details>
<summary>1.19.2</summary>

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('projectile', 'entityjs:projectile')
        /**
         * One-Off values set at the startup of the game.
         */
        .clientTrackingRange(8)
        .isAttackable(true)
        .mobCategory('misc')
        .item(item => {
            item.canThrow(true)
        })
        .sized(1, 1)
        .renderOffset(0, 0, 0)
        .renderScale(1, 1, 1)
        .updateInterval(3)
        //Setting .noItem() here will result in the builder skipping the item build altogether
        //Since the builder registers the item automatically this is the only way to prevent an item from being created here.
        //.noItem()

        /**
        * These methods below require a set return value, if the value does not match the required result
        * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
        * 
        * Remember all callback functions are also able to be live-edited with global events!
        * 
        * Example: 
        * global.hit = entity => {
        * // Custom condition to determine if the arrow can hit a specific entity
        *  return entity.type == "minecraft:zombie"
        * }
        * 
        * .canHitEntity(entity => global.hit(entity)) // Reload this with /kubejs reload startup_scripts
        */

        .canHitEntity(entity => {
            // Custom condition to determine if the arrow can hit a specific entity
            return entity.type == "minecraft:zombie"; // Allow arrow to hit zombies only
        })
        .shouldRenderAtSqrDistance(context => {
            const { entity, distanceToPlayer } = context;
            // Custom logic to determine if the arrow should render based on distance, for example, rendering only if distance is less than 100 blocks
            return distanceToPlayer < 100;
        })

        /**
         * All methods below return void meaning they don't require a set return value to function.
         * These mostly are similar to KubeJS' normal events where you may do things on certain events your entities call!
         */

        .move(context => {
            const { entity, moverType, position } = context;
            // Custom movement logic, for example, applying velocity to the arrow
            entity.setDeltaMovement(0, 0.1, 0);
        })
        .onHitBlock(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits a block, for example, spawning particles
            entity.level.addParticle('minecraft:campfire_cosy_smoke', entity.getX(), entity.getY(), entity.getZ(), 0, 0, 0);
        })
        .onHitEntity(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits an entity, for example, applying potion effects
            if (result.entity.living) {
                let potion = result.entity.potionEffects
                potion.add('minecraft:luck', 200, 1, false, true)
            }
        })
        .playerTouch(context => {
            const { player, entity } = context;
            // Custom behavior when a player touches the arrow, for example, setting the player on fire.
            if (entity.age > 5) {
                player.setRemainingFireTicks(20)
                entity.remove('discarded')
            }
        })
        .tick(entity => {
            // Custom tick logic, for example, checking if the arrow is in lava and setting it on fire
            if (entity.level.getBlockState(entity.blockPosition()).getBlock().id == "minecraft:lava") {
                entity.setSecondsOnFire(5);
            }
        })
        .lerpTo(context => {
            const { entity, yaw, x, y, z, teleport, posRotationIncrements, pitch } = context;
            // Custom lerping behavior, for example, teleporting the arrow to a new position
            entity.teleportTo(x, y, z);
        })
})
```

</details>

<details>
<summary>1.20.1</summary>

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('projectile', 'entityjs:projectile')
        /**
         * One-Off values set at the startup of the game.
         */
        .clientTrackingRange(8)
        .isAttackable(true)
        .mobCategory('misc')
        .item(item => {
            item.canThrow(true)
        })
        .sized(1, 1)
        .renderOffset(0, 0, 0)
        .renderScale(1, 1, 1)
        .updateInterval(3)
        //Setting .noItem() here will result in the builder skipping the item build altogether
        //Since the builder registers the item automatically this is the only way to prevent an item from being created here.
        //.noItem()

        /**
        * These methods below require a set return value, if the value does not match the required result
        * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
        *
        * Remember all callback functions are also able to be live-edited with global events!
        *
        * Example:
        * global.hit = entity => {
        * // Custom condition to determine if the arrow can hit a specific entity
        *  return entity.type == "minecraft:zombie"
        * }
        *
        * .canHitEntity(entity => global.hit(entity)) // Reload this with /kubejs reload startup_scripts
        */

        .canHitEntity(entity => {
            // Custom condition to determine if the arrow can hit a specific entity
            return entity.type == "minecraft:zombie"; // Allow arrow to hit zombies only
        })
        .shouldRenderAtSqrDistance(context => {
            const { entity, distanceToPlayer } = context;
            // Custom logic to determine if the arrow should render based on distance, for example, rendering only if distance is less than 100 blocks
            return distanceToPlayer < 100;
        })

        /**
         * All methods below return void meaning they don't require a set return value to function.
         * These mostly are similar to KubeJS' normal events where you may do things on certain events your entities call!
         */

        .move(context => {
            const { entity, moverType, position } = context;
            // Custom movement logic, for example, applying velocity to the arrow
            entity.setDeltaMovement(0, 0.1, 0);
        })
        .onHitBlock(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits a block, for example, spawning particles
            entity.getLevel().addParticle('minecraft:campfire_cosy_smoke', entity.getX(), entity.getY(), entity.getZ(), 0, 0, 0);
        })
        .onHitEntity(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits an entity, for example, applying potion effects
            if (result.entity.living) {
                let potion = result.entity.potionEffects
                potion.add('minecraft:luck', 200, 1, false, true)
            }
        })
        .playerTouch(context => {
            const { player, entity } = context;
            // Custom behavior when a player touches the arrow, for example, setting the player on fire.
            if (entity.age > 5) {
                player.setRemainingFireTicks(20)
                entity.remove('discarded')
            }
        })
        .tick(entity => {
            // Custom tick logic, for example, checking if the arrow is in lava and setting it on fire
            if (entity.getLevel().getBlockState(entity.blockPosition()).getBlock().id == "minecraft:lava") {
                entity.setSecondsOnFire(5);
            }
        })
        .lerpTo(context => {
            const { entity, yaw, x, y, z, teleport, posRotationIncrements, pitch } = context;
            // Custom lerping behavior, for example, teleporting the arrow to a new position
            entity.teleportTo(x, y, z);
        })
})
```

</details>

# **Full Arrow Entity Example**

<details>
<summary>1.19.2</summary>

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('arrow', 'entityjs:arrow')

        /**
         * One-Off values set at the startup of the game.
         */

        .setKnockback(5) // Set the punch enchantment knockback to 5
        .setBaseDamage(8) // Set base damage to 8
        .clientTrackingRange(8) // Set client tracking range to 8
        .isAttackable(true) // Make the arrow attackable
        .sized(1, 1) // Set size of arrow entity to 1x1
        .updateInterval(3) // Set update interval to 3 ticks
        //Setting .noItem() here will result in the builder skipping the item build altogether
        //Since the builder registers the item automatically this is the only way to prevent an item from being created here.
        //.noItem()
        .defaultHitGroundSoundEvent("minecraft:entity.arrow.hit") // Set default hit ground sound event
        .setWaterInertia(1) // Set water inertia to 1
        .mobCategory('misc') // Set mob category to 'misc'
        .item(item => {
            item.maxStackSize(64); // Set maximum stack size of arrow item to 64
        })

        /**
        * These methods below require a set return value, if the value does not match the required result
        * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
        * This effectively prevents a crash and instead gives you info on the method.
        * 
        * Remember all callback functions are also able to be live-edited with global events!
        * 
        * Example: 
        * global.hit = entity => {
        * // Custom condition to determine if the arrow can hit a specific entity
        *  return entity.type == "minecraft:zombie"
        * }
        * 
        * .canHitEntity(entity => global.hit(entity)) // Reload this with /kubejs reload startup_scripts
        */

        .textureLocation(entity => {
            //Change texture resource location depending on certain information about the arrow entity.
            //Accepts both a new ResourceLocation or a String representation.
            //new ResourceLocation("kubejs:textures/entity/projectiles/arrow.png")
            return "kubejs:textures/entity/projectiles/arrow.png"
        })
        .setDamageFunction(entity => {
            // Custom damage function based off the arrow entity
            return true
        })
        .canHitEntity(entity => {
            // Custom condition to determine if the arrow can hit a specific entity
            return entity.type == "minecraft:zombie"; // Allow arrow to hit zombies only
        })
        .shouldRenderAtSqrDistance(context => {
            const { entity, distanceToPlayer } = context;
            // Custom logic to determine if the arrow should render based on distance, for example, rendering only if distance is less than 100 blocks
            return distanceToPlayer < 100;
        })
        .tryPickup(player => {
            // Custom logic to determine if a player can pick up the arrow, for example, allowing only non-creative mode players to pick it up
            return !context.player.isCreative();
        })

        /**
         * All methods below return void meaning they don't require a set return value to function.
         * These mostly are similar to KubeJS' normal events where you may do things on certain events your entities call!
         */

        .doPostHurtEffects(context => {
            const { entity, arrow } = context;
            // Custom post-hurt effects, for example, create an explosion
            let explosion = entity.block.createExplosion()
            explosion.strength(1)
            explosion.damagesTerrain(true)
            explosion.explode()
        })
        .lerpTo(context => {
            const { entity, yaw, x, y, z, teleport, posRotationIncrements, pitch } = context;
            // Custom lerping behavior, for example, teleporting the arrow to a new position
            entity.teleportTo(x, y, z);
        })
        .move(context => {
            const { entity, moverType, position } = context;
            // Custom movement logic, for example, applying velocity to the arrow
            entity.setDeltaMovement(0, 0.1, 0);
        })
        .onHitBlock(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits a block, for example, spawning particles
            entity.level.addParticle('minecraft:campfire_cosy_smoke', entity.getX(), entity.getY(), entity.getZ(), 0, 0, 0);
        })
        .onHitEntity(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits an entity, for example, applying potion effects
            if (result.entity.living) {
                let potion = result.entity.potionEffects
                potion.add('minecraft:luck', 200, 1, false, true)
            }
        })
        .playerTouch(context => {
            const { player, entity } = context;
            // Custom behavior when a player touches the arrow, for example, giving the player the arrow
            if (!entity.level.isClientSide() && (entity.isOnGround() || entity.noPhysics) && entity.shakeTime <= 0) {
                player.take(entity, 1);
                entity.discard();
            }
        })
        .tick(entity => {
            // Custom tick logic, for example, checking if the arrow is in lava and setting it on fire
            if (entity.level.getBlockState(entity.blockPosition()).getBlock().id == "minecraft:lava") {
                entity.setSecondsOnFire(5);
            }
        })
        .tickDespawn(entity => {
            // Custom logic for arrow despawn, for example, checking if the arrow has traveled a certain distance and despawning it
            if (entity.getOwner() == null) return
            if (entity.distanceToEntity(entity.getOwner()) > 100) {
                entity.remove('discarded');
            }
        })

});
```

</details>

<details>
<summary>1.20.1</summary>

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('arrow', 'entityjs:arrow')

        /**
         * One-Off values set at the startup of the game.
         */

        .setKnockback(5) // Set knockback to 5
        .setBaseDamage(8) // Set base damage to 8
        .clientTrackingRange(8) // Set client tracking range to 8
        .isAttackable(true) // Make the arrow attackable
        .sized(1, 1) // Set size of arrow entity to 1x1
        .updateInterval(3) // Set update interval to 3 ticks
        //Setting .noItem() here will result in the builder skipping the item build altogether
        //Since the builder registers the item automatically this is the only way to prevent an item from being created here.
        //.noItem()
        .defaultHitGroundSoundEvent("minecraft:entity.arrow.hit") // Set default hit ground sound event
        .setWaterInertia(1) // Set water inertia to 1
        .mobCategory('misc') // Set mob category to 'misc'
        .item(item => {
            item.maxStackSize(64); // Set maximum stack size of arrow item to 64
        })

        /**
        * These methods below require a set return value, if the value does not match the required result
        * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
        * This effectively prevents a crash and instead gives you info on the method.
        * 
        * Remember all callback functions are also able to be live-edited with global events!
        * 
        * Example: 
        * global.hit = entity => {
        * // Custom condition to determine if the arrow can hit a specific entity
        *  return entity.type == "minecraft:zombie"
        * }
        * 
        * .canHitEntity(entity => global.hit(entity)) // Reload this with /kubejs reload startup_scripts
        */

        .textureLocation(entity => {
            //Change texture resource location depending on certain information about the arrow entity.
            //Accepts both a new ResourceLocation or a String representation.
            //new ResourceLocation("kubejs:textures/entity/projectiles/arrow.png")
            return "kubejs:textures/entity/projectiles/arrow.png"
        })
        .setDamageFunction(entity => {
            // Custom damage function based off the arrow entity
            return true
        })
        .canHitEntity(entity => {
            // Custom condition to determine if the arrow can hit a specific entity
            return entity.type == "minecraft:zombie"; // Allow arrow to hit zombies only
        })
        .shouldRenderAtSqrDistance(context => {
            const { entity, distanceToPlayer } = context;
            // Custom logic to determine if the arrow should render based on distance, for example, rendering only if distance is less than 100 blocks
            return distanceToPlayer < 100;
        })
        .tryPickup(context => {
            // Custom logic to determine if a player can pick up the arrow, for example, allowing only non-creative mode players to pick it up
            return !context.player.isCreative();
        })

        /**
         * All methods below return void meaning they don't require a set return value to function.
         * These mostly are similar to KubeJS' normal events where you may do things on certain events your entities call!
         */

        .doPostHurtEffects(context => {
            const { entity, arrow } = context;
            // Custom post-hurt effects, for example, create an explosion
            let explosion = entity.block.createExplosion()
            explosion.strength(1)
            explosion.explosionMode('block')
            explosion.explode()
        })
        .lerpTo(context => {
            const { entity, yaw, x, y, z, teleport, posRotationIncrements, pitch } = context;
            // Custom lerping behavior, for example, teleporting the arrow to a new position
            entity.teleportTo(x, y, z);
        })
        .move(context => {
            const { entity, moverType, position } = context;
            // Custom movement logic, for example, applying velocity to the arrow
            entity.setDeltaMovement(0, 0.1, 0);
        })
        .onHitBlock(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits a block, for example, spawning particles
            entity.getLevel().addParticle('minecraft:campfire_cosy_smoke', entity.getX(), entity.getY(), entity.getZ(), 0, 0, 0);
        })
        .onHitEntity(context => {
            const { entity, result } = context;
            // Custom behavior when the arrow hits an entity, for example, applying potion effects
            if (result.entity.living) {
                let potion = result.entity.potionEffects
                potion.add('minecraft:luck', 200, 1, false, true)
            }
        })
        .playerTouch(context => {
            const { player, entity } = context;
            // Custom behavior when a player touches the arrow, for example, giving the player the arrow
            if (!entity.getLevel().isClientSide() && (entity.onGround() || entity.noPhysics) && entity.shakeTime <= 0) {
                player.take(entity, 1);
                entity.discard();
            }
        })
        .tick(entity => {
            // Custom tick logic, for example, checking if the arrow is in lava and setting it on fire
            if (entity.getLevel().getBlockState(entity.blockPosition()).getBlock().id == "minecraft:lava") {
                entity.setSecondsOnFire(5);
            }
        })
        .tickDespawn(entity => {
            // Custom logic for arrow despawn, for example, checking if the arrow has traveled a certain distance and despawning it
            if (entity.getOwner() == null) return
            if (entity.distanceToEntity(entity.getOwner()) > 100) {
                entity.remove('discarded');
            }
        })

});
```

</details>


# Ender Eye Builder

<table>
  <tr>
    <td>
      This builder allows you to create a custom Ender Eye projectile entity. The Ender Eye is typically used to locate strongholds in Minecraft. With this builder, you can customize various aspects such as its behavior when thrown and the sounds it plays.
    </td>
  </tr>
</table>

---

## Key Features

<table>
  <tr>
    <td><strong>Custom Behavior</strong></td>
    <td>Define custom logic for the Ender Eye's behavior when thrown, such as navigating to a specific location.</td>
  </tr>
  <tr>
    <td><strong>Sound Customization</strong></td>
    <td>Override the default sound played when the Ender Eye is thrown with custom sounds.</td>
  </tr>
  <tr>
    <td><strong>Item Management</strong></td>
    <td>Specify what item is created when the Ender Eye entity is instantiated or choose to use the default Minecraft Eye of Ender.</td>
  </tr>
</table>

---

## Example Script

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('projectile', "minecraft:eye_of_ender")
        .item(item => {
            item.signalTo(context => {
                const { level, player, hand } = context
                return // Some BlockPos for the eye to navigate to when thrown
            })
            item.playSoundOverride(null, "ambient.basalt_deltas.additions", "ambient", 1, 1)
        })
        .getItem(entity => {
            return Item.of('minecraft:eye_of_ender') // Some ItemStack
        })
})
```

---

## Key Takeaways

<table>
  <tr>
    <td>
      - Use the `signalTo` method to customize where the Ender Eye navigates when thrown.<br>
      - Override the default sound with `playSoundOverride` to create unique audio effects.<br>
      - Manage the item created for the entity by returning a custom item with the `getItem` method.
    </td>
  </tr>
</table>
