import { patterns } from "./patterns_v2";
import { Light } from "./light";


function clear()
{
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,c.width,c.height); 
}
function draw()
{
    if(clear_every_frame)
    {
        clear();
    }
    
    for(let light of lights)
    {
        if(moving)
        {
            light.move();
        }
        light.modifycolors();
    }
    
    //Draw shadows first, then lights.
    for(let light of lights)
    {
        if(light.is_shadow)
        {
            light.draw(ctx);
        }
    }
    for(let light of lights)
    {
        if(!light.is_shadow)
        {
            light.draw(ctx);
        }
    }
}
function fill_between(points)
{
    let new_points=[];
    let end=points.length-1;
    for(let i=0;i<points.length-1;i++)
    {
        //Add new point to the array that is at the midpoint of two points.
        new_points.push(points[i]);
        const mid_x=(points[i][0]+points[i+1][0])/2;
        const mid_y=(points[i][1]+points[i+1][1])/2;
        new_points.push([mid_x,mid_y]);
    }
    new_points.push(points[points.length-1]);
    
    const mid_x=(points[0][0]+points[end][0])/2;
    const mid_y=(points[0][1]+points[end][1])/2;
    new_points.push([mid_x,mid_y]);
    return new_points;
}
export function updatesong()
{
    let audio_src=document.getElementById("audio_src").value;
    let audio_player=document.getElementById("audio_player");
    audio_player.src="src/audio/"+audio_src;
}
    
//Update variables to equal input values. This function is called at the start of the program and whenever you change an input.
export function updatevalues()
{
    points_between=parseInt(document.getElementById("points_between").value);

    Light.radius=parseInt(document.getElementById("radius").value);
    Light.movespeed=parseInt(document.getElementById("movespeed").value);
    
    light_pattern=parseInt(patterns_select.value);
    Light.minlight=parseInt(document.getElementById("minlight").value);
    Light.maxlight=parseInt(document.getElementById("maxlight").value);
    Light.light_difference=parseInt(document.getElementById("light_difference").value);
    Light.hue_difference=parseInt(document.getElementById("hue_difference").value);
    
    all_lights=document.getElementById("all_lights").checked;
    clear_every_frame=document.getElementById("clear_every_frame").checked;
    moving=document.getElementById("moving").checked;
    reverse=document.getElementById("moving").checked;
    setup_points();
}
    
//Set up array of points. This occurs whenever you change an input.
function setup_points()
{
    clear();
    console.log(patterns[light_pattern]);
    points=patterns[light_pattern][1];
    
    for(let i=0;i<points.length;i++)
    {
        //Scale up if points are stored in ratios.
        if(points[i][0]<=1)
        {
            points[i][0]=points[i][0]*c.width;
            points[i][1]=points[i][1]*c.height;
        }
    }
    
    //Fill between a specific number of times
    for(let i=0;i<points_between;i++)
    {
        points=fill_between(points);
    }
    if(reverse)
    {
        points.reverse();
    }

    Light.points=points;
    console.log(Light.points.length);
    lights=[];
    for(let i=0;i<points.length;i++)
    {
        //Alternate between lights and shadow if not all lights.
        if(all_lights)
        {
            lights.push(new Light(i,false));
        }
        else
        {
            lights.push(new Light(i,i%2==0));
        }
    }
}
function setup()
{
    //Add each option for patterns
    for(let i=0;i<patterns.length;i++)
    {
        let option=document.createElement("option");
        option.innerHTML=patterns[i][0];
        option.value=i;
        patterns_select.appendChild(option);
    }
    updatevalues();
}
    
let c=document.getElementById("mycanvas");
c.width=window.innerHeight;
c.height=window.innerHeight;
let ctx=c.getContext("2d");
let patterns_select=document.getElementById("patterns");
    
//Config variables
let all_lights=false;
let clear_every_frame=false;
let moving=true;

let points_between=0;
Light.movespeed=10;
Light.minlight=0;
Light.maxlight=80;
Light.holdtime=30;
Light.hue_difference=30;
Light.light_difference=30;
Light.radius=10;
let light_pattern=0;
let reverse=false;


let points=[];
let lights=[];

window.addEventListener('load', function () 
{
    setup();  
    clear();
    setInterval(draw,1000/30);
})