# Modifying and Overriding Methods in Minecraft Entities🔄

<table>
  <tr>
    <td>
      In this guide, we'll explore how to modify and override methods of Minecraft entities using EntityJS. It's important to understand the limitations and scopes of these modifications, particularly when dealing with entities that have overridden methods in their subclasses.
    </td>
  </tr>
</table>

---

## Understanding Method Overrides💡

<table>
  <tr>
    <td>
      Minecraft entities have various methods controlling their behavior, sounds, and interactions. Many of these can be overridden using the `EntityJSEvents.modifyEntity` event, but in some cases, subclass implementations may prevent certain methods from being modified.
    </td>
  </tr>
</table>

<table>
  <tr>
    <td><strong>Example:</strong></td>
    <td>
      You can generally modify the `.setHurtSound()` method for most entities, but for entities like zombies, you cannot override the `getHurtSound()` method because it is already overridden in their subclass.
    </td>
  </tr>
</table>

---

## Example Script

```javascript
//Startup Event
EntityJSEvents.modifyEntity(event => {
    event.modify("minecraft:zombie", modifyBuilder => {
        // Since zombies extend the PathfinderMob class, a ModifyPathfinderMobBuilder will be provided
        modifyBuilder.onRemovedFromWorld(entity => {
            // Code to execute when the zombie is removed from the world
        });
    });
});
```

<table>
  <tr>
    <td>
      This example demonstrates how to modify the behavior of a Minecraft zombie using the `EntityJSEvents.modifyEntity` event. In this case, a custom action is triggered when the zombie is removed from the world.
    </td>
  </tr>
</table>

---

## Key Takeaways

<table>
  <tr>
    <td>
      - You can modify most entity methods using `EntityJSEvents.modifyEntity`, but some methods in subclasses, like `getHurtSound()` in zombies, cannot be overridden.<br>
      - Focus on modifying methods that are not already overridden in the subclass for entities like zombies.
    </td>
  </tr>
</table>


<details>
<summary>Full Code Example 1.19-1.20</summary>

