"use strict";
import {Scene, Physics, Events} from "phaser";
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
    if (cards == null)
    {
        console.error("missing cards!");
        return null;
    }
    else
    {
        const sortedCards = sortByLeftToRight(cards);
        for (let i = 0; i < sortedCards.length; i++)
        {
            const c = sortedCards[i];
            c.depth = i;
        }
        return sortedCards;
    }
}

function addAcardsOverBdistance(scene,a,b, startAtX,startAtY)
{
    const distPerCard = Math.round(b / a);
    let pos = {x:startAtX,y:startAtY};
    for (let i = 0; i < a; i++)
    {
        scene.addCard(pos.x, pos.y);
        pos.x = pos.x + distPerCard;
    }

}

class CardScene extends Scene
{
    constructor()
    {
        super({key: "card",active:true});
        this.cards = [];
        this.emitter = new Events.EventEmitter();
    }
    preload ()
    {
        this.load.image("sprite","card-dummy.png");
    }

    sortFront()
    {
        if (this.cards != null)
        {
            this.cards = bringCardToFront(this.cards);
        }
    }

    addCard(x,y)
    {
        const depth = 100 - this.cards.length;
        const hitboxSize = 30;
        const scale = 1;
        const card = new CardSprite({scene:this, x:x,y:y}).init(hitboxSize, scale, depth, this.emitter);
        this.cards.forEach(c => 
        {
            addCardCollision(this,card.hitbox, c.hitbox);
        });
        this.cards.push(card);
        //this.cards = bringCardToFront(this.cards);
    }

    create ()
    {
        addAcardsOverBdistance(this,7,500, 150,300);
        //using 'this' keyword can cause a lot of problems when
        //using callback functions :)
        this.emitter.on("sortFront", () => { this.sortFront()});
    }

    update (dt,time)
    {

    }
}




export {CardScene};