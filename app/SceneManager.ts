export  { SceneManager };

import * as Three from 'Three';

import { Box } from "./Objects/Box";
import { Keyboard } from "./Keyboard";
import { Renderer } from "./Renderer"; 
import { BoxManager } from "./Objects/BoxManager";
import { CollisionManager } from "./CollisionManager";
import { SceneEnvironment } from "./SceneEnvironment";

class SceneManager
{
    private _Keyboard:Keyboard;
    private _Renderer:Renderer;
    private _BoxManager:BoxManager;
    private _CollisionManager:CollisionManager;
    public constructor(Resolution:any)
    {
        this._Keyboard = new Keyboard();
        this._Renderer = new Renderer({X:1920, Y:1080});
        let Env = new SceneEnvironment(this._Renderer.Scene);
        this._CollisionManager = new CollisionManager();
        this._BoxManager = new BoxManager(this._Renderer.Scene, this._CollisionManager);
        this._Renderer.OnRender.push(this.Update.bind(this));
        this._Renderer.OnRender.push(this._BoxManager.Prepare.bind(this._BoxManager));
        this._Renderer.OnRender.push(this._CollisionManager.Run.bind(this._CollisionManager));
        this._Renderer.OnRender.push(this._BoxManager.Update.bind(this._BoxManager));
    }
    private Update() : void
    {
        if(this._Keyboard.Space) 
        { 
            this._BoxManager.ReleaseBox(); 
        } 
        if(this._Keyboard.Left) 
        { 
            this._BoxManager.SetMove(-0.1); 
        } 
        else if(this._Keyboard.Right) 
        { 
            this._BoxManager.SetMove(0.1); 
        }
        else
        {
            this._BoxManager.SetMove(0);
        }
    }
}