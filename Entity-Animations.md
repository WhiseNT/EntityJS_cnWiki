# **Adding a Simple Animation Controller** 🎥

> 要将动画绑定在实体上,需要一个动画控制器.本节将介绍如何添加一个基本的控制器用于管理"wyrm"实体的动画
```javascript
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'entityjs:animal')
        .addAnimationController('exampleController', 1, event => {
            if (event.entity.hurtTime > 0) {
                event.thenPlayAndHold('spawn');
            } else {
                event.thenLoop('idle');
            }
            return true;
        });
});
```

> - 方法 `addAnimationController` 将名为`exampleController`的新控制器添加到了"wyrm"
> - 这个控制器的`translationTicksLength`为1 .  
> - 当实体受到伤害时，会播放"spawn"动画，而"idle"动画则无限循环。

---

# **Setting Up Triggerable Animations** 🎯

> Triggerable animaitons会在特定条件或者事件下播放,以下是如何为实体"wyrm"设置Triggerable animations

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'entityjs:animal')
        .addAnimationController('exampleController1', 5, event => {
            event.addTriggerableAnimation('spawn', 'spawning', 'default');
            if (event.isMoving()) {
                event.thenPlay("idle");
            }
            return true;
        })
        .onLivingJump(entity => {
            entity.triggerAnimation('exampleController1', 'spawning');
        });
});
```

> - 添加了一个名为 "spawn" 的可触发动画,其循环类型为 "default".  
> -  "idle" 会在实体移动的时候播放  
> - "spawning"动画将会在实体跳跃时触发

---

# **Dedicated Triggerable Animation Setup** 🔧

> 使用一个名为`addTriggerableAnimationController`的专用方法来添加可触发动画,这不需要额外的逻辑即可管理动画.

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'entityjs:animal')
        .addTriggerableAnimationController('exampleController', 5, 'spawn', 'spawning', 'play_once');
});
```

> - 这将添加一个名为“exampleController”的动画控制器，其转换持续时间为5. 
> - 添加了一个名为"spawn"的可触发动画,其循环类型为"play_once".

---

# **Entity `triggerAnimation` Method** 🚀

> The `triggerAnimation`可以直接在KubeJS事件中的被实体调用,例如`EntityEvents.hurt`.

```javascript
EntityEvents.hurt('kubejs:wyrm', event => {
    event.entity.triggerAnimation('exampleController', 'spawning');
});
```

> -  使用了`triggerAnimation`方法,这让实体受伤时触发"spawning"动画.

---

# **File Structure for Geckolib Entities** 📁

> 确保Geckolib实体动画、模型和贴图的文件结构如下:

<table>
  <tr>
    <td><strong>Animations</strong></td>
    <td><code>assets&gt;modname&gt;animations&gt;entity&gt;mobname.animation.json</code></td>
  </tr>
  <tr>
    <td><strong>Geo Model</strong></td>
    <td><code>assets&gt;modname&gt;geo&gt;entity&gt;mobname.geo.json</code></td>
  </tr>
  <tr>
    <td><strong>Texture</strong></td>
    <td><code>assets&gt;modname&gt;textures&gt;entity&gt;mobname.png</code></td>
  </tr>
</table>

