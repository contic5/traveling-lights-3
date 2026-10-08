import { calculate_distance } from "./shared";
export class Light
{
    static radius=10;
    static points=[];
    static holdtime=30;
    static hue_difference=0;
    static light_difference=0;
    static maxlight=0;
    static minlight=0;
    static movespeed=0;
    
    constructor(point_index,is_shadow,radius)
    {
        this.movespeed=Light.movespeed;
        this.point_index=point_index;
        this.x=Light.points[this.point_index][0];
        this.y=Light.points[this.point_index][1];
        this.is_shadow=is_shadow;

        this.target=this.point_index+1;
        if(this.target>=Light.points.length)
        {
            this.target=0;
        }

        this.radius=Light.radius;
        this.hue=(this.point_index*Light.hue_difference)%360;
        this.lighting=(this.point_index*Light.light_difference)%(Light.maxlight-Light.minlight)+Light.minlight;
            console.log(this.lighting);

        this.light_direction=1;
        this.holdtime=0;

        this.make_path();
        console.log(this.x,this.y);
    }
    make_path()
    {
        //The angle to reach the point
        this.angle= Math.atan2(Light.points[this.target][1]-this.y,Light.points[this.target][0]-this.x);


        this.slope=0;
        if(this.target[0]!=this.x)
        {
            this.slope=(this.y-this.target[1])/(this.x-this.target[0]);
        }
    }
    move()
    {
        //Every frame, the light tries to move towards its target

        //Calculate distance before moving and distance after moving. If the distance after is less, then move to the next target point.
        let start_dis=calculate_distance(this.x,this.y,Light.points[this.target][0],Light.points[this.target][1]);

        //Change x by cos(angle)*movespeed
        this.x+=Math.cos(this.angle)*this.movespeed;

        //Change y by sin(angle)*movespeed
        this.y+=Math.sin(this.angle)*this.movespeed;

        let end_dis=calculate_distance(this.x,this.y,Light.points[this.target][0],Light.points[this.target][1]);

        //If it passes the target, then it changes its target to the next point
        if(start_dis<end_dis)
        {
            this.x=Light.points[this.target][0];
            this.y=Light.points[this.target][1];
            this.point_index=this.point_index+1;
            this.target=this.target+1;
            //It targets point 0 if it reaches the last point
            if(this.target>=Light.points.length)
            {
                this.target=0;
            }
            if(this.point_index>=Light.points.length)
            {
                this.point_index=0;
            }

            this.make_path();
        }
    }
    modifycolors()
    {
        this.hue+=1;
        if(this.hue>=360)
        {
            this.hue=0;
        }

        if(this.holdtime<=0)
        {
            this.lighting+=this.light_direction;
            if(this.lighting<=Light.minlight)
            {
                this.light_direction=1;
                this.holdtime=Light.holdtime;
            }
            else if(this.lighting>=Light.maxlight)
            {
                this.light_direction=-1;
                this.holdtime=Light.holdtime;
            }
        }
        else
        {
            this.holdtime-=1;
        }
    }
    draw(ctx)
    {
        if(this.is_shadow)
        {
            ctx.fillStyle="#000000";
            //ctx.strokeStyle="#000000";
            ctx.beginPath();
            ctx.arc(this.x-4, this.y-4, this.radius+8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        else
        {
            ctx.fillStyle=`hsla(${this.hue},100%,${this.lighting}%)`;
            //ctx.strokeStyle=`hsl(${this.hue},100%,70%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }

    }
}