let corn=0;
let max=7;
let start_mult=0; 
let ver=360; //vertices
let dif=0.008;
let base_point=1; // 1-start in corner; 0-start in middle of edge;
let edge=1;
let saturation=160;
let alpha=100;

let mult=start_mult;
let dir=1;
let m_pos=1;
const m_max=9;
let r;

function setup()
{
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB,255);
  stroke(255);
  noFill();
}


function draw()
{
  background(0);
  noFill();
  applyMatrix();
  translate(width/2,height/2);
  rotate(PI/2);
  if(corn==0)
  {
    r=height/3;
    stroke(255);
    if(edge==1) circle(0,0,r);
    for(let i=0;i<ver;i++)
    {
      stroke(map(i,0,ver,128+dir*128,128-dir*128),saturation,250,alpha);
      let p1=getXY(r,dir*TWO_PI/ver*i);
      let p2=getXY(r,dir*TWO_PI/ver*(i*mult%ver));
      line(p1.x,p1.y,p2.x,p2.y);
    }
  }else if(corn>2)
  {
    r=height/3*cos(TWO_PI/corn/2);
    stroke(255);
    if(edge==1)
      for(let i=0;i<corn;i++)
      {
        let p1=getXY(r/cos(TWO_PI/corn/2),TWO_PI/corn*(i-0.5));
        let p2=getXY(r/cos(TWO_PI/corn/2),TWO_PI/corn*(i+0.5));
        line(p1.x,p1.y,p2.x,p2.y);
      }
    for(let i=(-ver/corn/2)*base_point;i<=ver+(ver/corn/2)*base_point;i++)
    {
      stroke(map(i,0,ver,128+dir*128,128-dir*128),saturation,250,alpha);
      let angle=dir*TWO_PI/ver;
      let p1=getXY(getR(r,corn,angle*i),angle*i);
      let p2=getXY(getR(r,corn,angle*(i*mult%ver)),angle*(i*mult%ver));
      line(p1.x,p1.y,p2.x,p2.y);
    }
  }

  if(dir==1)
    mult+=dif;
  else
    mult-=dif;

  if(mult<=start_mult) dir*=-1;
  if(mult>=max) dir*=-1;

  resetMatrix();
  if(m_pos>0) GUI();
}

function getXY(r,angle)
{
  return createVector(r*cos(angle),r*sin(angle));
}

function getR(r0,corn,angle)
{
  let segment=angle+(PI/corn);
  segment/=TWO_PI/corn;
  segment=floor(segment);
  return r0/cos(angle-TWO_PI/corn*segment);

}

function GUI() 
{
  applyMatrix();
  translate(width-170,10);
  menu_box(1,"Corners",corn,0,24);
  menu_box(2,"Max mult",max,0,21);
  menu_box(3,"Starting mult",start_mult,1,2);
  menu_box(4,"Num of lines",ver,0,450,30);
  menu_box(5,"Anim speed",dif,0,0.015,0.001);
  menu_box(6,"Base point",base_point,2,1);
  menu_box(7,"Edge",edge,2,1);
  menu_box(8,"Saturation",saturation,0,240,20);
  menu_box(9,"Opacity",alpha,0,240,20);

    applyMatrix();
      translate(-15,m_pos*45-20);
      noStroke();
      fill(190,255,255);
      triangle(-7,-7,-7,7,7,0);
    resetMatrix();

  resetMatrix();

  applyMatrix();
  translate(width-255,height-160);

  noStroke();
  fill(255);
  textFont("Courier New",15);
  text("[SPACE] - show/hide GUI",0,0)
  text("[Arrows] - using menu",0,20)
  text("[Enter] - restart animation",0,40)
  if(deviceOrientation!='undefined')
  {
    textFont("Courier New",20);
    textAlign(CENTER,CENTER);
    fill(190,209,255);
    rect(0,60,40,30);
    fill(255);
    text("-",20,75);
    fill(190,209,255);
    rect(60,60,40,30);
    fill(255);
    text("+",80,75);
  }
  
  resetMatrix();
}

