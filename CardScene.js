"use strict";
import {Scene, Physics} from "phaser";

function matchingPosition(p1,p2)
{
    //const x = Math.ceil( p1.x) == Math.ceil(p2.x);
    //const y = Math.ceil( p1.y) == Math.ceil(p2.y);
    const y = Math.round(p1.y) == Math.round( p2.y);
    const x = Math.round(p1.x) == Math.round( p2.x);
    const result = x && y;
    return result;
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
    }

    isNotAtOrigin(pos)
    {
        return !(matchingPosition(this, this.cardOrigin));
    }

    resetToOrigin()
    {
        if (!this.movingToOrigin)
        {
            this.movingToOrigin = true;
            this.scene.tweens.add({
                targets: this,
                x: this.cardOrigin.x,
                y: this.cardOrigin.y,
                duration: 350,
                onComplete : () => {this.movingToOrigin = false;}
            });
        }
    }

    init ()
    {
        this.cardOrigin = {x:this.x, y:this.y};
        this.setInteractive({ draggable: true });
        this.setScale(0.2);
        this.on('drag', (pointer, dragX, dragY) => this.dragCard(dragX, dragY));
        this.on('dragend', (pointer, dragX, dragY) => {this.isNotDragging = true;});
        this.scene.add.existing(this);
        //this.scene.setInteractive();
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        return this;
    }

    preUpdate(dt,time)
    {
        if (this.isNotAtOrigin() && this.isNotDragging)
        {
            this.resetToOrigin();
        }
    }
}


function addCardCollision(scene,card1,card2)
{ 
    scene.physics.add.collider(card1, card2, (c1,c2) =>
    {
        card1.destroy();
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
        //this.sprite = this.physics.add.sprite(300,300, "sprite");
        this.sprite1 = new CardSprite({scene:this, x:300,y:300}).init();
        this.sprite2 = new CardSprite({scene:this, x:500,y:300}).init();
        addCardCollision(this,this.sprite1, this.sprite2)
        //this.sprite2 = new CardSprite({scene:this, x:100,y:300});
        //this.sprite1.body.allowGravity(false);
        //this.sprite2.body.setAcceleration(0,0);

    }
}




export {CardScene};