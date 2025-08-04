import {Scene, Game, AUTO} from "phaser";
import {CardScene} from "./CardScene"

const h = "hello";
const arr = [h,h,h];
console.log(arr);


const config = {
    type: AUTO,
    width: 800,
    height: 600,
    scene: [CardScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Game(config);