function touchStarted() {
  width-255,height-160
  if(touches[0].x>width-255 && touches[0].x<width-205 && touches[0].y>height-100 && touches[0].y<height-70)
    decrement();
  if(touches[0].x>width-195 && touches[0].x<width-155 && touches[0].y>height-100 && touches[0].y<height-70)
    increment();
}

function menu_box(position,name,value,style,max,step=1)
{
  let y=position*45-40;
  noStroke();
  fill(190,209,255);
  rect(0,y,160,40);
  fill(255);
  textFont("Courier New",15);
  textAlign(RIGHT);
  text(value,155,15+y)
  textAlign(LEFT);
  text(name + ": ",5,15+y);
  switch(style)
  {
    case 0:
    for(let i=0;i<max/step;i++)
    {
      stroke(200);
      if(i*step<value) fill(0);
      else noFill();
      rect(5+((150-50/(max/step))/(max/step))*i,24+y,100/(max/step),10,2);
    }
    break;
    case 1:
    for(let i=0;i<=max/step;i++)
    {
      stroke(200);
      if(i*step<value+1) fill(0);
      else noFill();
      rect(5+((140-50/(max/step+1))/(max/step+1))*i,24+y,100/(max/step+1),10,2);
    }
    break;
    case 2:
    for(let i=0;i<=max/step;i++)
    {
      stroke(200);
      if(i*step==value) fill(0);
      else noFill();
      rect(5+((140-50/(max/step+1))/(max/step+1))*i,24+y,100/(max/step+1),10,2);
    }
    break;
  }

  if(mouseX>width-170 && mouseX<width-10 && mouseY>y+10 && mouseY<y+50)
  {
    m_pos=position;
  }
}


function keyPressed()
{
  console.log(key);
  if(key==" ") //show menu
    {
      if(m_pos==0)
        m_pos=1;
      else
        m_pos=0;
    }
  if(key=="ArrowUp")
    if(m_pos>1) m_pos--;
  if(key=="ArrowDown")  
    if(m_pos<m_max) m_pos++;  

  if(key=="ArrowLeft")
  {
    increment()
  }
  if(key=="ArrowRight")
  {
    decrement();
  }
  if(key=="Enter") mult=start_mult+0.001;
}

function mouseWheel(event) 
{
  if(event.delta>0) increment();
  else decrement();
}

function increment()
{
  switch(m_pos)
    {
      case 1:
        if(corn>3)corn--;
        else if(corn==3) corn=0;
      break;
      case 2:
        if(max>1) max--;
        if(mult>max) mult=max-0.001;
      break;
      case 3:
        if(start_mult>0) start_mult--;
      break;
      case 4:
        if(ver>=60) ver-=30;
      break;
      case 5:
        if(dif>0.001) 
          {
            dif=floor(dif*1000-1);
            dif/=1000;
          }
      break;
      case 6:
        if(base_point==1) base_point=0;
      break;
      case 7:
        if(edge==1) edge=0;
      break;
      case 8:
        if(saturation>0) saturation-=20;
      break;
      case 9:
        if(alpha>20) alpha-=20;
      break;
    }
}

function decrement() {
    switch(m_pos)
    {
      case 1:
        if(corn<24 && corn!=0) corn++;
        else if(corn==0) corn=3;
      break;
      case 2:
        if(max<21)max++;
      break;
      case 3:
        if(start_mult<2) start_mult++;
        if(mult<start_mult) mult=start_mult+0.001;
      break;
      case 4:
        if(ver<=420) ver+=30;
      break;
      case 5:
        if(dif<0.015)
          {
            dif=floor(dif*1000+1);
            dif/=1000;
          }
      break;
      case 6:
        if(base_point==0) base_point=1;
      break;
      case 7:
        if(edge==0) edge=1;
      break;
      case 8:
        if(saturation<240) saturation+=20;
      break;
      case 9:
        if(alpha<240) alpha+=20;
      break;
    }
}