# AI Customization Events Overview 🤖

> The AI customization events in EntityJS allow you to add or remove goals from any existing Mob entity as well as modify any living entity's brain logic.

---

## Key Events 🔑

<table>
  <tr>
    <td><strong>addGoalSelectors</strong></td>
    <td>定义实体行为的优先级.</td>
  </tr>
  <tr>
    <td><strong>addGoals</strong></td>
    <td>添加实体要执行的行为</td>
  </tr>
  <tr>
    <td><strong>buildBrain</strong></td>
    <td>构建实体的决策逻辑.</td>
  </tr>
  <tr>
    <td><strong>buildBrainProvider</strong></td>
    <td>定义实体的感知能力和交互能力.</td>
  </tr>
</table>

---

## Add Goal Selectors 🎯

> 这个脚本使你移除了 "wyrm" 原先的Goal并定义 了自定义的Goal.

#### 📜 Server Script:

```javascript
EntityJSEvents.addGoalSelectors('kubejs:wyrm', e => {
    let Player = Java.loadClass('net.minecraft.world.entity.player.Player')
    e.panic(1, 0.5)
    e.floatSwim(1)
    e.meleeAttack(4, 1, true)
    e.leapAtTarget(3, 0.4)
    e.waterAvoidingRandomStroll(5, 0.4, 0.8)
    e.lookAtEntity(6, Player, 8, 0.8, false)
    e.randomLookAround(7)
    e.customGoal(
        'follow_target',
        1,
        mob => true,
        mob => true,
        true,
        mob => {},
        mob => mob.getNavigation().stop(),
        true,
        /** @param {Internal.Mob} mob */ mob => {
            let mobAABB = mob.boundingBox.inflate(5)
            mob.level.getEntitiesWithin(mobAABB).forEach(entity => {
                if (entity == null) return
                if (entity.player && entity.distanceToEntity(mob) < 20) {
                    mob.getNavigation().moveTo(entity.block.x, entity.y, entity.z, 1.0);
                }
            })
        }
    )
    let $PanicGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.PanicGoal")
    e.removeGoal($PanicGoal)
    e.removeGoals(context => {
        const { goal, entity } = context
        return goal.getClass() == $PanicGoal
    })
})
```

---

## Add Goals 🛠️

> 此脚本向"wyrm"实体添加了新的Goal和对目标的行为.

#### 📜 Server Script:

```javascript
EntityJSEvents.addGoals("kubejs:wyrm", event => {
    let Cow = Java.loadClass('net.minecraft.world.entity.animal.Cow')
    event.hurtByTarget(1, [Cow], true, [Cow])
    event.nearestAttackableTarget(2, Cow, 5, false, false, entity => {
        return entity.age < 500
    })
    const $BreedGoal = Java.loadClass('net.minecraft.world.entity.ai.goal.BreedGoal')
    event.arbitraryTargetGoal(2, entity => new $BreedGoal(entity, 1))
    let $PanicGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.PanicGoal")
    event.removeGoal($PanicGoal)
    event.removeGoals(context => {
        const { goal, entity } = context
        return goal.getClass() == $PanicGoal
    })
})
```

---

## Build Brain 🧠

> 此脚本为"wyrm"实体构建了逻辑策略逻辑,定义其行为.

#### 📜 Server Script:

```javascript
EntityJSEvents.buildBrain('kubejs:wyrm', event => {
    const activitybehaviors = [
        event.behaviors.animalMakeLove('kubejs:wyrm', 0.2),
        event.behaviors.followTemptation(entity => {
            return 1;
        }),
        event.behaviors.animalPanic(2)
    ]
    const idlebehaviors = [
        event.behaviors.animalPanic(2)
    ]
    const corebehaviors = [
        event.behaviors.meleeAttack(5)
    ]
    event.addActivity('minecraft:panic', 1, activitybehaviors)
    event.idleActivity(1, idlebehaviors)
    event.coreActivity(1, corebehaviors)
})
```

---

## Build Brain Provider 🧩

> 此脚本通过添加记忆和传感器来定义"wyrm"实体的感知和记忆逻辑.

#### 📜 Server Script:

```javascript
EntityJSEvents.buildBrainProvider('kubejs:wyrm', event => {
    event.addMemory("angry_at")
    event.addSensor('nearest_adult')
})
```
