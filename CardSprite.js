"use strict";
import {Physics, GameObjects} from "phaser";

function matchingPosition(p1,p2)
{
    //const x = Math.ceil( p1.x) == Math.ceil(p2.x);
    //const y = Math.ceil( p1.y) == Math.ceil(p2.y);
    const y = Math.round(p1.y) == Math.round( p2.y);
    const x = Math.round(p1.x) == Math.round( p2.x);
    const result = x && y;
    return result;
}

class CardHitbox extends GameObjects.Rectangle
{
    constructor(card, size)
    {
        super(card.scene,card.x,card.y,size,size,0xff0000);
        this.nextPosition = null;
        this.origin = card.cardOrigin;
    }
}

class CardSprite extends Physics.Arcade.Sprite
{
    constructor(conf)
    {
        super(conf.scene, conf.x, conf.y, "sprite");
        this.isNotDragging = true;
        this.movingToOrigin = false;
        //this.body.gravity = 0;
    }

    dragCard(dX,dY)
    {
        this.isNotDragging = false;
        this.setPosition(dX,dY);
        this.hitbox.setPosition(dX,dY);
        this.setDepth(1000);
    }

    isNotAtOrigin()
    {
        return !(matchingPosition(this, this.cardOrigin));
    }

    resetStatus()
    {
        this.movingToOrigin = false;
        this.hitbox.body.enable = true;
        this.emitter.emit("sortFront", this.scene);
    }

    resetToOrigin()
    {
        if (!this.movingToOrigin)
        {
            this.setDepth(this.oldDepth);
            this.movingToOrigin = true;
            this.hitbox.body.enable = false;
            this.scene.tweens.add({
                targets: [this, this.hitbox],
                x: this.cardOrigin.x,
                y: this.cardOrigin.y,
                duration: 350,
                onComplete : () => {this.resetStatus();}
            });
        }
    }

    init (hitboxSize, scale, depth, emitter)
    {
        this.emitter = emitter;
        this.cardOrigin = {x:this.x, y:this.y};
        this.setInteractive({ draggable: true });
        this.setScale(scale);
        this.on('drag', (pointer, dragX, dragY) => this.dragCard(dragX, dragY));
        this.on('dragend', (pointer, dragX, dragY) => {this.isNotDragging = true;});
        //this.scene.setInteractive();
        this.hitbox = new CardHitbox(this, hitboxSize);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this.hitbox);
        this.hitbox.body.setAllowGravity(false);
        //this.scene.physics.add.existing(this);
        this.setDepth(depth);
        this.oldDepth = depth;
        return this;
    }

    preUpdate(dt,time)
    {
        if (this.isNotDragging && this.isNotAtOrigin())
        {
            this.resetToOrigin();
        }
        if (this.hitbox.nextPosition != null)
        {
            console.log("swapping origin!!");
            this.cardOrigin = {x:this.hitbox.nextPosition.x, y:this.hitbox.nextPosition.y};
            this.hitbox.nextPosition = null;
            this.hitbox.origin = this.cardOrigin;
        }
    }
}


export {CardSprite};