```javascript
EntityJSEvents.modifyEntity(event => {
	event.modify("minecraft:zombie", modifyBuilder => {
		modifyBuilder
			/**
			 * Entity Overrides for entities that are non-living
			 */
			.controlledByFirstPassenger(true)
			.myRidingOffset(entity => 5)
			.canCollideWith(context => true)
			.isFreezing(entity => true)
			.setBlockJumpFactor(entity => 10)
			.isPushable(false)
			.positionRider(context => {
				const { entity, passenger, moveFunction } = context
			})
			.canAddPassenger(context => true)
			.setSwimSound("minecraft:entity.generic.swim")
			.setSwimSplashSound("minecraft:entity.generic.splash")
			.blockSpeedFactor(entity => 1)
			.isFlapping(entity => false)
			.onAddedToWorld(entity => {})
			.repositionEntityAfterLoad(true)
			.onSprint(entity => {})
			.onStopRiding(entity => {})
			.rideTick(entity => {})
			.canFreeze(entity => true)
			.isCurrentlyGlowing(entity => true)
			.setMaxFallDistance(entity => 3)
			.onClientRemoval(entity => {})
			.lavaHurt(entity => {})
			.onFlap(entity => {})
			.dampensVibrations(entity => {})
			.showVehicleHealth(entity => true)
			.thunderHit(context => {})
			.isInvulnerableTo(context => false)
			.canChangeDimensions(entity => false)
			.mayInteract(context => false)
			.canTrample(context => false)
			.onRemovedFromWorld(entity => {})
			.onFall(context => {})
			.lerpTo(context => {})
			.shouldRenderAtSqrDistance(context => true)
			.isAttackable(true)
			.playerTouch(context => {})
			.move(context => {})
			.tick(entity => {})
			.onInteract(context => {
				if (context.player.isShiftKeyDown()) return;
				context.player.startRiding(context.entity);
			})

			/**
			 * LivingEntity Overrides available for living entities
			 */
			.setWaterSlowDown(0.6)
			.setSoundVolume(0.5)
			.shouldDropLoot(entity => false)
			.aiStep(entity => {})
			.isAffectedByFluids(entity => false)
			.isImmobile(entity => false)
			.isAlwaysExperienceDropper(true)
			.calculateFallDamage(context => 1)
			.setDeathSound("minecraft:entity.generic.death")
			.doAutoAttackOnTouch(context => {})
			.setStandingEyeHeight(context => 1)
			.onDecreaseAirSupply(entity => {})
			.onBlockedByShield(context => {})
			.nextStep(entity => 1)
			.onIncreaseAirSupply(entity => {})
			.setHurtSound(context => {
				const { entity, damageSource } = context;
				switch (damageSource.getType()) {
					case "fire":
						return "minecraft:entity.generic.explode";
					case "fall":
						return "minecraft:entity.generic.hurt";
					case "drown":
						return "minecraft:entity.generic.hurt";
					case "explosion":
						return "minecraft:entity.generic.explode";
					default:
						return "minecraft:entity.generic.explode";
				}
			})
			.canAttackType(context => false)
			.scale(entity => 1)
			.shouldDropExperience(entity => false)
			.experienceReward(killedEntity => 10)
			.onEquipItem(context => {})
			.visibilityPercent(context => 1)
			.canAttack(context => false)
			.canBeAffected(context => false)
			.invertedHealAndHarm(entity => true)
			.onEffectAdded(context => {})
			.onLivingHeal(context => {})
			.onEffectRemoved(context => {})
			.onHurt(context => {})
			.onDeath(context => {})
			.dropCustomDeathLoot(context => {})
			.fallSounds("minecraft:entity.generic.small_fall", "minecraft:entity.generic.large_fall")
			.eatingSound("minecraft:entity.zombie.ambient")
			.onClimbable(entity => false)
			.canBreatheUnderwater(true)
			.onLivingFall(context => {})
			.jumpBoostPower(entity => 1)
			.canStandOnFluid(context => true)
			.isSensitiveToWater(entity => true)
			.onItemPickup(context => {})
			.hasLineOfSight(context => false)
			.onEnterCombat(entity => {})
			.onLeaveCombat(entity => {})
			.isAffectedByPotions(entity => false)
			.isAttackableFunction(entity => true)
			.canTakeItem(context => true)
			.isSleeping(entity => false)
			.onStartSleeping(context => {})
			.onStopSleeping(entity => {})
			.eat(context => {})
			.shouldRiderFaceForward(context => true)
			.canDisableShield(entity => true)
			.isPickable(entity => {
				return true;
			})
			.lerpTo(context => {
				const { x, y, z, yaw, pitch, posRotationIncrements, teleport, entity } = context;
				entity.setPositionAndRotation(x, y, z, yaw, pitch);
			})
			.isAlliedTo(context => {
				const { entity, target } = context;
				return target.type == 'minecraft:blaze';
			})
			.onHurtTarget(context => {
				const { entity, targetEntity } = context;
				//Execute code when the target is hurt
			})
			.tickDeath(entity => {})
			.travel(context => {
				const { entity, vec3 } = context;
				// Use the vec3 and entity to determine the travel logic of the entity
			})
			.mobType('undead')
			.positionRider(context => {
				const { entity, passenger, moveFunction } = context;
			})
			/**
			* Mob Overrides for entities extending from Mob class
			*/
			.mobInteract(context => {
				if (context.player.isShiftKeyDown()) return;
				context.player.startRiding(context.entity);
			})
			.createNavigation(context => {
				const { entity, level } = context;
				return EntityJSUtils.createWallClimberNavigation(entity, level);
			})
			.canBeLeashed(context => true)
			.removeWhenFarAway(context => {})
			.ambientSoundInterval(100)
			.onTargetChanged(context => {})
			.ate(entity => {})
			.setAmbientSound("minecraft:entity.zombie.ambient")
			.canHoldItem(context => true)
			.shouldDespawnInPeaceful(true)
			.canPickUpLoot(entity => true)
			.isPersistenceRequired(true)
			.meleeAttackRangeSqr(entity => 2)
			.tickLeash(context => {})
			 /**
			 * PathfinderMob Overrides for mobs extending the PathfinderMob class
			 */
			.shouldStayCloseToLeashHolder(entity => true)
			.followLeashSpeed(1.5)
			.walkTargetValue(context => 10);
	})
});
```
</details>

