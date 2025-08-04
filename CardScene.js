"use strict";
import {Scene, Physics} from "phaser";
import { CardSprite } from "./CardSprite";


function addCardCollision(scene,hitbox1,hitbox2)
{ 
    scene.physics.add.collider(hitbox1, hitbox2, (h1,h2) =>
    {
        if (h2.nextPosition == null && h1.nextPosition == null)
        {
            h1.nextPosition = {x:h2.origin.x,y:h2.origin.y};
            h2.nextPosition = {x:h1.origin.x,y:h1.origin.y};
        }
    });
}


class CardScene extends Scene
{
    constructor()
    {
        super({key: "card",active:true})
    }
    preload ()
    {
        this.load.image("sprite","sprite.jpg");
    }

    create ()
    {

        //this.scene.physics.add.image()
        //this.sprite = this.physics.add.sprite(300,300, "sprite");
        this.sprite1 = new CardSprite({scene:this, x:300,y:300}).init();
        this.sprite2 = new CardSprite({scene:this, x:500,y:300}).init();
        addCardCollision(this,this.sprite1.hitbox, this.sprite2.hitbox);
        //this.sprite2 = new CardSprite({scene:this, x:100,y:300});
        //this.sprite1.body.allowGravity(false);
        //this.sprite2.body.setAcceleration(0,0);

    }
}




export {CardScene};