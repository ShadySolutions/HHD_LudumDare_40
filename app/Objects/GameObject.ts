export  { GameObject };

import * as Three from 'Three';
import * as Matter from 'matter-js';

class GameObject
{
    private _Force:number;
    private _Engine:any;
    private _MatterObject:any;
    private _ThreeObject:Three.Object;
    public get Position() { return this._ThreeObject.position; }
    public set Position(value) { this._ThreeObject.position = value; }
    public get Rotation() { return this._ThreeObject.rotation; }
    public set Rotation(value) { this._ThreeObject.rotation = value; }
    public constructor(Scene:Three.Scene, TextureIndex:number, PhysicsEngine?:any, Position?:any, Size?:any, Static?:boolean)
    {
        this._Force = 0;
        this._Engine = PhysicsEngine;
        if(GameObject.Textures == null) GameObject.LoadTextures();
        if(Size == null) 
        {
            Size = {X:100, Y:100, Z:100};
        }
        this._ThreeObject = new Three.Mesh( new Three.CubeGeometry(Size.X,Size.Y,Size.Z), new Three.MeshPhongMaterial( { color: 0xffffff, map:GameObject.Textures[TextureIndex] } ) );
        if(Position)
        {
            this._ThreeObject.position.x = Position.X
            this._ThreeObject.position.y = Position.Y
            this._ThreeObject.position.z = Position.Z
        }
        Scene.add(this._ThreeObject);
        if(PhysicsEngine != null)
        {
            this._MatterObject = Matter.Bodies.rectangle(this._ThreeObject.position.x, -this._ThreeObject.position.y, Size.X,Size.Y, { isStatic: !!Static, friction:1, frictionStatic:1 });
            Matter.World.add(PhysicsEngine.world, [this._MatterObject]);
        }
    }
    public Prepare() : void
    {
        if(this._MatterObject != null && this._MatterObject.velocity.x == 0)
        {
            //Matter.Body.setPosition(this._MatterObject, {x:this._ThreeObject.position.x, y:-this._ThreeObject.position.y});
            //if(this._Force != 0) this.Force();
        }
    }
    private Force() : void
    {
        if(this._Force < 0) Matter.Body.applyForce(this._MatterObject, {x:this._MatterObject.position.x - 100, y: this._MatterObject.position.y}, {x:this._Force, y:0});
        else Matter.Body.applyForce(this._MatterObject, {x:this._MatterObject.position.x + 100, y: this._MatterObject.position.y}, {x:this._Force, y:0});
        this._Force = 0;
    }
    public Update() : void
    {
        if(this._MatterObject != null)
        {
            this._ThreeObject.position.x = this._MatterObject.position.x;
            this._ThreeObject.position.y = -this._MatterObject.position.y;
            this._ThreeObject.rotation.z = -this._MatterObject.angle;
        }
    }
    public NonStatic() : void
    {
        if(this._MatterObject != null && this._Engine != null)
        {
            Matter.World.remove(this._Engine.world, this._MatterObject);
            this._MatterObject = Matter.Bodies.rectangle(this._ThreeObject.position.x, -this._ThreeObject.position.y, 100, 100, {friction:1, frictionStatic:1});
            Matter.World.add(this._Engine.world, [this._MatterObject]);
        }
    }
    public UpdateForce(Force:number) : void
    {
        this._Force += Force;
    }
    public SetVelocity(Velocity:number) : void
    {
        Matter.Body.setVelocity(this._MatterObject, {x:Velocity, y:0});
        Matter.Body.translate(this._MatterObject, {x:Velocity * 2, y:0});
    }
    public Move(Vector:any)
    {
        Matter.Body.translate(this._MatterObject, Vector);
    }
    public static Textures:any[];
    public static LoadTextures()
    {
        let TextureUrls = ["build/resources/box.png"];
        let TextureLoader = new Three.TextureLoader();
        let Textures : Three.Texture[] = [];
        for(let j = 0; j < TextureUrls.length; j++)
        {
            let NewTexture = TextureLoader.load(TextureUrls[j]);
            Textures.push(NewTexture);
        }
        GameObject.Textures = Textures;
    }
}