<details>
<summary>Full Code Example 1.21</summary>

```javascript

EntityJSEvents.modifyEntity(event => {
	event.modify("minecraft:zombie", modifyBuilder => {
		modifyBuilder
			/**
			 * Entity Overrides for entities that are non-living
			 */
			.controlledByFirstPassenger(true)
			.canCollideWith(context => true)
			.isFreezing(entity => true)
			.setBlockJumpFactor(entity => 10)
			.isPushable(false)
			.positionRider(context => {
				const { entity, passenger, moveFunction } = context
			})
			.canAddPassenger(context => true)
			.setSwimSound("minecraft:entity.generic.swim")
			.setSwimSplashSound("minecraft:entity.generic.splash")
			.blockSpeedFactor(entity => 1)
			.isFlapping(entity => false)
			.onAddedToWorld(entity => { })
			.repositionEntityAfterLoad(true)
			.onSprint(entity => { })
			.onStopRiding(entity => { })
			.rideTick(entity => { })
			.canFreeze(entity => true)
			.isCurrentlyGlowing(entity => true)
			.setMaxFallDistance(entity => 3)
			.onClientRemoval(entity => { })
			.lavaHurt(entity => { })
			.onFlap(entity => { })
			.dampensVibrations(entity => { })
			.showVehicleHealth(entity => true)
			.thunderHit(context => { })
			.isInvulnerableTo(context => false)
			.canChangeDimensions(ctx => false)
			.mayInteract(context => false)
			.canTrample(context => false)
			.onRemovedFromWorld(entity => { })
			.onFall(context => { })
			.lerpTo(context => { })
			.shouldRenderAtSqrDistance(context => true)
			.isAttackable(true)
			.playerTouch(context => { })
			.move(context => { })
			.tick(entity => { })
			.onInteract(context => {
				if (context.player.isShiftKeyDown()) return;
				context.player.startRiding(context.entity);
			})
			/**
			 * LivingEntity Overrides available for living entities
			 */
			.setWaterSlowDown(0.6)
			.setSoundVolume(0.5)
			.shouldDropLoot(entity => false)
			.aiStep(entity => { })
			.isAffectedByFluids(entity => false)
			.isImmobile(entity => false)
			.isAlwaysExperienceDropper(true)
			.calculateFallDamage(context => 1)
			.setDeathSound("minecraft:entity.generic.death")
			.doAutoAttackOnTouch(context => { })
			.onDecreaseAirSupply(entity => { })
			.onBlockedByShield(context => { })
			.nextStep(entity => 1)
			.onIncreaseAirSupply(entity => { })
			.setHurtSound(context => {
				const { entity, damageSource } = context;
				switch (damageSource.getType()) {
					case "fire":
						return "minecraft:entity.generic.explode";
					case "fall":
						return "minecraft:entity.generic.hurt";
					case "drown":
						return "minecraft:entity.generic.hurt";
					case "explosion":
						return "minecraft:entity.generic.explode";
					default:
						return "minecraft:entity.generic.explode";
				}
			})
			.canAttackType(context => false)
			.scale(entity => 1)
			.shouldDropExperience(entity => false)
			.experienceReward(killedEntity => 10)
			.onEquipItem(context => { })
			.visibilityPercent(context => 1)
			.canAttack(context => false)
			.canBeAffected(context => false)
			.invertedHealAndHarm(entity => true)
			.onEffectAdded(context => { })
			.onLivingHeal(context => { })
			.onEffectRemoved(context => { })
			.onHurt(context => { })
			.onDeath(context => { })
			.dropCustomDeathLoot(context => { })
			.fallSounds("minecraft:entity.generic.small_fall", "minecraft:entity.generic.large_fall")
			.eatingSound("minecraft:entity.zombie.ambient")
			.onClimbable(entity => false)
			.canBreatheUnderwater(true)
			.onLivingFall(context => { })
			.jumpBoostPower(entity => 1)
			.canStandOnFluid(context => true)
			.isSensitiveToWater(entity => true)
			.onItemPickup(context => { })
			.hasLineOfSight(context => false)
			.onEnterCombat(entity => { })
			.onLeaveCombat(entity => { })
			.isAffectedByPotions(entity => false)
			.isAttackableFunction(entity => true)
			.canTakeItem(context => true)
			.isSleeping(entity => false)
			.onStartSleeping(context => { })
			.onStopSleeping(entity => { })
			.eat(context => { })
			.shouldRiderFaceForward(context => true)
			.canDisableShield(entity => true)
			.isPickable(entity => {
				return true;
			})
			.lerpTo(context => {
				const { x, y, z, yaw, pitch, posRotationIncrements, teleport, entity } = context;
				entity.setPositionAndRotation(x, y, z, yaw, pitch);
			})
			.isAlliedTo(context => {
				const { entity, target } = context;
				return target.type == 'minecraft:blaze';
			})
			.onHurtTarget(context => {
				const { entity, targetEntity } = context;
				//Execute code when the target is hurt
			})
			.tickDeath(entity => { })
			.travel(context => {
				const { entity, vec3 } = context;
				// Use the vec3 and entity to determine the travel logic of the entity
			})
			.positionRider(context => {
				const { entity, passenger, moveFunction } = context;
			})
			/**
			 * Mob Overrides for entities extending from Mob class
			 */
			.mobInteract(context => {
				if (context.player.isShiftKeyDown()) return;
				context.player.startRiding(context.entity);
			})
			.createNavigation(context => {
				const { entity, level } = context;
				return EntityJSUtils.createWallClimberNavigation(entity, level);
			})
			.canBeLeashed(context => true)
			.removeWhenFarAway(context => { })
			.ambientSoundInterval(100)
			.onTargetChanged(context => { })
			.ate(entity => { })
			.setAmbientSound("minecraft:entity.zombie.ambient")
			.canHoldItem(context => true)
			.shouldDespawnInPeaceful(true)
			.canPickUpLoot(entity => true)
			.isPersistenceRequired(true)
			.meleeAttackRangeSqr(entity => 2)
			/**
			 * PathfinderMob Overrides for mobs extending the PathfinderMob class
			 */
			.shouldStayCloseToLeashHolder(entity => true)
			.followLeashSpeed(1.5)
			.walkTargetValue(context => 10);
	})
});
```

