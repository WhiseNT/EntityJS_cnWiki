# **Entity Registration Overview** 🛠️

> Entity registration allows you to dynamically define and customize entities using several types of builders. Each builder type provides specific functionalities to help you shape unique entity behaviors.

---

## Builder Types 🏗️

<table>
  <tr>
    <td><strong>🔵 LivingEntity Builder</strong></td>
    <td>创造拥有基础属性和行为的LivingEntity</td>
  </tr>
  <tr>
    <td><strong>🚶 PathfinderMob Builder</strong></td>
    <td>创造具有寻路和导航能力的mob</td>
  </tr>
  <tr>
    <td><strong>🍼 AgeableMob Builder</strong></td>
    <td>创造类似于动物的mob,能够长大和繁殖.</td>
  </tr>
  <tr>
    <td><strong>🐕 TamableMob Builder</strong></td>
    <td>创造可驯服的动物或者中立生物.</td>
  </tr>
  <tr>
    <td><strong>🏹 Arrow Builder</strong></td>
    <td>自定义具有独特效果和行为的箭矢.</td>
  </tr>
  <tr>
    <td><strong>🚀 Projectile Builder</strong></td>
    <td>定义具有特定行为的自定义投射物</td>
  </tr>
  <tr>
    <td><strong>🐟 Water Entity Builder</strong></td>
    <td>创造拥有水生行为的水生动物</td>
  </tr>
  <tr>
    <td><strong>🧱 Non-Living Entity Builder</strong></td>
    <td>创造拥有自定义属性的Non-Living Entity</td>
  </tr>
</table>

> *More builders coming soon...*

---

## Builder Script Example 💻

```javascript
// 实体创建例 (models/textures 要包括 'kubejs:wyrm', 'kubejs:sasuke', 'kubejs:arrow', 'kubejs:projectile')
StartupEvents.registry('entity_type', event => {
    event.create('bat', 'entityjs:living') // LivingEntity Builder
    event.create('sasuke', 'entityjs:mob') // PathfinderMob Builder 
    event.create('wyrm', 'entityjs:animal') // AgeableMob Builder
    event.create('dragon', 'entityjs:tamable') // TamableMob Builder
    event.create('arrow', "entityjs:arrow") // Arrow Builder 
    event.create('projectile', "entityjs:projectile") // Projectile builder 
    event.create('serpent', "entityjs:watercreature") // Water Animal Builder
    event.create('dummy', "entityjs:nonliving") // Non-Living Entity Builder
    event.create('projectile', "entityjs:geckolib_projectile") // Projectile builder with Geckolib modelling
})
```

