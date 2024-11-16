

const { $UUID } = require("packages/java/util/$UUID")
//本对象用于存放普通法术的坐标,用以和特殊修饰法术沟通
let PosObject = {
    "uuid":[0,0,0]

}
let uuid = ""
NetworkEvents.dataReceived("wand",event=>{
    let data = event.data
    //匹配法杖名称
    if (!(data.get("name") == "basic_spark"))
    {
        return
    }
    //Client.tell(data)
    let damage = data.get("damage")
    //event.player.tell(data.getFloat("speed"))
    //标准化向量
	const {x,y,z} = event.player
	let viewVector = event.player.getViewVector(1.0)
	const length = Math.sqrt(viewVector.x() * viewVector.x() + viewVector.y() * viewVector.y() + viewVector.z() * viewVector.z());
	let norVector = {
		x : viewVector.x() / length,
		y : viewVector.y() / length,
		z : viewVector.z() / length
	}
    //设定粒子的各项参数
    let parPos = {
        x : x + norVector.x,
        y : y + norVector.y + 1.6,
        z : z + norVector.z
    }
    let speed = data.getFloat("speed")
    let parSpeed = {
        x : norVector.x * speed,
        y : norVector.y * speed,
        z : norVector.z * speed
    }

    //这是粒子枪
    
    //生成粒子
	let particle = Client.particleEngine.createParticle("electric_spark",parPos.x,parPos.y,parPos.z,parSpeed.x,parSpeed.y,parSpeed.z)
    let scale = data.getFloat("scale")
    particle.scale(scale*3)
    //粒子寿命
    let lifetime = data.getInt("lifetime")
	let life = 0
    particle.setLifetime(lifetime)
    let special_List = data.get("special")
    //粒子运动
    event.player.playSound("minecraft:block.note_block.chime",0.8,2)
    
    if (special_List)
        {
            let special_data = {
                "pos":[],
                "scl":0,
                "lft": 0,
                "uuid":""
            }
            Client.tell(special_List)
            special_List.forEach(sp => {
                uuid = $UUID.randomUUID().toString()
                PosObject[uuid] = [parPos.x,parPos.y,parPos.z]
                special_data = {
                    "pos":[parPos.x,parPos.y,parPos.z],
                    "scl":scale,
                    "lft": lifetime,
                    //为修饰函数分配一个唯一的uuid
                    "uuid":uuid
                }
                if (sp === "kubejs:energy_surround")
                {
                    energy_surround(event,special_data)
                }
                
            });
            /*
            for (let i = 0; i < special_List.length; i++) {
                

                let special_data = {
                    "pos":[parPos.x,parPos.y,parPos.z],
                    "scl":scale,
                    "lft": lifetime,
                    //为修饰函数分配一个唯一的uuid
                    "uuid":uuid
                }
                PosObject[uuid] = [parPos.x,parPos.y,parPos.z]
                if (special_List[i] == "kubejs:energy_surround")
                {
                    Client.tell(special_data)
                    //energy_surround(event,special_data)
                }
            }
                */
        }
    //粒子loop
    let loop = Client.scheduleRepeatingInTicks(1,()=>{

        
        //保持粒子匀速
        particle.setParticleSpeed(parSpeed.x,parSpeed.y,parSpeed.z)

        PosObject[uuid] = [particle.pos.x(),particle.pos.y(),particle.pos.z()]


        life += 1
        
        //获取粒子所在坐标的方块坐标
        let wall = 0.5  //决定了离墙多近触发
		let new_x = Math.floor(particle.pos.x() + wall * norVector.x)
		let new_y = Math.floor(particle.pos.y() + wall * norVector.y)
		let new_z = Math.floor(particle.pos.z() + wall * norVector.z)
		let block = event.level.getBlock(new_x,new_y,new_z).getId()
        
        //设定粒子判定体积并获取生物
		scale = data.getFloat("scale")
		let entities = event.level.getEntitiesWithin(AABB.of(particle.pos.x()-scale,particle.pos.y()-scale,particle.pos.z()-scale,particle.pos.x()+scale,particle.pos.y()+scale,particle.pos.z()+scale))
		event.player.getBoundingBox().intersects(particle.getBoundingBox())
        let step = 0

		while (step < entities.size())
            {  
                if(!entities[step].isPlayer())
                {
                    event.player.sendData("par_atk",{x:particle.pos.x(),y:particle.pos.y(),z:particle.pos.z(),
                                                     scale:scale,damage:damage})
                    event.level.spawnParticles("large_smoke",false,particle.pos.x(),particle.pos.y(),particle.pos.z(),0,0,0,4,0)
                    event.player.playSound("minecraft:entity.player.attack.crit",0.4,1.0)
                    life = lifetime
                    delete PosObject[uuid]
                }
                
                step += 1
            }
        
        //判断粒子是否撞墙
		if (!(block == "minecraft:air"))
			{
				delete PosObject[uuid]
                life = lifetime
			}

        //粒子到达寿命终点
        if (life >= lifetime)
        {
            event.player.playSound("minecraft:block.lava.extinguish",0.1,2.0)
            event.level.spawnParticles("large_smoke",false,particle.pos.x(),particle.pos.y(),particle.pos.z(),0,0,0,4,0)
            delete PosObject[uuid]
            loop.clear()
            particle.remove()
        }
    })
})