</details>

# Builder Type Dependency

<table>
  <tr>
    <td>
      The type of builder provided during entity modification depends on the subtype of the entity being modified. This is determined at runtime by the `modifyEntity` method, which checks the entity's type and provides the appropriate builder.
    </td>
  </tr>
</table>

---

## Available Builders

<table>
  <tr>
    <td><strong>ModifyPathfinderMobBuilder</strong></td>
    <td>Used for entities that extend <code>PathfinderMob</code>.</td>
  </tr>
  <tr>
    <td><strong>ModifyMobBuilder</strong></td>
    <td>Used for entities that extend <code>Mob</code>.</td>
  </tr>
  <tr>
    <td><strong>ModifyLivingEntityBuilder</strong></td>
    <td>Used for entities that extend <code>LivingEntity</code>.</td>
  </tr>
  <tr>
    <td><strong>ModifyEntityBuilder</strong></td>
    <td>Used for entities that extend <code>Entity</code>.</td>
  </tr>
</table>

<table>
  <tr>
    <td>
      Each builder includes methods specific to the features and behaviors of the entity type it supports, ensuring effective and appropriate modifications.
    </td>
  </tr>
</table>

---

## Methods by Builder Type

### ModifyEntityBuilder Methods

<table>
  <tr>
    <td>
      - `onInteract`<br>
      - `controlledByFirstPassenger`<br>
      - `myRidingOffset`<br>
      - `isPickable`<br>
      - `canCollideWith`<br>
      - `isFreezing`<br>
      - `setBlockJumpFactor`<br>
      - `isPushable`<br>
      - `positionRider`<br>
      - `canAddPassenger`<br>
      - `setSwimSound`<br>
      - `setSwimSplashSound`<br>
      - `blockSpeedFactor`<br>
      - `isFlapping`<br>
      - `onAddedToWorld`<br>
      - `repositionEntityAfterLoad`<br>
      - `onSprint`<br>
      - `onStopRiding`<br>
      - `rideTick`<br>
      - `canFreeze`<br>
      - `isCurrentlyGlowing`<br>
      - `setMaxFallDistance`<br>
      - `onClientRemoval`<br>
      - `lavaHurt`<br>
      - `onFlap`<br>
      - `dampensVibrations`<br>
      - `showVehicleHealth`<br>
      - `thunderHit`<br>
      - `isInvulnerableTo`<br>
      - `canChangeDimensions`<br>
      - `mayInteract`<br>
      - `canTrample`<br>
      - `onRemovedFromWorld`<br>
      - `onFall`<br>
      - `lerpTo`<br>
      - `shouldRenderAtSqrDistance`<br>
      - `isAttackable`<br>
      - `playerTouch`<br>
      - `move`<br>
      - `tick`
    </td>
  </tr>
