// p
/**
 * @param {$ClientEventJS_} event
 * @returns
 */
function energy_surround(event,special_data){

    let pos = special_data["pos"]
    let lifetime = special_data["lft"]
    let scale = special_data["scl"]
    let sp_uuid = special_data["uuid"]
    
    let particle = Client.particleEngine.createParticle("electric_spark",pos[0],pos[1],pos[2],0,0,0)
    particle.setLifetime(lifetime)
    particle.scale(scale*3)
    let count = 0
    Client.tell(sp_uuid)
    let fcloop = Client.scheduleRepeatingInTicks(1,()=>{
        if (!PosObject.hasOwnProperty(sp_uuid))
            {
                
                particle.remove()
                fcloop.clear()
                return
            }
        //Client.tell(PosObject[uuid])
        pos = PosObject[sp_uuid]
        let result1 = ring_particle_angle_1(pos[0],pos[1],pos[2],2,16,0)
        if (count >= 16)
            {
                count = 0
            }
        particle.setPos(result1[count][0],result1[count][1],result1[count][2])
        count += 1

        

		
        
        
        
    })


    
        

}
