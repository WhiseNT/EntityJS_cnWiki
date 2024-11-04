### Iron's Spells Mob Registration Script 🧙‍♂️

> This script demonstrates the dynamic registration of entities capable of casting spells from the [Iron's Spells Mod](https://www.curseforge.com/minecraft/mc-mods/irons-spells-n-spellbooks) using the KubeJS addon, [KubeJS Iron's Spells Mod](https://www.curseforge.com/minecraft/mc-mods/kubejs-irons-spells).

---

#### 📜 Startup Script

```javascript
// Register the spellcasting entity
StartupEvents.registry('entity_type', event => {
    event.create('wyrm', 'irons_spells_js:spellcasting')
        .onCancelledCast(entity => {
            // Execute code when the entity stops casting its spell
            console.log('Cancelled spellcasting')
        })
        // Cast a spell when the entity jumps
        .onLivingJump(entity => entity.initiateCastSpell(SpellRegistry.BLOOD_SLASH_SPELL.get(), 1))
})
```

<table>
  <tr>
    <td><strong>Entity Type Registration</strong></td>
    <td>Registers a new entity type, "wyrm", with spellcasting capabilities.</td>
  </tr>
  <tr>
    <td><strong>Spellcasting Events</strong></td>
    <td>Handles events like spell cancelation and spell initiation upon entity actions (like jumping).</td>
  </tr>
</table>

---

### Iron's Spells Example Goal Script 🛡️

> This script adds custom goal selectors for Minecraft entities, allowing them to use spells from Iron's Spells Mod.

---

#### 📜 Server Script

```javascript
EntityJSEvents.addGoalSelectors('minecraft:creeper', event => {
    event.arbitraryGoal(1, (e) => {
        return new WizardAttackGoal(e, 1, 60) // Parameters: entity, movement speed modifier, cast interval
            .setSpells(
                [Spell.of('irons_spellbooks:fang_strike')], // Attack
                [Spell.of('irons_spellbooks:slow')], // Defense
                [Spell.of('irons_spellbooks:blood_step')], // Movement
                [] // Support
            )
    })
})
```

<table>
  <tr>
    <td><strong>Goal Selectors</strong></td>
    <td>Adds custom goal selectors to enable spellcasting behaviors for Minecraft entities, such as the Creeper.</td>
  </tr>
  <tr>
    <td><strong>Spell Categories</strong></td>
    <td>Allows categorizing spells into Attack, Defense, Movement, and Support types.</td>
  </tr>
</table>

---

### MrCrayfish's Gun Mod Compatibility 🔫

> This script demonstrates compatibility integration with [MrCrayfish's Gun Mod](https://www.curseforge.com/minecraft/mc-mods/mrcrayfishs-gun-mod) by registering a new entity type, "mymissile", with ammo and Geckolib/Liolib support.

---

#### 📜 Startup Script

```javascript
StartupEvents.registry("entity_type", event => {
    event.create("mymissile", "cgm:ammo")
        .onHitEntity(context => {
            // Execute code when the ammo hits an entity
            console.log(context.entity);
        })
        .explosionEnabled(true);
});
```

<table>
  <tr>
    <td><strong>Entity Type Registration</strong></td>
    <td>Registers a custom entity type "mymissile" that is compatible with MrCrayfish's Gun Mod's ammo system.</td>
  </tr>
  <tr>
    <td><strong>Hit Behavior</strong></td>
    <td>Triggers a custom event when the projectile hits an entity and enables explosion effects.</td>
  </tr>
  <tr>
    <td><strong>Geckolib/Liolib Support</strong></td>
    <td>Includes full support for animation and model rendering using Geckolib and Liolib.</td>
  </tr>
</table>