</table>

---

### ModifyLivingEntityBuilder Methods

<table>
  <tr>
    <td>
      - `setWaterSlowDown`<br>
      - `setSoundVolume`<br>
      - `shouldDropLoot`<br>
      - `aiStep`<br>
      - `isPushable`<br>
      - `isAffectedByFluids`<br>
      - `isImmobile`<br>
      - `isAlwaysExperienceDropper`<br>
      - `calculateFallDamage`<br>
      - `setDeathSound`<br>
      - `doAutoAttackOnTouch`<br>
      - `setStandingEyeHeight`<br>
      - `onDecreaseAirSupply`<br>
      - `onBlockedByShield`<br>
      - `repositionEntityAfterLoad`<br>
      - `nextStep`<br>
      - `onIncreaseAirSupply`<br>
      - `setHurtSound`<br>
      - `canAttackType`<br>
      - `scale`<br>
      - `shouldDropExperience`<br>
      - `experienceReward`<br>
      - `onEquipItem`<br>
      - `visibilityPercent`<br>
      - `canAttack`<br>
      - `canBeAffected`<br>
      - `invertedHealAndHarm`<br>
      - `onEffectAdded`<br>
      - `onLivingHeal`<br>
      - `onEffectRemoved`<br>
      - `onHurt`<br>
      - `onDeath`<br>
      - `dropCustomDeathLoot`<br>
      - `fallSounds`<br>
      - `eatingSound`<br>
      - `onClimbable`<br>
      - `canBreatheUnderwater`<br>
      - `onLivingFall`<br>
      - `jumpBoostPower`<br>
      - `canStandOnFluid`<br>
      - `isSensitiveToWater`<br>
      - `onItemPickup`<br>
      - `hasLineOfSight`<br>
      - `onEnterCombat`<br>
      - `onLeaveCombat`<br>
      - `isAffectedByPotions`<br>
      - `isAttackableFunction`<br>
      - `canTakeItem`<br>
      - `isSleeping`<br>
      - `onStartSleeping`<br>
      - `onStopSleeping`<br>
      - `eat`<br>
      - `shouldRiderFaceForward`
    </td>
  </tr>
</table>

---

### ModifyMobBuilder Methods

<table>
  <tr>
    <td>
      - `canDisableShield`<br>
      - `mobInteract`<br>
      - `lerpTo`<br>
      - `isAlliedTo`<br>
      - `onHurtTarget`<br>
      - `tickDeath`<br>
      - `travel`<br>
      - `mobType`<br>
      - `positionRider`<br>
      - `createNavigation`<br>
      - `canBeLeashed`<br>
      - `removeWhenFarAway`<br>
      - `ambientSoundInterval`<br>
      - `onTargetChanged`<br>
      - `ate`<br>
      - `setAmbientSound`<br>
      - `canHoldItem`<br>
      - `shouldDespawnInPeaceful`<br>
      - `canPickUpLoot`<br>
      - `isPersistenceRequired`<br>
      - `meleeAttackRangeSqr`<br>
      - `tickLeash`
    </td>
  </tr>
</table>

---

### ModifyPathfinderMobBuilder Methods

<table>
  <tr>
    <td>
      - `shouldStayCloseToLeashHolder`<br>
      - `followLeashSpeed`<br>
      - `walkTargetValue`
    </td>
  </tr>
</table>

---

# Methods Exclusive to Forge

<table>
  <tr>
    <td>
      - `shouldStayCloseToLeashHolder`<br>
      - `shouldRiderFaceForward`<br>
      - `canTrample`
    </td>
  </tr>
</table>
