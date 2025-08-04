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

function sortByLeftToRight(cards)
{
    return cards.sort((c1,c2) => c2.cardOrigin.x - c1.cardOrigin.x);
}

function bringCardToFront(cards)
{
    const sortedCards = sortByLeftToRight(cards);
    for (let i = 0; i < sortedCards.length; i++)
    {
        const c = sortedCards[i];
        c.depth = i;
    }
    return sortedCards;
}


class CardScene extends Scene
{
    constructor()
    {
        super({key: "card",active:true});
        this.cards = [];
    }
    preload ()
    {
        this.load.image("sprite","card-dummy.png");
    }

    addCard(x,y)
    {
        const depth = this.cards.length;
        const hitboxSize = 30;
        const scale = 1;
        const card = new CardSprite({scene:this, x:x,y:y}).init(hitboxSize, scale, depth);
        this.cards.forEach(c => 
        {
            addCardCollision(this,card.hitbox, c.hitbox);
        });
        this.cards.push(card);
        //this.cards = bringCardToFront(this.cards);
    }

    create ()
    {
        this.addCard(400,400);
        this.addCard(450,400);
        this.addCard(500,400);
    }

    update (dt,time)
    {

    }
}




export {CardScene};