下例包含了*大多数*可用的方法
## **Full TamableMob Entity Example**
<details>
<summary>Full Animal Entity Example Usage 1.19.2</summary>

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'entityjs:tamable')
        /**
         * One-Off values set at the startup of the game.
         */
        .immuneTo("minecraft:stone", "minecraft:dirt")
        .canSpawnFarFromPlayer(true)
        .clientTrackingRange(20)
        .mobCategory('monster')
        .setRenderType("solid")
        .sized(1, 1)
        .modelSize(2, 3)
        .updateInterval(3)
        .defaultDeathPose(true)
        .repositionEntityAfterLoad(true)
        .isPersistenceRequired(true)
        .isAlwaysExperienceDropper(true)
        .setDeathSound("minecraft:entity.generic.death")
        .canJump(true)
        .ambientSoundInterval(100)
        .isPushable(true)
        .canBreatheUnderwater(true)
        .eatingSound("minecraft:entity.zombie.ambient")
        .fallSounds("minecraft:entity.generic.small_fall", "minecraft:entity.generic.large_fall")
        .fireImmune(false)
        .followLeashSpeed(1.5)
        .setAmbientSound("minecraft:entity.zombie.ambient")
        .mainArm("left")
        .mobType('undead')
        .saves(true)
        .setSoundVolume(0.5)
        .setSummonable(true)
        .setSwimSound("minecraft:entity.generic.swim")
        .setSwimSplashSound("minecraft:entity.generic.splash")
        .setWaterSlowDown(0.6)
        .shouldDespawnInPeaceful(true)
        .mountJumpingEnabled(true)
	.tamableFood([
	    'minecraft:diamond',
	    Ingredient.of("minecraft:bedrock")
	])
        .isFood([
            'minecraft:diamond',
            Ingredient.of("minecraft:apple")
        ])
        .isFood([
            'minecraft:diamond',
            Ingredient.of("minecraft:apple")
        ])
        // .noEggItem() // 禁止自动生成对应的鸡蛋
        //自定义鸡蛋
        .eggItem(item => {
            item.backgroundColor(0);
            item.highlightColor(0);
        })
        .canFireProjectileWeapon([
            'minecraft:bow',
            'minecraft:crossbow'
        ])
        .newGeoLayer(builder => {
        // 新的渲染层,例如爆炸的苦力怕和凋零拥有的
            /*builder.textureResource(entity => {
                return "kubejs:textures/entity/sasuke.png"
            })*/
        })
        /**
         * 如果值和所需结果不匹配,则下列方法需要设置一个返回值.
         * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
         *
         * 记住,所有回调函数也可以用全局事件来进行热重载.
         *
         * 例:
         * global.interact = context => {
         *  if (context.player.isShiftKeyDown()) return
         *      context.player.startRiding(context.entity);
         * }
         *
         * .onInteract(context => global.interact(context)) // Reload this with /kubejs reload startup_scripts
         */

        .addAnimationController('exampleController', 1, event => {
            if (event.entity.hurtTime > 0) {
                event.thenPlayAndHold('spawn');
            } else {
                event.thenLoop('idle');
            }
            return true;
        })
        .setBreedOffspring(context => {
            const { entity, mate, level } = context
            // 使用context返回实体配对时要生成的实体的ResourceLocation
            return 'minecraft:cow' //实体的资源位置
        })
        .addPartEntity("head", 1, 1, builder => {
            // 使用builder为实体添加额外的hitbox
            builder
                .isPickable(true)
                .onPartHurt(context => {
                    const { entity, part, source, amount } = context
                    // 用于确定不同部分怎么传递伤害信号的自定义逻辑到实体
                    // 例如当这个hitbox被击中时,对实体造成双倍伤害
                    entity.attack(source, amount * 2)
                    console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
                })
        })
        .aiStep(entity => {
            // 自定义Living Entity AI执行的逻辑
            // 访问有关实体的信息
            // 让之前注册的部件实体/hitbox使其与实体的y轴方向偏移1方块.
            entity.tickPart("head", 0, 1, 0)
        })
	.setLookControl(entity => {
	    return EntityJSUtils.createLookControl(entity, lookControlBuilder => { })
	})
	.setMoveControl(entity => {
	    return EntityJSUtils.createMoveControl(entity, moveControlBuilder => { })
	})
	.setJumpControl(entity => {
	    return EntityJSUtils.createJumpControl(entity, jumpControlBuilder => { })
	})
        .createNavigation(context => {
            const { entity, level } = context
            //使用新的EntityJSUtils绑定创建不同的路径导航.
            //在此处返回WallClimberNavigation 将允许实体像蜘蛛一样寻路.
            return EntityJSUtils.createWallClimberNavigation(entity, level) // 返回一些寻路的特征
        })
        .render(context => {
            // 定义渲染实体的核心逻辑(建议改用.scaleModelForRender)
            if (context.entity.isBaby()) {
                return context.poseStack.scale(0.5, 0.5, 0.5); // 如果实体是baby,则会按照比例缩小.
            }
            return context.poseStack; // 否则保持默认的姿势
        })
        .scaleModelForRender(context => {
            // 定义渲染实体的逻辑,而不改变核心逻辑,如hitbox渲染.
            const { entity, widthScale, heightScale, poseStack, model, isReRender, partialTick, packedLight, packedOverlay } = context
            if (entity.hurtTime > 0) {
                poseStack.scale(0.5, 0.5, 0.5)
            }
        })
        .jumpBoostPower(entity => {
            //当实体获得跳跃提升效果时,设置实体的跳跃增强能力.
            //模仿原版的逻辑,使用抗性提升来代替跳跃提升
            return entity.hasEffect("minecraft:resistance") ? (0.1 * (entity.getEffect("minecraft:resistance").getAmplifier() + 1)) : 0.0;
        })
        .setBlockJumpFactor(entity => {
            // 设置实体的方块跳跃因子,返回一个浮点数
            if (entity.age > 2000) {
                return 1.3; // 当实体的年龄足够大时,增加其跳跃因子
            }
            return 1; // 默认的跳跃因子
        })
        .setMaxFallDistance(entity => {
            // 定义自定义逻辑,以确定实体的无伤下落距离.
            // Use information about the LivingEntity provided by the
            if (entity.isOnFire()) {
                return 1; // 实体着火时,下降的距离会减少.
            }
            return 3; // 默认的无伤下落距离.
        })
        .myRidingOffset(entity => {
            // 使用提供的有关实体的context来确定作为passebfer的乘骑偏移坐标
            if (!entity.isBaby()) {
                return 7; // 当实体不是baby时,增加乘骑偏移
            }
            return 5; // Default riding offset
        })
        .animationResource(entity => {
            // 根据实体的状态返回不同的动画资源
            // Use information about the LivingEntity provided by the context.
            if (entity.hurtTime > 0) {
                return // 当实体受伤时返回一些动画路径
            } else {
                return "kubejs:animations/entity/wyrm.animation.json"; // 否则返回wyrm动画
            }
        })
        .blockSpeedFactor(entity => {
            // 定义逻辑以计算并且返回实体的方块运动速度因子
            // Use information about the LivingEntity provided by the context.
            const age = entity.age;
            const maxAge = 5000; // 假设最大的年龄为5000

            // 自定义实体的方块运动速度因子基于实体的年龄的逻辑
            const factor = age < maxAge ? 1.0 : 0.5; // 年龄更大的实体速度更慢
            return factor;
        })
        .calculateFallDamage(context => {
            // 定义计算实体下落伤害的逻辑并返回坠落伤害
            // Use information about the CalculateFallDamageContext provided by the context.
            const fallHeight = context.fallHeight;
            const damageMultiplier = context.damageMultiplier;
            const entity = context.entity;

            // 自定义基于坠落高度和乘数计算坠落伤害的逻辑
            const calculatedDamage = Math.floor(fallHeight * damageMultiplier);
            return calculatedDamage;
        })
        .canAddPassenger(context => {
            // 定义自定义逻辑以确定是否可以将passenger添加到实体中
            // Use information about the PassengerEntityContext provided by the context.
            // 例如实体是否已经有太多的passenger正在乘骑.
            const maxPassengers = 4; // 假设最大的passenger数量为4
            return context.entity.getPassengers().size() < maxPassengers;
        })
        .isAlliedTo(context => {
            const { entity, target } = context
            return target.type == 'minecraft:blaze'
        })
        .canAttack(context => {
            // 定义条件以检查实体是否可以攻击targetEntity
            // Use information about the LivingEntity provided by the context.
            // 例如，检查targetEntity是否与实体本身不同.
            return context.target.type !== context.entity.type;
        })
        .canAttackType(context => {
            // 定义条件以检查实体是否可以攻击指定的实体类型
            // Use information about the EntityTypeEntityContext provided by the context.
            // 例如:检查目标的实体类型是否为特定类型.
            const targetType = context.targetType.category.friendly;
            // 假设我们希望实体只攻击友好的mob.
            return targetType;
        })
        .canBeAffected(context => {
            // 定义条件以检查实体是否会受到影响.
            // Use information about the OnEffectContext provided by the context.
            // 例如，检查实体是否尚未受到特定效果的影响.
            const effect = context.effect;
            //假设我们只希望实体在没有相同效果的情况下受到影响.
            return !context.entity.hasEffect(effect.getEffect());
        })
        .canChangeDimensions(entity => {
            // Define the conditions for the entity to be able to change dimensions
            // Use information about the LivingEntity provided by the context.
            // For example, allow dimension change only for entities with a specific tag.
            return entity.tags.contains("dimension_changer");
        })
        .canDisableShield(entity => {
            // 定义实体是否可以破盾.
            // Use information about the LivingEntity provided by the context.
            return entity.mainHandItem.id == 'minecraft:diamond_sword'; // 如果实体正在使用钻石剑攻击,能够破盾.
        })
        .canFireProjectileWeaponPredicate(context => {
            // 自定义实体可以发射弹射物的逻辑
            // Access information about the entity and the projectile weapon using the provided context.
            return context.projectileWeapon.id == 'minecraft:bow';
        })
        .canFreeze(entity => {
            // 定义实体可以被冻结的条件
            // 例如,只有在水中时实体可以被冻结
            return entity.inWater;
        })
        .canHoldItem(context => {
            // 自定义实体是否可以保存物品的逻辑,基于提供的context
            // 例如,只有实体不是baby时才荀彧持有物品.
            return !context.entity.isBaby();
        })
        .canBreed(entity => {
            // 自定义逻辑,用于确定实体是否可以繁殖
            // Use information about the LivingEntity provided by the context.
            // 例如,检测实体是否已经成熟
            const baby = entity.isBaby();
            // 假设我们希望实体只有在成年后才能繁殖
            return baby;
        })
        .canMate(context => {
            // 确定实体是否可以配对的自定义逻辑
            // 例如,只有当两种动物都在同一生物群落中时,才允许交配.
            let blockpos1 = context.animal.block.pos
            let blockpos2 = context.otherAnimal.block.pos
            return context.animal.level.getBiome(blockpos1) === context.otherAnimal.level.getBiome(blockpos2);
        })
        .canPickUpLoot(entity => {
            // 自定义实体拾取mob战利品的逻辑
            // 允许在夜晚拾取战利品

            return !entity.level.isDay(); // 只允许在夜晚拾取战利品
        })
        .canStandOnFluid(context => {
            // 定义实体可以站在流体上的条件
            // Use information about the EntityFluidStateContext provided by the context.
            // 允许站在水面上
            let fluid = Fluid.of("minecraft:water").fluid.fluidType
            return context.fluidState.fluidType == fluid
        })
        .canTakeItem(context => {
            // 定义实体允许拾取物品的条件
            // Use information about the EntityItemLevelContext provided by the context.
            // 只有在实体非空且物品栏非空的情况下才允许拾取物品.
            return context.entity !== null && !context.itemStack.isEmpty();
        })
        .dampensVibrations(entity => {
            // 定义实体是否能够抑制振动
            // 如果能则返回true,否则返回false
            // 例如当实体没有重力时,返回true
            return entity.isNoGravity();
        })
        .experienceReward(killedEntity => {
            // 定义逻辑以计算并返回被杀死实体的经验奖励
            // Use information about the LivingEntity provided by the context.
            // 例如返回实体护甲覆盖率的5倍经验
            const armorCoverPercentage = killedEntity.armorCoverPercentage + 1;
            return armorCoverPercentage * 5;
        })
        .hasLineOfSight(context => {
            // 检查目标实体是否在同一个世界中
            if (context.targetEntity.level !== context.entity.level) {
                return false;
            }
            // 获取实体的位置
            const entityPos = new Vec3(context.entity.getX(), context.entity.getEyeY(), context.entity.getZ());
            const targetPos = new Vec3(context.targetEntity.getX(), context.targetEntity.getEyeY(), context.targetEntity.getZ());
            // 计算实体之间的距离
            const distance = entityPos.distanceTo(targetPos);
            // 检查目标实体是否在合理的范围内
            if (distance > 128.0) {
                return false;
            }
            // 允许实体穿透方块看实体,而不是像LivingEntity类中那样实现ClipContext
            return true;
        })
        .setHurtSound(context => {
            // 自定义实体的受伤声音
            // You can use information from the HurtContext to customize the sound based on the context
            const { entity, damageSource } = context;
            // 根据伤害类型确定受伤声音
            switch (damageSource.getType()) {
                case "fire":
                    return "minecraft:entity.generic.burn";
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
        .invertedHealAndHarm(entity => {
            //亡灵生物用它来反转药水效果,例如瞬间恢复=瞬间伤害
            const blockAboveHasSky = entity.block.down.canSeeSky;
            return blockAboveHasSky; // Return true if the block below has sky visibility
        })
        .isAffectedByFluids(entity => {
            // 定义实体是否受到流体影响
            // 例如:检查实体是在游泳还是飞行
            return entity.isSwimming() || entity.isFallFlying();
        })
        .isAffectedByPotions(entity => {
            //定义实体是否受到药水效果影响
            // 例如,检查实体是否拥有药水效果
            return entity.getActiveEffects().size() > 0;
        })
        .isAttackable(entity => {
            // 定义实体是否可攻击
            // 例如,检查实体是否无法被攻击.
            return !entity.isInvulnerable();
        })
        .isCurrentlyGlowing(entity => {
            // 定义条件以检查实体是否在发光
            // 例如,检查实体是否被应用了生命恢复效果或者发光效果
            return entity.hasEffect("minecraft:regeneration") || entity.hasEffect("minecraft:glowing");
        })
        .isFlapping(entity => {
            // 模仿末影龙扇翅膀的行为
            // 定义逻辑来检查实体是否在扇翅膀
            const flapTime = entity.flapTime; // 当前扇翅时间
            const oFlapTime = entity.oFlapTime; // 上次扇翅时间

            // 计算上次时间和这次时间的余弦值
            const f = Math.cos(flapTime * 6.2831855);
            const f1 = Math.cos(oFlapTime * 6.2831855);

            // 检查实体是否根据余弦值摆动
            return f1 <= -0.3 && f >= -0.3;
        })
	.tamableFoodPredicate(context => {
	    const { entity, item } = context
	    return item.id == 'minecraft:carrot' // 如果玩家当前的物品将驯服mob,则返回true
	})
        .isFoodPredicate(context => {
            // 自定义逻辑,用于确定该物品是否被视为食物.
            // Access information about the item stack using the provided context.
            const itemStack = context.item; // 从context中获取物品

            // 例如:检查该物品是否可被食用
            return itemStack.isEdible();
        })
        .isFreezing(entity => {
            // 定义实体开始冻结的条件
            // Use information about the LivingEntity provided by the context.
            // 如果实体在泰加林生物群落中并且可以冻结，则开始冻结实体。
            return entity.level.getBiome(entity.block.pos) == 'minecraft:taiga' && entity.canFreeze();
        })
        .isImmobile(entity => {
            // 定义逻辑以确定实体是否无法移动
            // Use information about the LivingEntity provided by the context.
            return entity.isSleeping(); // 例如:如果实体在睡觉,则无法被移动
        })
        .isInvulnerableTo(context => {
            // 定义实体不受特定类型伤害的条件
            // Use information about the DamageContext provided by the context.

            // 示例条件:实体不会受到魔法伤害
            return context.damageSource.isMagic();
        })
        .isSensitiveToWater(entity => {
            // 定义条件以检查实体是否位于"Cold Ocean"生物群系中并对水敏感
            // Use information about the LivingEntity provided by the context.

            // 示例条件:检查生物所在的生物群系是否等于"Cold Ocean"
            return entity.level.getBiome(entity.block.pos).is('minecraft:cold_ocean')
        })
        .isSleeping(entity => {
            // 检查实体是否在睡觉
            // Use information about the LivingEntity provided by the context.
            //模仿原版去执行isSleeping()方法
            return entity.getSleepingPos().isPresent();
        })
        .mayInteract(context => {
            //定义允许实体与世界交互的条件
            // Use information about the MayInteractContext provided by the context.
            return context.entity.getTags().contains('canInteractWithWorld')
        })
        .meleeAttackRangeSqr(entity => {
            // 定义自定义的逻辑,根据提供的实体计算近战攻击范围来计算攻击的面积
            // 例如你可以根据实体的大小活着类型来计算
            const size = entity.boundingBox.size;
            const range = size * size; // 根据要求调整此计算
            return range;
        })
        .nextStep(entity => {
            // 定义自定义逻辑,根据提供的实体计算下一步
            const movementSpeed = entity.getTotalMovementSpeed(); // 获取实体的行动速度
            //如果实体不是动物,则返回默认的原版行为
            if (!entity.animal) return entity.moveDist + 1;
            const behaviorFactor = entity.isAggressive() ? 1.5 : 1; // 根据行为调整步长
            // 根据移动速度、大小和行为计算下一步距离
            const nextStepDistance = movementSpeed * behaviorFactor;
            return nextStepDistance;
        })
        .onClimbable(entity => {
            const blockBelow = entity.block.down; // 获取实体脚下的方块
            // 检查方块是否能攀爬(例如梯子和藤蔓)
            const isClimbableBlock = blockBelow.hasTag('minecraft:my_climbeable_block_tag');

            // 检查实体是否在向上移动(正在爬升)
            const isMovingUpwards = entity.motionY > 0;

            // 如果实体位于可爬方块上且正在向上移动,返回true
            return isClimbableBlock && isMovingUpwards;
        })
        .removeWhenFarAway(context => {
            // Get information from the context
            const { distanceToClosestPlayer } = context;
            // 如果离实体最近的玩家很远,要删除实体,则返回true
            //微调删除逻辑
            return distanceToClosestPlayer > 64;
        })
        .scale(entity => {
            // 定义逻辑以计算实体的自定义比例
            // 例如可以根据实体的大小或者其他属性来缩放实体
            return entity.isBaby() ? 0.5 : 1;
        })
        .setStandingEyeHeight(context => {
            // 定义逻辑以计算并返回实体的站立高度
            // Use information about the EntityPoseDimensionsContext provided by the context
            const entity = context.entity; // 从context中获取实体
            const pose = context.pose; // 从context中获取实体的姿势

            // 定义默认的实体站立眼高
            let standingEyeHeight = 1.8; // 默认的类人生物站立眼高

            // 如果需要，根据实体姿势调整眼高
            if (pose === 'crouching') {
                standingEyeHeight = 1.5; // 潜行时调整眼高
            }

            // 返回计算出的站立眼高
            return standingEyeHeight;
        })
        .shouldDropExperience(entity => {
            // 定义条件，检查实体是否应该在死亡后掉落经验
            // Use information about the LivingEntity provided by the context.
            return entity.block.down.id == 'minecraft:grass_block'// 只有在实体在草方块上时死亡才会掉落经验
        })
        .shouldDropLoot(entity => {
            // 定义逻辑以确定实体是否应该掉落战利品
            // Use information about the LivingEntity provided by the context.
            return !entity.isBaby(); //只有当实体不是baby时会掉落战利品
        })
        .showVehicleHealth(entity => {
            // Determine whether to show the vehicle health for the living entity
            // Return true to show the vehicle health, false otherwise
            return !entity.isFallFlying(); //Only show vehicle's health to the player if the vehicle is fall flying
        })
        .visibilityPercent(context => {
            // 定义逻辑以计算并返回targetEntity被看到次数的百分比
            // Use information about the Entity provided by the context.
            // 我们的mob在平原被其他mob"看到"的次数减少了20%
            return context.lookingEntity.age > 0 ? 0.8 : 1
        })
        .walkTargetValue(context => {
            const { levelReader, pos } = context; // 解构context来访问

            // 获取给定位置下面方块的状态
            const blockBelow = levelReader.getBlockState(pos.below());

            // 根据脚下的方块调整行走目标值,通常的是原版的草方块
            return blockBelow.is(Blocks.AZALEA_LEAVES) ? 10 : levelReader.getPathfindingCostFromLightLevels(pos);
        })
        .canCollideWith(context => {
            return true //确定实体是否能和另一个实体相互碰撞的布尔值
        })

        /**
         * 下面的所有方法都返回void，这意味着它们不需要设置返回值才能运行.
         * 这些大多类似于KubeJS的正常事件，你可以对实体调用的某些事件执行操作！
         */

        .tickLeash(context => {
            const { player, entity } = context
            if (player != undefined && player.isDiscrete()) {
                // 给玩家一颗钻石
                player.give(Item.of('minecraft:diamond'));
                // 打印一条信息用于表示钻石已经给予
                console.log(`Gave ${player.getName()} a diamond for sneaking while leashing ${entity.type}.`);
            }
        })
        .tick(entity => {
            if (entity.age % 100 != 0) return
            console.log('ticked every 100 ticks')
        })
        .lavaHurt(entity => {
            // 治疗实体20血
            entity.heal(20);
        })
        .doAutoAttackOnTouch(context => {
            // 以1的伤害值攻击目标实体
            context.target.attack(1);
        })
        .ate(entity => {
            // 当实体吃食物时打印一条消息.
            console.log(`${entity.type} just ate!`)
        })
        .dropCustomDeathLoot(context => {
            // 当实体死亡，抢夺等级为2时，掉落自定义战利品(铁定)
            if (context.lootingMultiplier == 2) context.entity.block.popItemFromFace('minecraft:iron_ingot', 'up')
        })
        .eat(context => {
            // 当实体吃东西时治疗实体
            context.entity.heal(20)
        })
        .lerpTo(context => {
            const { x, y, z, yaw, pitch, entity, delta } = context;
            // 当实体冻结时,将实体的位置直接设置成目标位置
            if (entity.isFreezing()) entity.setPosition(x, y, z);
        })
        .onAddedToWorld(entity => {
            // 如果实体被冻结,则将实体的位置直接设置成目标位置
            entity.teleportTo(entity.level.dimension, entity.x, entity.y + 1, entity.z, 1, 1)
        })
        .onBlockedByShield(context => {
            const {entity, target} = context
            // 当目标被盾牌挡住时,打印一条信息
            console.log(`${target} Get blocked!`)
        })
        .onClientRemoval(entity => {
            // 在客户端删除实体时打印信息
            console.log(`${entity} was removed on the client`)
        })
        .onDeath(context => {
            // 当实体死亡时,将钻石矿放置在实体的脚下
            context.entity.block.down.set('minecraft:diamond_ore')
        })
        .onDecreaseAirSupply(entity => {
            // 当实体的氧气条减少时，打印一条信息
            console.log(entity.airSupply)
        })
        .onEffectAdded(context => {
            // 打印添加效果的描述ID
            console.log(context.effect.descriptionId)
        })
        .onEffectRemoved(context => {
            // 打印已删除效果的描述ID
            console.log(context.effect.descriptionId)
        })
        .onEnterCombat(entity => {
            // Log a message when the entity enters combat
            console.log(`${entity} just entered combat`)
        })
        .onEquipItem(context => {
            // 打印实体所拥有的物品的id
            if (context.entity.age % 100 != 0) return
            console.log(context.currentStack.id)
        })
        .onFlap(entity => {
            // 在实体翻转时,在实体脚下放置一个金矿.
            entity.block.down.set('minecraft:gold_ore')
        })
        .onHurt(context => {
            // 打印实体受到的伤害
            console.log(context.damageAmount)
        })
        .onIncreaseAirSupply(entity => {
            // 当实体的氧气条增加时打印一条信息
            console.log(`${entity} increasing air`)
        })
        .onItemPickup(context => {
            // 当实体捡起物品时打印一条信息
            console.log(context.itemEntity.id)
        })
        .onLeaveCombat(entity => {
            // 当实体离开战斗时打印一条信息
            console.log(`${entity} just left combat!`)
        })
        .onLivingFall(context => {
            // 当实体倒下时打印一条信息
            console.log(`${context.entity} just fell ${context.distance} blocks!`)
        })
        .onLivingHeal(context => {
            // 当实体治疗时打印一条信息
            console.log(`${context.entity} just gained ${context.healAmount} health!`)
        })
        .onLivingJump(entity => {
            // 当实体跳跃时打印一条信息
            console.log(`${entity} just jumped!`)
        })
        .onRemovedFromWorld(entity => {
            // 当实体被移除出世界时打印一条信息
            console.log(`${entity} was just removed from the world!`)
        })
        .onSpawnChildFromBreeding(context => {
            // 当实体与另一个实体进行繁殖时打印一条信息
            console.log(`${context.entity} mated with ${context.mate}! *blush*`)
        })
        .onSprint(entity => {
            // 当实体在疾跑时打印一条信息
            console.log(`${entity} is sprinting!`)
        })
        .onStartSleeping(context => {
            // 当实体在睡觉时打印一条信息
            console.log(`Sleeping at ${context.blockPos}`)
        })
	.onStopRiding(entity => {
	    // 当实体停止乘骑时,在上方放置一颗钻石
	    if (!entity.isPassenger()) return
	    entity.block.popItemFromFace('minecraft:diamond', 'up')
	})
        .onStopSleeping(entity => {
            // 当实体停止睡觉时打印一条信息
            console.log(`Stopped sleeping at ${entity.pos}`)
        })
        .onTargetChanged(context => {
            //Only firing every 100 ticks to reduce log spam.
            if (context.entity.age % 100 != 0) return
            // Log a message when the entity's target changes
            if (context.target == null) return
            console.log(`${context.target} is being targeted!`)
        })
        .playerTouch(context => {
            // Attack the player when touched by the entity
            context.player.attack(1)
        })
        .rideTick(entity => {
            // Log a message every 100 ticks if the entity is a vehicle
            if (entity.age % 100 != 0) return
            console.log(entity.isVehicle())
        })
        .thunderHit(context => {
            // 当实体被闪电击中时得到治疗
            context.entity.heal(15)
        })
        .onTamed(entity => {
	    // 当实体被驯服时做些什么
	    })
	.tameOverride(context => {
	    const { entity, player } = context
	    // 模仿实体被驯服时设置uuid的原版方式
	    entity.setOwnerUUID(player.getUUID());
	})
	//Default vanilla implimentation of tickDeath removes the entity from the world after 20 ticks
	/*.tickDeath(entity => {
	    // Override the tickDeath method in the entity
	})*/
        .onInteract(context => global.interact(context))
})

/**
 *
 * @param {Internal.ContextUtils$MobInteractContext} context
 * @returns
 */
global.interact = context => {
    if (context.player.isShiftKeyDown()) return
    context.player.startRiding(context.entity);
}
```

</details>

<details>
<summary>Full Animal Entity Example Usage 1.20.1</summary>

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'entityjs:tamable')
        /**
         * One-Off values set at the startup of the game.
         */
        .immuneTo("minecraft:stone", "minecraft:dirt")
        .canSpawnFarFromPlayer(true)
        .clientTrackingRange(20)
        .mobCategory('monster')
        .setRenderType("solid")
        .sized(1, 1)
        .modelSize(2, 3)
        .updateInterval(3)
        .defaultDeathPose(true)
        .repositionEntityAfterLoad(true)
        .isPersistenceRequired(true)
        .isAlwaysExperienceDropper(true)
        .setDeathSound("minecraft:entity.generic.death")
        .canJump(true)
        .ambientSoundInterval(100)
        .isPushable(true)
        .canBreatheUnderwater(true)
        .eatingSound("minecraft:entity.zombie.ambient")
        .fallSounds("minecraft:entity.generic.small_fall", "minecraft:entity.generic.large_fall")
        .fireImmune(false)
        .followLeashSpeed(1.5)
        .setAmbientSound("minecraft:entity.zombie.ambient")
        .mainArm("left")
        .mobType('undead')
        .saves(true)
        .setSoundVolume(0.5)
        .setSummonable(true)
        .setSwimSound("minecraft:entity.generic.swim")
        .setSwimSplashSound("minecraft:entity.generic.splash")
        .setWaterSlowDown(0.6)
        .shouldDespawnInPeaceful(true)
        .mountJumpingEnabled(true)
	.tamableFood([
	    'minecraft:diamond',
	    Ingredient.of("minecraft:bedrock")
	])
        .isFood([
            'minecraft:diamond',
            Ingredient.of("minecraft:apple")
        ])
        // .noEggItem() // Disables automatic egg item creation
        //Customize egg item
        .eggItem(item => {
            item.backgroundColor(0);
            item.highlightColor(0);
        })
        .canFireProjectileWeapon([
            'minecraft:bow',
            'minecraft:crossbow'
        ])
        .newGeoLayer(builder => {
        // New render layers like what the exploding Creeper or the Wither has
            /*builder.textureResource(entity => {
                return "kubejs:textures/entity/sasuke.png"
            })*/
        })
        /**
         * These methods below require a set return value, if the value does not match the required result
         * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
         *
         * Remember all callback functions are also able to be live-edited with global events!
         *
         * Example:
         * global.interact = context => {
         *  if (context.player.isShiftKeyDown()) return
         *      context.player.startRiding(context.entity);
         * }
         *
         * .onInteract(context => global.interact(context)) // Reload this with /kubejs reload startup_scripts
         */

        .addAnimationController('exampleController', 1, event => {
            if (event.entity.hurtTime > 0) {
                event.thenPlayAndHold('spawn');
            } else {
                event.thenLoop('idle');
            }
            return true;
        })
        .setBreedOffspring(context => {
            const { entity, mate, level } = context
            // Use the context to return a ResourceLocation of an entity to spawn when the entity mates
            return 'minecraft:cow' //Some Resourcelocation representing the entity to spawn.
        })
        .addPartEntity("head", 1, 1, builder => {
            // Adds an additional hitbox to the entity with builder support
            builder
                .isPickable(true)
                .onPartHurt(context => {
                    const { entity, part, source, amount } = context
                    // Custom logic for determining how the parts of the entity should relay damage
                    // To the entity. For example, relay double the damage to the entity when this hitbox is hit
                    entity.attack(source, amount * 2)
                    console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
                })
        })
        .aiStep(entity => {
            // Custom logic to be executed during the living entity's AI step
            // Access information about the entity
            // Tick the previously registered part entity/hitbox to be 1 square y-offset to the entity
            entity.tickPart("head", 0, 1, 0)
        })
	.setLookControl(entity => {
	    return EntityJSUtils.createLookControl(entity, lookControlBuilder => { })
	})
	.setMoveControl(entity => {
	    return EntityJSUtils.createMoveControl(entity, moveControlBuilder => { })
	})
	.setJumpControl(entity => {
	    return EntityJSUtils.createJumpControl(entity, jumpControlBuilder => { })
	})
        .createNavigation(context => {
            const { entity, level } = context
            // Use the new EntityJSUtils binding to create different path navigations
            // Returning WallClimberNavigation here will allow the entity to path-find up walls like spiders
            return EntityJSUtils.createWallClimberNavigation(entity, level) // Return some path navigation
        })
        .render(context => {
            // Define core logic to render the entity (recommended to use .scaleModelForRender instead)
            if (context.entity.isBaby()) {
                return context.poseStack.scale(0.5, 0.5, 0.5); // Scale down if the entity is a baby
            }
            return context.poseStack; // Otherwise, keep the default pose stack
        })
        .scaleModelForRender(context => {
            // Define logic to render the entity without changing core logic such as hitbox rendering
            const { entity, widthScale, heightScale, poseStack, model, isReRender, partialTick, packedLight, packedOverlay } = context
            if (entity.hurtTime > 0) {
                poseStack.scale(0.5, 0.5, 0.5)
            }
        })
        .jumpBoostPower(entity => {
            //Sets the jump boost power for the entity when they have the jump boost effect applied
            //Mimic vanilla logic with resistance instead of jump boost
            return entity.hasEffect("minecraft:resistance") ? (0.1 * (entity.getEffect("minecraft:resistance").getAmplifier() + 1)) : 0.0;
        })
        .setBlockJumpFactor(entity => {
            // Sets block jump factor returning a float value
            if (entity.age > 2000) {
                return 1.3; // Increase jump factor when the entity is old enough
            }
            return 1; // Default jump factor
        })
        .setMaxFallDistance(entity => {
            // Define custom logic to determine the maximum fall distance before taking damage
            // Use information about the LivingEntity provided by the context
            if (entity.isOnFire()) {
                return 1; // Reduced fall distance when entity is on fire
            }
            return 3; // Default fall distance
        })
        .myRidingOffset(entity => {
            // Use the provided context about the entity to determine the riding offset of the passengers
            if (!entity.isBaby()) {
                return 7; // Increased riding offset when the entity is not a baby
            }
            return 5; // Default riding offset
        })
        .animationResource(entity => {
            // Return different animation resources based on the entity's state
            // Use information about the LivingEntity provided by the context.
            if (entity.hurtTime > 0) {
                return // Return some animation path when entity is hurt
            } else {
                return "kubejs:animations/entity/wyrm.animation.json"; // Return Wyrm animation otherwise
            }
        })
        .blockSpeedFactor(entity => {
            // Define logic to calculate and return the block speed factor for the entity
            // Use information about the LivingEntity provided by the context.
            const age = entity.age;
            const maxAge = 5000; // Assuming the maximum age is 5000

            // Custom logic to calculate block speed factor based on entity's age
            const factor = age < maxAge ? 1.0 : 0.5; // Reduce speed factor for older entities
            return factor;
        })
        .calculateFallDamage(context => {
            // Define logic to calculate and return the fall damage for the entity
            // Use information about the CalculateFallDamageContext provided by the context.
            const fallHeight = context.fallHeight;
            const damageMultiplier = context.damageMultiplier;
            const entity = context.entity;

            // Custom logic to calculate fall damage based on fall height and multiplier
            const calculatedDamage = Math.floor(fallHeight * damageMultiplier);
            return calculatedDamage;
        })
        .canAddPassenger(context => {
            // Define custom logic to determine if a passenger can be added to the entity
            // Use information about the PassengerEntityContext provided by the context.
            // For example, check if the entity is not already carrying too many passengers.
            const maxPassengers = 4; // Assuming a maximum of 4 passengers
            return context.entity.getPassengers().size() < maxPassengers;
        })
        .isAlliedTo(context => {
            const { entity, target } = context
            return target.type == 'minecraft:blaze'
        })
        .canAttack(context => {
            // Define conditions to check if the entity can attack the targetEntity
            // Use information about the LivingEntity provided by the context.
            // For example, check if the targetEntity is not the same as the entity itself.
            return context.target.type !== context.entity.type;
        })
        .canAttackType(context => {
            // Define conditions to check if the entity can attack the specified entity type
            // Use information about the EntityTypeEntityContext provided by the context.
            // For example, check if the entity type of the target matches a specific type.
            const targetType = context.targetType.category.friendly;
            // Assuming we want the entity to attack only friendly mobs
            return targetType;
        })
        .canBeAffected(context => {
            // Define conditions to check if the entity can be affected by the effect
            // Use information about the OnEffectContext provided by the context.
            // For example, check if the entity is not already affected by a specific effect.
            const effect = context.effect;
            // Assuming we want the entity to be affected only if it doesn't have the same effect already
            return !context.entity.hasEffect(effect.getEffect());
        })
        .canChangeDimensions(entity => {
            // Define the conditions for the entity to be able to change dimensions
            // Use information about the LivingEntity provided by the context.
            // For example, allow dimension change only for entities with a specific tag.
            return entity.tags.contains("dimension_changer");
        })
        .canDisableShield(entity => {
            // Define the conditions to check if the entity can disable its shield
            // Use information about the LivingEntity provided by the context.
            return entity.mainHandItem.id == 'minecraft:diamond_sword'; // Disable shield if the entity is wielding a diamond sword.
        })
        .canFireProjectileWeaponPredicate(context => {
            // Custom logic to determine whether the entity can fire a projectile weapon
            // Access information about the entity and the projectile weapon using the provided context.
            return context.projectileWeapon.id == 'minecraft:bow';
        })
        .canFreeze(entity => {
            // Define conditions for the entity to be able to freeze
            // For example, allow freezing only if the entity is in water.
            return entity.inWater;
        })
        .canHoldItem(context => {
            // Custom logic to determine whether the entity can hold an item based on the provided context.
            // For example, allow holding an item only if the entity is not a baby.
            return !context.entity.isBaby();
        })
        .canBreed(entity => {
            // Custom logic to determine if the entity can breed
            // Use information about the LivingEntity provided by the context.
            // For example, check if the entity has reached maturity.
            const baby = entity.isBaby();
            // Assuming we want the entity to be able to breed only if it's an adult
            return baby;
        })
        .canMate(context => {
            // Custom logic to determine if the entity can mate
            // For example, allow mating only if both animals are in the same biome.
            let blockpos1 = context.animal.block.pos
            let blockpos2 = context.otherAnimal.block.pos
            return context.animal.getLevel().getBiome(blockpos1) === context.otherAnimal.getLevel().getBiome(blockpos2);
        })
        .canPickUpLoot(entity => {
            // Custom logic to determine whether the entity can pick up loot based on the provided mob.
            // Allow loot pickup during nighttime.

            return !entity.getLevel().isDay(); // Only allow loot pickup during nighttime
        })
        .canStandOnFluid(context => {
            // Define conditions for the entity to be able to stand on a fluid
            // Use information about the EntityFluidStateContext provided by the context.
            // Allow standing on water.
            let fluid = Fluid.of("minecraft:water").fluid.fluidType
            return context.fluidState.fluidType == fluid
        })
        .canTakeItem(context => {
            // Define conditions for the entity to be able to take an item
            // Use information about the EntityItemLevelContext provided by the context.
            // Allow taking items only if the living entity is not null and the item stack is not empty.
            return context.entity !== null && !context.itemStack.isEmpty();
        })
        .dampensVibrations(entity => {
            // Determine whether the living entity dampens vibrations
            // Return true if the entity dampens vibrations, false otherwise
            // For example, return true if the entity has no gravity.
            return entity.isNoGravity();
        })
        .experienceReward(killedEntity => {
            // Define logic to calculate and return the experience reward for the killedEntity
            // Use information about the LivingEntity provided by the context.
            // For example, return 5 times the armor cover percentage of the entity.
            const armorCoverPercentage = killedEntity.armorCoverPercentage + 1;
            return armorCoverPercentage * 5;
        })
        .hasLineOfSight(context => {
            // Check if the target entity is within the same level
            if (context.targetEntity.getLevel() !== context.entity.getLevel()) {
                return false;
            }
            // Get the positions of the entities
            // In 1.20.1+ this is Vec3d instead of Vec3
            const entityPos = new Vec3d(context.entity.getX(), context.entity.getEyeY(), context.entity.getZ());
            const targetPos = new Vec3d(context.targetEntity.getX(), context.targetEntity.getEyeY(), context.targetEntity.getZ());
            // Calculate the distance between the two entities
            const distance = entityPos.distanceTo(targetPos);
            // Check if the target entity is within a reasonable range
            if (distance > 128.0) {
                return false;
            }
            // Allow the entity to "see through" blocks by not implimenting ClipContext as done in LivingEntity Class.
            return true;
        })
        .setHurtSound(context => {
            // Custom logic to determine the hurt sound for the entity
            // You can use information from the HurtContext to customize the sound based on the context
            const { entity, damageSource } = context;
            // Determine the hurt sound based on the type of damage source
            switch (damageSource.getType()) {
                case "fire":
                    return "minecraft:entity.generic.burn";
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
        .invertedHealAndHarm(entity => {
            //Used by undead mobs to invert potion effects such as Instant Health & Instant Damage
            const blockAboveHasSky = entity.block.down.canSeeSky;
            return blockAboveHasSky; // Return true if the block below has sky visibility
        })
        .isAffectedByFluids(entity => {
            // Define logic to determine whether the entity is affected by fluids
            // For example, check if the entity is swimming or flying
            return entity.isSwimming() || entity.isFallFlying();
        })
        .isAffectedByPotions(entity => {
            // Define conditions to check if the entity is affected by potions
            // For example, check if the entity has any active potion effects
            return entity.getActiveEffects().size() > 0;
        })
        .isAttackable(entity => {
            // Define conditions to check if the entity is attackable
            // For example, check if the entity is not invulnerable
            return !entity.isInvulnerable();
        })
        .isCurrentlyGlowing(entity => {
            // Define the conditions to check if the entity is currently glowing
            // For example, check if the entity has a regeneration or glowing effect applied
            return entity.hasEffect("minecraft:regeneration") || entity.hasEffect("minecraft:glowing");
        })
        .isFlapping(entity => {
            // Mimics the Ender Dragon's Flapping Behavior
            // Define logic to determine whether the entity is currently flapping
            const flapTime = entity.flapTime; // Current flap time
            const oFlapTime = entity.oFlapTime; // Previous flap time

            // Calculate cosine values for the current and previous flap times
            const f = Math.cos(flapTime * 6.2831855);
            const f1 = Math.cos(oFlapTime * 6.2831855);

            // Check if the entity is flapping based on cosine values
            return f1 <= -0.3 && f >= -0.3;
        })
	.tamableFoodPredicate(context => {
	    const { entity, item } = context
	    return item.id == 'minecraft:carrot' // Return true if the player's current itemstack will tame the mob.
	})
        .isFoodPredicate(context => {
            // Custom logic to determine if the entity item stack is considered as food.
            // Access information about the item stack using the provided context.
            const itemStack = context.item; // Get the item stack from the context

            // Example condition: Check if the item stack is edible
            return itemStack.isEdible();
        })
        .isFreezing(entity => {
            // Define the conditions for the entity to start freezing
            // Use information about the LivingEntity provided by the context.
            // Start freezing the entity if they're in the taiga biome and can freeze.
            return entity.getLevel().getBiome(entity.block.pos) == 'minecraft:taiga' && entity.canFreeze();
        })
        .isImmobile(entity => {
            // Define logic to determine whether the entity is immobile
            // Use information about the LivingEntity provided by the context.
            return entity.isSleeping(); // Example: Entity is immobile if sleeping
        })
        .isInvulnerableTo(context => {
            // Define conditions for the entity to be invulnerable to the specific type of damage
            // Use information about the DamageContext provided by the context.

            // Example condition: Entity is invulnerable to magic damage
            return context.damageSource.getType() == 'magic';
        })
        .isSensitiveToWater(entity => {
            // Define conditions to check if the entity is in a "Cold Ocean" biome and sensitive to water
            // Use information about the LivingEntity provided by the context.

            // Example condition: Check if the biome ID corresponds to a "Cold Ocean" biome
            return entity.getLevel().getBiome(entity.block.pos).is('minecraft:cold_ocean')
        })
        .isSleeping(entity => {
            // Check if the entity has a sleeping position
            // Use information about the LivingEntity provided by the context.
            //Mimics how vanilla does the isSleeping() method.
            return entity.getSleepingPos().isPresent();
        })
        .mayInteract(context => {
            // Define conditions for the entity to be allowed to interact with the world
            // Use information about the MayInteractContext provided by the context.
            return context.entity.getTags().contains('canInteractWithWorld')
        })
        .meleeAttackRangeSqr(entity => {
            // Define custom logic to calculate the squared melee attack range based on the provided entity.
            // For example, you can calculate based on the size or type of the entity.
            const size = entity.boundingBox.size;
            const range = size * size; // Adjust this calculation based on your requirements
            return range;
        })
        .nextStep(entity => {
            // Define custom logic to calculate the next step distance based on the provided entity.
            const movementSpeed = entity.getTotalMovementSpeed(); // Get the entity's movement speed
            //If the entity is not an animal return default vanilla behavior
            if (!entity.animal) return entity.moveDist + 1;
            const behaviorFactor = entity.isAggressive() ? 1.5 : 1; // Adjust the step distance based on behavior
            // Calculate the next step distance based on movement speed, size, and behavior
            const nextStepDistance = movementSpeed * behaviorFactor;
            return nextStepDistance;
        })
        .onClimbable(entity => {
            const blockBelow = entity.block.down; // Get the block below the entity
            // Check if the block below the entity is climbable (e.g., a ladder, vine, or scaffold)
            const isClimbableBlock = blockBelow.hasTag('minecraft:my_climbeable_block_tag');

            // Check if the entity is currently moving upwards (which might indicate climbing)
            const isMovingUpwards = entity.motionY > 0;

            // Return true if the entity is on a climbable surface and moving upwards
            return isClimbableBlock && isMovingUpwards;
        })
        .removeWhenFarAway(context => {
            // Get information from the context
            const { distanceToClosestPlayer } = context;
            // Return true if the entity is far away from the closest player and should be removed
            //Fine tune removal logic
            return distanceToClosestPlayer > 64;
        })
        .scale(entity => {
            // Define logic to calculate the custom scale for the entity
            // For example, you can scale the entity based on its size or other properties
            return entity.isBaby() ? 0.5 : 1;
        })
        .setStandingEyeHeight(context => {
            // Define logic to calculate and return the standing eye height for the entity
            // Use information about the EntityPoseDimensionsContext provided by the context
            const entity = context.entity; // Get the entity from the context
            const pose = context.pose; // Get the entity pose from the context

            // Define default standing eye height
            let standingEyeHeight = 1.8; // Default human-like standing eye height

            // Adjust standing eye height based on entity pose if needed
            if (pose === 'crouching') {
                standingEyeHeight = 1.5; // Adjust standing eye height for crouching pose
            }

            // Return the calculated standing eye height
            return standingEyeHeight;
        })
        .shouldDropExperience(entity => {
            // Define conditions to check if the entity should drop experience upon death
            // Use information about the LivingEntity provided by the context.
            return entity.block.down.id == 'minecraft:grass_block'// Only drop experience if the entity dies on grass
        })
        .shouldDropLoot(entity => {
            // Define logic to determine whether the entity should drop loot
            // Use information about the LivingEntity provided by the context.
            return !entity.isBaby(); //Only drop loot if they're an adult
        })
        .showVehicleHealth(entity => {
            // Determine whether to show the vehicle health for the living entity
            // Return true to show the vehicle health, false otherwise
            return !entity.isFallFlying(); //Only show vehicle's health to the player if the vehicle is fall flying
        })
        .visibilityPercent(context => {
            // Define logic to calculate and return the visibility percentage for the targetEntity
            // Use information about the Entity provided by the context.
            // Our mob is less 'seen' by other mobs in the plains biome by 20%.
            return context.lookingEntity.age > 0 ? 0.8 : 1
        })
        .walkTargetValue(context => {
            const { levelReader, pos } = context; // Destructure context for easier access

            // Get the block state below the given position
            const blockBelow = levelReader.getBlockState(pos.below());

            // Adjust walk target value based on the block below, is usually Grass Block in Vanilla
            return blockBelow.is(Blocks.AZALEA_LEAVES) ? 10 : levelReader.getPathfindingCostFromLightLevels(pos);
        })
        .canCollideWith(context => {
            return true //Some Boolean value determining whether the entity may collid with another
        })

        /**
         * All methods below return void meaning they don't require a set return value to function.
         * These mostly are similar to KubeJS' normal events where you may do things on certain events your entities call!
         */

        .tickLeash(context => {
            const { player, entity } = context
            if (player != undefined && player.isDiscrete()) {
                // Give the player a diamond
                player.give(Item.of('minecraft:diamond'));
                // Print a message indicating the diamond was given
                console.log(`Gave ${player.getName()} a diamond for sneaking while leashing ${entity.type}.`);
            }
        })
        .tick(entity => {
            if (entity.age % 100 != 0) return
            console.log('ticked every 100 ticks')
        })
        .lavaHurt(entity => {
            // Heal the entity by 20 health points
            entity.heal(20);
        })
        .doAutoAttackOnTouch(context => {
            // Attack the target entity with a damage value of 1
            context.target.attack(1);
        })
        .ate(entity => {
            // Log a message when the entity eats something
            console.log(`${entity.type} just ate!`)
        })
        .dropCustomDeathLoot(context => {
            // Drop custom loot (iron ingot) when the entity dies with a looting multiplier of 2
            if (context.lootingMultiplier == 2) context.entity.block.popItemFromFace('minecraft:iron_ingot', 'up')
        })
        .eat(context => {
            // Heal the entity when it eats something
            context.entity.heal(20)
        })
        .lerpTo(context => {
            const { x, y, z, yaw, pitch, entity, delta } = context;
            // Set the entity's position directly to the target position if the entity is freezing
            if (entity.isFreezing()) entity.setPosition(x, y, z);
        })
        .onAddedToWorld(entity => {
            // Teleport the entity slightly above its current position when added to the world
            let namespace = entity.getLevel().dimension.namespace
            let path = entity.getLevel().dimension.path
            entity.teleportTo(`${namespace}:${path}`, entity.x, entity.y + 1, entity.z, 1, 1)
        })
        .onBlockedByShield(context => {
            const {entity, target} = context
            // Log a message when the target is blocked by a shield
            console.log(`${target} Get blocked!`)
        })
        .onClientRemoval(entity => {
            // Log a message when the entity is removed on the client side
            console.log(`${entity} was removed on the client`)
        })
        .onDeath(context => {
            // Place a diamond ore block below the entity when it dies
            context.entity.block.down.set('minecraft:diamond_ore')
        })
        .onDecreaseAirSupply(entity => {
            if (entity.age % 20 != 0) return
            // Log the entity's remaining air supply when it decreases
            console.log(entity.airSupply)
        })
        .onEffectAdded(context => {
            // Log the description ID of an added effect
            console.log(context.effect.descriptionId)
        })
        .onEffectRemoved(context => {
            // Log the description ID of a removed effect
            console.log(context.effect.descriptionId)
        })
        .onEnterCombat(entity => {
            // Log a message when the entity enters combat
            console.log(`${entity} just entered combat`)
        })
        .onEquipItem(context => {
            // Log the ID of the item being equipped by the entity
            if (context.entity.age % 100 != 0) return
            console.log(context.currentStack.id)
        })
        .onFlap(entity => {
            // Place a gold ore block below the entity when it flaps
            entity.block.down.set('minecraft:gold_ore')
        })
        .onHurt(context => {
            // Log the amount of damage received by the entity
            console.log(context.damageAmount)
        })
        .onIncreaseAirSupply(entity => {
            if (entity.age % 20 != 0) return
            // Log a message when the entity's air supply increases
            console.log(`${entity} increasing air`)
        })
        .onItemPickup(context => {
            // Log the ID of the item picked up by the entity
            console.log(context.itemEntity.id)
        })
        .onLeaveCombat(entity => {
            // Log a message when the entity leaves combat
            console.log(`${entity} just left combat!`)
        })
        .onLivingFall(context => {
            // Log a message when the entity falls
            console.log(`${context.entity} just fell ${context.distance} blocks!`)
        })
        .onLivingHeal(context => {
            // Log a message when the entity heals
            console.log(`${context.entity} just gained ${context.healAmount} health!`)
        })
        .onLivingJump(entity => {
            // Log a message when the entity jumps
            console.log(`${entity} just jumped!`)
        })
        .onRemovedFromWorld(entity => {
            // Log a message when the entity is removed from the world
            console.log(`${entity} was just removed from the world!`)
        })
        .onSpawnChildFromBreeding(context => {
            // Log a message when the entity breeds with another entity
            console.log(`${context.entity} mated with ${context.mate}! *blush*`)
        })
        .onSprint(entity => {
            // Log a message when the entity starts sprinting
            console.log(`${entity} is sprinting!`)
        })
        .onStartSleeping(context => {
            // Log a message when the entity starts sleeping at a specific position
            console.log(`Sleeping at ${context.blockPos}`)
        })
	.onStopRiding(entity => {
	    // Drop a diamond above the entity when it stops riding
	    if (!entity.isPassenger()) return
	    entity.block.popItemFromFace('minecraft:diamond', 'up')
	})
        .onStopSleeping(entity => {
            // Log a message when the entity stops sleeping
            console.log(`Stopped sleeping at ${entity.pos}`)
        })
        .onTargetChanged(context => {
            //Only firing every 100 ticks to reduce log spam.
            if (context.entity.age % 100 != 0) return
            // Log a message when the entity's target changes
            if (context.target == null) return
            console.log(`${context.target} is being targeted!`)
        })
        .playerTouch(context => {
            // Attack the player when touched by the entity
            context.player.attack(1)
        })
        .rideTick(entity => {
            // Log a message every 100 ticks if the entity is a vehicle
            if (entity.age % 100 != 0) return
            console.log(entity.isVehicle())
        })
        .thunderHit(context => {
            // Heal the entity when struck by lightning
            context.entity.heal(15)
        })
        .onTamed(entity => {
	    // Do stuff when the entity is tamed.
	    })
	.tameOverride(context => {
	    const { entity, player } = context
	    // Mimic the vanilla way of setting the uuid when the entity is tamed.
	    entity.setOwnerUUID(player.getUUID());
	})
	//Default vanilla implimentation of tickDeath removes the entity from the world after 20 ticks
	/*.tickDeath(entity => {
	    // Override the tickDeath method in the entity
	})*/
        .onInteract(context => global.interact(context))
})

/**
 *
 * @param {Internal.ContextUtils$MobInteractContext} context
 * @returns
 */
global.interact = context => {
    if (context.player.isShiftKeyDown()) return
    context.player.startRiding(context.entity);
}
```

</details>

<details>
<summary>Full Animal Entity Example Usage 1.21</summary>

```javascript
StartupEvents.registry('entity_type', event => {
	event.create('sasuke', "entityjs:tamable")
		/**
		 * One-Off values set at the startup of the game.
		 */
		.immuneTo("minecraft:stone", "minecraft:dirt")
		.canSpawnFarFromPlayer(true)
		.clientTrackingRange(20)
		.mobCategory('monster')
		.setRenderType("solid")
		.sized(1, 1)
		.modelSize(2, 3)
		.updateInterval(3)
		.defaultDeathPose(true)
		.repositionEntityAfterLoad(true)
		.isPersistenceRequired(true)
		.isAlwaysExperienceDropper(true)
		.setDeathSound("minecraft:entity.generic.death")
		.canJump(true)
		.ambientSoundInterval(100)
		.isPushable(true)
		.canBreatheUnderwater(true)
		.eatingSound("minecraft:entity.zombie.ambient")
		.fallSounds("minecraft:entity.generic.small_fall", "minecraft:entity.generic.large_fall")
		.fireImmune(false)
		.followLeashSpeed(1.5)
		.setAmbientSound("minecraft:entity.zombie.ambient")
		.mainArm("left")
		.saves(true)
		.setSoundVolume(0.5)
		.setSummonable(true)
		.setSwimSound("minecraft:entity.generic.swim")
		.setSwimSplashSound("minecraft:entity.generic.splash")
		.setWaterSlowDown(0.6)
		.shouldDespawnInPeaceful(true)
		.mountJumpingEnabled(true)
		.tamableFood([
			'minecraft:diamond',
			Ingredient.of("minecraft:bedrock")
		])
		.isFood([
			'minecraft:diamond',
			Ingredient.of("minecraft:apple")
		])
		// .noEggItem() // Disables automatic egg item creation
		//Customize egg item
		.eggItem(item => {
			item.backgroundColor(0);
			item.highlightColor(0);
		})
		.canFireProjectileWeapon([
			'minecraft:bow',
			'minecraft:crossbow'
		])
		.newGeoLayer(builder => {
			// New render layers like what the exploding Creeper or the Wither has
			/*builder.textureResource(entity => {
				return "kubejs:textures/entity/sasuke.png"
			})*/
		})
		/**
		 * These methods below require a set return value, if the value does not match the required result
		 * it will automatically default to the super method in the entity builder and output an error in logs>kubejs>startup.log.
		 *
		 * Remember all callback functions are also able to be live-edited with global events!
		 *
		 * Example:
		 * global.interact = context => {
		 *  if (context.player.isShiftKeyDown()) return
		 *      context.player.startRiding(context.entity);
		 * }
		 *
		 * .onInteract(context => global.interact(context)) // Reload this with /kubejs reload startup_scripts
		 */

		.addAnimationController('exampleController', 1, event => {
			if (event.entity.hurtTime > 0) {
				event.thenPlayAndHold('spawn');
			} else {
				event.thenLoop('idle');
			}
			return true;
		})
		.setBreedOffspring(context => {
			const { entity, mate, level } = context
			// Use the context to return a ResourceLocation of an entity to spawn when the entity mates
			return 'minecraft:cow' //Some Resourcelocation representing the entity to spawn.
		})
		.addPartEntity("head", 1, 1, builder => {
			// Adds an additional hitbox to the entity with builder support
			builder
				.isPickable(true)
				.onPartHurt(context => {
					const { entity, part, source, amount } = context
					// Custom logic for determining how the parts of the entity should relay damage
					// To the entity. For example, relay double the damage to the entity when this hitbox is hit
					entity.attack(source, amount * 2)
					console.log("source: " + source + " amount: " + amount + " part name: " + part.name)
				})
		})
		.aiStep(entity => {
			// Custom logic to be executed during the living entity's AI step
			// Access information about the entity
			// Tick the previously registered part entity/hitbox to be 1 square y-offset to the entity
			entity.tickPart("head", 0, 1, 0)
		})
		.setLookControl(entity => {
			return EntityJSUtils.createLookControl(entity, lookControlBuilder => { })
		})
		.setMoveControl(entity => {
			return EntityJSUtils.createMoveControl(entity, moveControlBuilder => { })
		})
		.setJumpControl(entity => {
			return EntityJSUtils.createJumpControl(entity, jumpControlBuilder => { })
		})
		.createNavigation(context => {
			const { entity, level } = context
			// Use the new EntityJSUtils binding to create different path navigations
			// Returning WallClimberNavigation here will allow the entity to path-find up walls like spiders
			return EntityJSUtils.createWallClimberNavigation(entity, level) // Return some path navigation
		})
		.render(context => {
			// Define core logic to render the entity (recommended to use .scaleModelForRender instead)
			if (context.entity.isBaby()) {
				return context.poseStack.scale(0.5, 0.5, 0.5); // Scale down if the entity is a baby
			}
			return context.poseStack; // Otherwise, keep the default pose stack
		})
		.scaleModelForRender(context => {
			// Define logic to render the entity without changing core logic such as hitbox rendering
			const { entity, widthScale, heightScale, poseStack, model, isReRender, partialTick, packedLight, packedOverlay } = context
			if (entity.hurtTime > 0) {
				poseStack.scale(0.5, 0.5, 0.5)
			}
		})
		.getAttackBoundingBox(entity => {
			// Custom logic to calculate the squared melee attack range based on the provided mob.
			return entity;
		})
		.jumpBoostPower(entity => {
			//Sets the jump boost power for the entity when they have the jump boost effect applied
			//Mimic vanilla logic with resistance instead of jump boost
			return entity.hasEffect("minecraft:resistance") ? (0.1 * (entity.getEffect("minecraft:resistance").getAmplifier() + 1)) : 0.0;
		})
		.setBlockJumpFactor(entity => {
			// Sets block jump factor returning a float value
			if (entity.age > 2000) {
				return 1.3; // Increase jump factor when the entity is old enough
			}
			return 1; // Default jump factor
		})
		.setMaxFallDistance(entity => {
			// Define custom logic to determine the maximum fall distance before taking damage
			// Use information about the LivingEntity provided by the context
			if (entity.isOnFire()) {
				return 1; // Reduced fall distance when entity is on fire
			}
			return 3; // Default fall distance
		})
		.animationResource(entity => {
			// Return different animation resources based on the entity's state
			// Use information about the LivingEntity provided by the context.
			if (entity.hurtTime > 0) {
				return // Return some animation path when entity is hurt
			} else {
				return "kubejs:animations/entity/wyrm.animation.json"; // Return Wyrm animation otherwise
			}
		})
		.blockSpeedFactor(entity => {
			// Define logic to calculate and return the block speed factor for the entity
			// Use information about the LivingEntity provided by the context.
			const age = entity.age;
			const maxAge = 5000; // Assuming the maximum age is 5000

			// Custom logic to calculate block speed factor based on entity's age
			const factor = age < maxAge ? 1.0 : 0.5; // Reduce speed factor for older entities
			return factor;
		})
		.calculateFallDamage(context => {
			// Define logic to calculate and return the fall damage for the entity
			// Use information about the CalculateFallDamageContext provided by the context.
			const fallHeight = context.fallHeight;
			const damageMultiplier = context.damageMultiplier;
			const entity = context.entity;

			// Custom logic to calculate fall damage based on fall height and multiplier
			const calculatedDamage = Math.floor(fallHeight * damageMultiplier);
			return calculatedDamage;
		})
		.canAddPassenger(context => {
			// Define custom logic to determine if a passenger can be added to the entity
			// Use information about the PassengerEntityContext provided by the context.
			// For example, check if the entity is not already carrying too many passengers.
			const maxPassengers = 4; // Assuming a maximum of 4 passengers
			return context.entity.getPassengers().size() < maxPassengers;
		})
		.isAlliedTo(context => {
			const { entity, target } = context
			return target.type == 'minecraft:blaze'
		})
		.canAttack(context => {
			// Define conditions to check if the entity can attack the targetEntity
			// Use information about the LivingEntity provided by the context.
			// For example, check if the targetEntity is not the same as the entity itself.
			return context.target.type !== context.entity.type;
		})
		.canAttackType(context => {
			// Define conditions to check if the entity can attack the specified entity type
			// Use information about the EntityTypeEntityContext provided by the context.
			// For example, check if the entity type of the target matches a specific type.
			const targetType = context.targetType.category.friendly;
			// Assuming we want the entity to attack only friendly mobs
			return targetType;
		})
		.canBeAffected(context => {
			// Define conditions to check if the entity can be affected by the effect
			// Use information about the OnEffectContext provided by the context.
			// For example, check if the entity is not already affected by a specific effect.
			const effect = context.effect;
			// Assuming we want the entity to be affected only if it doesn't have the same effect already
			return !context.entity.hasEffect(effect.getEffect());
		})
		.canChangeDimensions(entity => {
			// Define the conditions for the entity to be able to change dimensions
			// Use information about the LivingEntity provided by the context.
			// For example, allow dimension change only for entities with a specific tag.
			return entity.tags.contains("dimension_changer");
		})
		.canDisableShield(entity => {
			// Define the conditions to check if the entity can disable its shield
			// Use information about the LivingEntity provided by the context.
			return entity.mainHandItem.id == 'minecraft:diamond_sword'; // Disable shield if the entity is wielding a diamond sword.
		})
		.canFireProjectileWeaponPredicate(context => {
			// Custom logic to determine whether the entity can fire a projectile weapon
			// Access information about the entity and the projectile weapon using the provided context.
			return context.projectileWeapon.id == 'minecraft:bow';
		})
		.canFreeze(entity => {
			// Define conditions for the entity to be able to freeze
			// For example, allow freezing only if the entity is in water.
			return entity.inWater;
		})
		.canHoldItem(context => {
			// Custom logic to determine whether the entity can hold an item based on the provided context.
			// For example, allow holding an item only if the entity is not a baby.
			return !context.entity.isBaby();
		})
		.canBreed(entity => {
			// Custom logic to determine if the entity can breed
			// Use information about the LivingEntity provided by the context.
			// For example, check if the entity has reached maturity.
			const baby = entity.isBaby();
			// Assuming we want the entity to be able to breed only if it's an adult
			return baby;
		})
		.canMate(context => {
			// Custom logic to determine if the entity can mate
			// For example, allow mating only if both animals are in the same biome.
			let blockpos1 = context.animal.block.pos
			let blockpos2 = context.otherAnimal.block.pos
			return context.animal.getLevel().getBiome(blockpos1) === context.otherAnimal.getLevel().getBiome(blockpos2);
		})
		.canPickUpLoot(entity => {
			// Custom logic to determine whether the entity can pick up loot based on the provided mob.
			// Allow loot pickup during nighttime.

			return !entity.getLevel().isDay(); // Only allow loot pickup during nighttime
		})
		.canStandOnFluid(context => {
			// Define conditions for the entity to be able to stand on a fluid
			// Use information about the EntityFluidStateContext provided by the context.
			// Allow standing on water.
			let fluid = Fluid.of("minecraft:water").fluid.fluidType
			return context.fluidState.fluidType == fluid
		})
		.canTakeItem(context => {
			// Define conditions for the entity to be able to take an item
			// Use information about the EntityItemLevelContext provided by the context.
			// Allow taking items only if the living entity is not null and the item stack is not empty.
			return context.entity !== null && !context.itemStack.isEmpty();
		})
		.dampensVibrations(entity => {
			// Determine whether the living entity dampens vibrations
			// Return true if the entity dampens vibrations, false otherwise
			// For example, return true if the entity has no gravity.
			return entity.isNoGravity();
		})
		.experienceReward(killedEntity => {
			// Define logic to calculate and return the experience reward for the killedEntity
			// Use information about the LivingEntity provided by the context.
			// For example, return 5 times the armor cover percentage of the entity.
			const armorCoverPercentage = killedEntity.armorCoverPercentage + 1;
			return armorCoverPercentage * 5;
		})
		.hasLineOfSight(context => {
			// Check if the target entity is within the same level
			if (context.targetEntity.getLevel() !== context.entity.getLevel()) {
				return false;
			}
			// Get the positions of the entities
			// In 1.20.1+ this is Vec3d instead of Vec3
			const entityPos = new Vec3d(context.entity.getX(), context.entity.getEyeY(), context.entity.getZ());
			const targetPos = new Vec3d(context.targetEntity.getX(), context.targetEntity.getEyeY(), context.targetEntity.getZ());
			// Calculate the distance between the two entities
			const distance = entityPos.distanceTo(targetPos);
			// Check if the target entity is within a reasonable range
			if (distance > 128.0) {
				return false;
			}
			// Allow the entity to "see through" blocks by not implimenting ClipContext as done in LivingEntity Class.
			return true;
		})
		.setHurtSound(context => {
			// Custom logic to determine the hurt sound for the entity
			// You can use information from the HurtContext to customize the sound based on the context
			const { entity, damageSource } = context;
			// Determine the hurt sound based on the type of damage source
			switch (damageSource.getType()) {
				case "fire":
					return "minecraft:entity.generic.burn";
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
		.invertedHealAndHarm(entity => {
			//Used by undead mobs to invert potion effects such as Instant Health & Instant Damage
			const blockAboveHasSky = entity.block.down.canSeeSky;
			return blockAboveHasSky; // Return true if the block below has sky visibility
		})
		.isAffectedByFluids(entity => {
			// Define logic to determine whether the entity is affected by fluids
			// For example, check if the entity is swimming or flying
			return entity.isSwimming() || entity.isFallFlying();
		})
		.isAffectedByPotions(entity => {
			// Define conditions to check if the entity is affected by potions
			// For example, check if the entity has any active potion effects
			return entity.getActiveEffects().size() > 0;
		})
		.isAttackable(entity => {
			// Define conditions to check if the entity is attackable
			// For example, check if the entity is not invulnerable
			return !entity.isInvulnerable();
		})
		.isCurrentlyGlowing(entity => {
			// Define the conditions to check if the entity is currently glowing
			// For example, check if the entity has a regeneration or glowing effect applied
			return entity.hasEffect("minecraft:regeneration") || entity.hasEffect("minecraft:glowing");
		})
		.isFlapping(entity => {
			// Mimics the Ender Dragon's Flapping Behavior
			// Define logic to determine whether the entity is currently flapping
			const flapTime = entity.flapTime; // Current flap time
			const oFlapTime = entity.oFlapTime; // Previous flap time

			// Calculate cosine values for the current and previous flap times
			const f = Math.cos(flapTime * 6.2831855);
			const f1 = Math.cos(oFlapTime * 6.2831855);

			// Check if the entity is flapping based on cosine values
			return f1 <= -0.3 && f >= -0.3;
		})
		.tamableFoodPredicate(context => {
			const { entity, item } = context
			return item.id == 'minecraft:carrot' // Return true if the player's current itemstack will tame the mob.
		})
		.isFoodPredicate(context => {
			// Custom logic to determine if the entity item stack is considered as food.
			// Access information about the item stack using the provided context.
			const itemStack = context.item; // Get the item stack from the context

			// Example condition: Check if the item stack is edible
			return itemStack.isEdible();
		})
		.isFreezing(entity => {
			// Define the conditions for the entity to start freezing
			// Use information about the LivingEntity provided by the context.
			// Start freezing the entity if they're in the taiga biome and can freeze.
			return entity.getLevel().getBiome(entity.block.pos) == 'minecraft:taiga' && entity.canFreeze();
		})
		.isImmobile(entity => {
			// Define logic to determine whether the entity is immobile
			// Use information about the LivingEntity provided by the context.
			return entity.isSleeping(); // Example: Entity is immobile if sleeping
		})
		.isInvulnerableTo(context => {
			// Define conditions for the entity to be invulnerable to the specific type of damage
			// Use information about the DamageContext provided by the context.

			// Example condition: Entity is invulnerable to magic damage
			return context.damageSource.getType() == 'magic';
		})
		.isSensitiveToWater(entity => {
			// Define conditions to check if the entity is in a "Cold Ocean" biome and sensitive to water
			// Use information about the LivingEntity provided by the context.

			// Example condition: Check if the biome ID corresponds to a "Cold Ocean" biome
			return entity.getLevel().getBiome(entity.block.pos).is('minecraft:cold_ocean')
		})
		.isSleeping(entity => {
			// Check if the entity has a sleeping position
			// Use information about the LivingEntity provided by the context.
			//Mimics how vanilla does the isSleeping() method.
			return entity.getSleepingPos().isPresent();
		})
		.mayInteract(context => {
			// Define conditions for the entity to be allowed to interact with the world
			// Use information about the MayInteractContext provided by the context.
			return context.entity.getTags().contains('canInteractWithWorld')
		})
		.nextStep(entity => {
			// Define custom logic to calculate the next step distance based on the provided entity.
			const movementSpeed = entity.getTotalMovementSpeed(); // Get the entity's movement speed
			//If the entity is not an animal return default vanilla behavior
			if (!entity.animal) return entity.moveDist + 1;
			const behaviorFactor = entity.isAggressive() ? 1.5 : 1; // Adjust the step distance based on behavior
			// Calculate the next step distance based on movement speed, size, and behavior
			const nextStepDistance = movementSpeed * behaviorFactor;
			return nextStepDistance;
		})
		.onClimbable(entity => {
			const blockBelow = entity.block.down; // Get the block below the entity
			// Check if the block below the entity is climbable (e.g., a ladder, vine, or scaffold)
			const isClimbableBlock = blockBelow.hasTag('minecraft:my_climbeable_block_tag');

			// Check if the entity is currently moving upwards (which might indicate climbing)
			const isMovingUpwards = entity.motionY > 0;

			// Return true if the entity is on a climbable surface and moving upwards
			return isClimbableBlock && isMovingUpwards;
		})
		.removeWhenFarAway(context => {
			// Get information from the context
			const { distanceToClosestPlayer } = context;
			// Return true if the entity is far away from the closest player and should be removed
			//Fine tune removal logic
			return distanceToClosestPlayer > 64;
		})
		.scale(entity => {
			// Define logic to calculate the custom scale for the entity
			// For example, you can scale the entity based on its size or other properties
			return entity.isBaby() ? 0.5 : 1;
		})
		.shouldDropExperience(entity => {
			// Define conditions to check if the entity should drop experience upon death
			// Use information about the LivingEntity provided by the context.
			return entity.block.down.id == 'minecraft:grass_block'// Only drop experience if the entity dies on grass
		})
		.shouldDropLoot(entity => {
			// Define logic to determine whether the entity should drop loot
			// Use information about the LivingEntity provided by the context.
			return !entity.isBaby(); //Only drop loot if they're an adult
		})
		.showVehicleHealth(entity => {
			// Determine whether to show the vehicle health for the living entity
			// Return true to show the vehicle health, false otherwise
			return !entity.isFallFlying(); //Only show vehicle's health to the player if the vehicle is fall flying
		})
		.visibilityPercent(context => {
			// Define logic to calculate and return the visibility percentage for the targetEntity
			// Use information about the Entity provided by the context.
			// Our mob is less 'seen' by other mobs in the plains biome by 20%.
			return context.lookingEntity.age > 0 ? 0.8 : 1
		})
		.walkTargetValue(context => {
			const { levelReader, pos } = context; // Destructure context for easier access

			// Get the block state below the given position
			const blockBelow = levelReader.getBlockState(pos.below());

			// Adjust walk target value based on the block below, is usually Grass Block in Vanilla
			return blockBelow.is(Blocks.AZALEA_LEAVES) ? 10 : levelReader.getPathfindingCostFromLightLevels(pos);
		})
		.canCollideWith(context => {
			return true //Some Boolean value determining whether the entity may collid with another
		})

		/**
		 * All methods below return void meaning they don't require a set return value to function.
		 * These mostly are similar to KubeJS' normal events where you may do things on certain events your entities call!
		 */
		.tick(entity => {
			if (entity.age % 100 != 0) return
		})
		.lavaHurt(entity => {
			// Heal the entity by 20 health points
			entity.heal(20);
		})
		.doAutoAttackOnTouch(context => {
			// Attack the target entity with a damage value of 1
			context.target.attack(1);
		})
		.ate(entity => {
			// Log a message when the entity eats something
			console.log(`${entity.type} just ate!`)
		})
		.dropCustomDeathLoot(context => {
			const { damageSource, serverLevel, hitByPlayer, entity } = context
			if (hitByPlayer) context.entity.block.popItemFromFace('minecraft:iron_ingot', 'up')
		})
		.eat(context => {
			// Heal the entity when it eats something
			context.entity.heal(20)
		})
		.lerpTo(context => {
			const { x, y, z, yaw, pitch, entity, delta } = context;
			// Set the entity's position directly to the target position if the entity is freezing
			if (entity.isFreezing()) entity.setPosition(x, y, z);
		})
		.onAddedToWorld(entity => {
			// Teleport the entity slightly above its current position when added to the world
			let namespace = entity.getLevel().dimension.namespace
			let path = entity.getLevel().dimension.path
			entity.teleportTo(`${namespace}:${path}`, entity.x, entity.y + 1, entity.z, 1, 1)
		})
		.onBlockedByShield(context => {
			const { entity, target } = context
			// Log a message when the target is blocked by a shield
			console.log(`${target} Get blocked!`)
		})
		.onClientRemoval(entity => {
			// Log a message when the entity is removed on the client side
			console.log(`${entity} was removed on the client`)
		})
		.onDeath(context => {
			// Place a diamond ore block below the entity when it dies
			context.entity.block.down.set('minecraft:diamond_ore')
		})
		.onDecreaseAirSupply(entity => {
			if (entity.age % 20 != 0) return
			// Log the entity's remaining air supply when it decreases
		})
		.onEffectAdded(context => {
			// Log the description ID of an added effect
			console.log(context.effect.descriptionId)
		})
		.onEffectRemoved(context => {
			// Log the description ID of a removed effect
			console.log(context.effect.descriptionId)
		})
		.onEnterCombat(entity => {
			// Log a message when the entity enters combat
			console.log(`${entity} just entered combat`)
		})
		.onEquipItem(context => {
			// Log the ID of the item being equipped by the entity
			if (context.entity.age % 100 != 0) return
			console.log(context.currentStack.id)
		})
		.onFlap(entity => {
			// Place a gold ore block below the entity when it flaps
			entity.block.down.set('minecraft:gold_ore')
		})
		.onHurt(context => {
			// Log the amount of damage received by the entity
			console.log(context.damageAmount)
		})
		.onIncreaseAirSupply(entity => {
		})
		.onItemPickup(context => {
			// Log the ID of the item picked up by the entity
			console.log(context.itemEntity.id)
		})
		.onLeaveCombat(entity => {
			// Log a message when the entity leaves combat
			console.log(`${entity} just left combat!`)
		})
		.onLivingFall(context => {
			// Log a message when the entity falls
			console.log(`${context.entity} just fell ${context.distance} blocks!`)
		})
		.onLivingHeal(context => {
			// Log a message when the entity heals
			console.log(`${context.entity} just gained ${context.healAmount} health!`)
		})
		.onLivingJump(entity => {
			// Log a message when the entity jumps
			console.log(`${entity} just jumped!`)
		})
		.onRemovedFromWorld(entity => {
			// Log a message when the entity is removed from the world
			console.log(`${entity} was just removed from the world!`)
		})
		.onSpawnChildFromBreeding(context => {
			// Log a message when the entity breeds with another entity
			console.log(`${context.entity} mated with ${context.mate}! *blush*`)
		})
		.onSprint(entity => {
			// Log a message when the entity starts sprinting
			console.log(`${entity} is sprinting!`)
		})
		.onStartSleeping(context => {
			// Log a message when the entity starts sleeping at a specific position
			console.log(`Sleeping at ${context.blockPos}`)
		})
		.onStopRiding(entity => {
			// Drop a diamond above the entity when it stops riding
			if (!entity.isPassenger()) return
			entity.block.popItemFromFace('minecraft:diamond', 'up')
		})
		.onRemovePassenger(entity => {
			// Drop a diamond above the entity when the passenger dismounts it
        		entity.block.popItemFromFace('minecraft:diamond', 'up')
        	})
		.onStopSleeping(entity => {
			// Log a message when the entity stops sleeping
			console.log(`Stopped sleeping at ${entity.pos}`)
		})
		.onTargetChanged(context => {
			//Only firing every 100 ticks to reduce log spam.
			if (context.entity.age % 100 != 0) return
			// Log a message when the entity's target changes
			if (context.target == null) return
			console.log(`${context.target} is being targeted!`)
		})
		.playerTouch(context => {
			// Attack the player when touched by the entity
			context.player.attack(1)
		})
		.rideTick(entity => {
			// Log a message every 100 ticks if the entity is a vehicle
			if (entity.age % 100 != 0) return
			console.log(entity.isVehicle())
		})
		.thunderHit(context => {
			// Heal the entity when struck by lightning
			context.entity.heal(15)
		})
		.onTamed(entity => {
			// Do stuff when the entity is tamed.
		})
		.tameOverride(context => {
			const { entity, player } = context
			// Mimic the vanilla way of setting the uuid when the entity is tamed.
			entity.setOwnerUUID(player.getUUID());
		})
		//Default vanilla implimentation of tickDeath removes the entity from the world after 20 ticks
		/*.tickDeath(entity => {
			// Override the tickDeath method in the entity
		})*/
		.onInteract(context => global.interact(context))
})

/**
 *
 * @param {Internal.ContextUtils$MobInteractContext} context
 * @returns
 */
global.interact = context => {
	if (context.player.isShiftKeyDown()) return
	context.player.startRiding(context.entity);
}
```
</details>


---

# **Exclusive Methods** 🔒

> **Note:** Some methods are exclusive to certain builders and are not shared across all of them. Below is a list of methods that are exclusive to different types of builders.

---

## Methods Exclusive to Forge 🛠️

- `shouldStayCloseToLeashHolder`
- `shouldRiderFaceForward`
- `canTrample`
- `biomeSpawn`
- `spawnPlacement`

---

## Methods Exclusive to the Animal Builder 🐾

- `.setBreedOffspring`
- `.isFood`
- `.isFoodPredicate`
- `.canBreed`
- `.canMate`
- `.spawnChildFromBreeding`

---

## Methods Exclusive to the Animal/Mob Builder (Not in LivingEntity Builder) 🐕‍🦺

- `.removeWhenFarAway`
- `.followLeashSpeed`
- `.ambientSoundInterval`
- `.myRidingOffset`
- `.canJump`
- `.walkTargetValue`
- `.tickLeash`
- `.shouldStayCloseToLeashHolder`
- `.onTargetChanged`
- `.canFireProjectileWeaponPredicate`
- `.canFireProjectileWeapon`
- `.ate`
- `.setAmbientSound`
- `.canHoldItem`
- `.shouldDespawnInPeaceful`
- `.isPersistenceRequired`
- `.meleeAttackRangeSqr`

---

## Methods Exclusive to the TamableMob Builder 🐕 

- `.tamableFood`
- `.tamableFoodPredicate`


