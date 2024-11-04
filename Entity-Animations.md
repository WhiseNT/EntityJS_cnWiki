# **Adding a Simple Animation Controller** 🎥

> To incorporate animations into entities, you'll need an animation controller. This section explains how to add a basic controller to manage animations for the "wyrm" entity.

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

> - The `addAnimationController` method adds a new controller named "exampleController" to the "wyrm" entity.  
> - The controller transitions between animations with a `translationTicksLength` of 1.  
> - The "spawn" animation is played when the entity is hurt, while the "idle" animation loops indefinitely.

---

# **Setting Up Triggerable Animations** 🎯

> Triggerable animations play based on specific events or conditions. Here’s how you can set up triggerable animations for the "wyrm" entity.

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

> - A triggerable animation named "spawn" is added with a loop type of "default".  
> - The "idle" animation plays when the entity is moving.  
> - The "spawning" animation is triggered when the entity jumps.

---

# **Dedicated Triggerable Animation Setup** 🔧

> A dedicated method to add triggerable animations using `addTriggerableAnimationController`. This setup manages animations without additional logic.

```javascript
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'entityjs:animal')
        .addTriggerableAnimationController('exampleController', 5, 'spawn', 'spawning', 'play_once');
});
```

> - This adds an animation controller named "exampleController" with a transition duration of 5.  
> - A triggerable animation named "spawn" is added with a loop type of "play_once".

---

# **Entity `triggerAnimation` Method** 🚀

> The `triggerAnimation` method can be called directly from the entity object in built-in KubeJS events such as `EntityEvents.hurt`.

```javascript
EntityEvents.hurt('kubejs:wyrm', event => {
    event.entity.triggerAnimation('exampleController', 'spawning');
});
```

> - When the entity is hurt, the "spawning" animation is triggered using the `triggerAnimation` method.

---

# **File Structure for Geckolib Entities** 📁

> Ensure the following file structure for Geckolib entity animations, geo models, and textures:

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

