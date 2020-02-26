//GUI variables
let corn=0;         //number of corners
let max=7;          //max mult value
let start_mult=0;   //starting and minimal mult value
let ver=360;        //number of points on the perimeter
let dif=0.008;      //increment of mult in each draw()
let base_point=1;   // 1-start in corner; 0-start in middle of edge;
let edge=1;         //if edge is visible: 1
let saturation=160; //saturation of lines
let alpha=100;      //opacity of liness

//system valriables
let mult=start_mult;//number multipling each vertex
let dir=1;          //if mult is rising: 1
let m_pos=1;        //position of cursor in menu
const m_max=9;      //number of tiles in menu
let r;              //radius of circle

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
  translate(width/2,height/2);  //center of the screen
  rotate(PI/2);                 //0 up
  if(corn==0)       //if the figure is a circle
  {
    r=height/3;     //seting radius
    stroke(255);
    if(edge==1) circle(0,0,r); 
    for(let i=0;i<ver;i++)                //drawing lines
    {
      stroke(map(i,0,ver,128+dir*128,128-dir*128),saturation,250,alpha);  //mapping color
      let p1=getXY(r,dir*TWO_PI/ver*i);             //calculating Cartesian coordinates of 1. point
      let p2=getXY(r,dir*TWO_PI/ver*(i*mult%ver));  //calculating Cartesian coordinates of 2. point
      line(p1.x,p1.y,p2.x,p2.y);      //line
    }
  }else if(corn>2)  //if the figure is a poligon
  {
    r=height/3*cos(TWO_PI/corn/2);  //calculating radius of circumscribed circle
    stroke(255);
    if(edge==1)
      for(let i=0;i<corn;i++)       //drawing edge of poligon
      {
        let p1=getXY(r/cos(TWO_PI/corn/2),TWO_PI/corn*(i-0.5));
        let p2=getXY(r/cos(TWO_PI/corn/2),TWO_PI/corn*(i+0.5));
        line(p1.x,p1.y,p2.x,p2.y);
      }
    for(let i=(-ver/corn/2)*base_point;i<=ver+(ver/corn/2)*base_point;i++)  //drawing lines (considering base_point)
    {
      stroke(map(i,0,ver,128+dir*128,128-dir*128),saturation,250,alpha);  //mapping color
      let angle=dir*TWO_PI/ver;
      let p1=getXY(getR(r,corn,angle*i),angle*i);                       //calculating Cartesian coordinates of 1. point
      let p2=getXY(getR(r,corn,angle*(i*mult%ver)),angle*(i*mult%ver)); //calculating Cartesian coordinates of 2. point
      line(p1.x,p1.y,p2.x,p2.y);      //line
    }
  }

  //changing mult
  if(dir==1)
    mult+=dif;
  else
    mult-=dif;

  //reversing 'movement' on borders of range
  if(mult<=start_mult) dir=1;
  if(mult>=max) dir=-1;

  resetMatrix();
  if(m_pos>0) GUI();  //drawing GUI
}

function getXY(r,angle)   //function converting Polar coordinates to Cartesian
{
  return createVector(r*cos(angle),r*sin(angle));
}

function getR(r0,corn,angle)  //function calculating polar R of regular poligon for given angle
{
  let segment=angle+(PI/corn);
  segment/=TWO_PI/corn;
  segment=floor(segment);
  return r0/cos(angle-TWO_PI/corn*segment);

}

function GUI()    //graphical user interface
{
  applyMatrix();
  translate(width-170,10);

  //menu boxes  (number,text,value to be controled,type of value display,max displayed value,[step])
  menu_box(1,"Corners",corn,0,24);
  menu_box(2,"Max mult",max,0,21);
  menu_box(3,"Starting mult",start_mult,1,2);
  menu_box(4,"Num of lines",ver,0,450,30);
  menu_box(5,"Anim speed",dif,0,0.015,0.001);
  menu_box(6,"Base point",base_point,2,1);
  menu_box(7,"Edge",edge,2,1);
  menu_box(8,"Saturation",saturation,0,240,20);
  menu_box(9,"Opacity",alpha,0,240,20);

  //drawing menu cursor
  applyMatrix();
    translate(-15,m_pos*45-20);
    noStroke();
    fill(190,255,255);
    triangle(-7,-7,-7,7,7,0);
  resetMatrix();

  resetMatrix();

  //drawing shortcuts(PC) / navigating buttons(phone)
  applyMatrix();
  translate(width-255,height-160);
  noStroke();
  if(deviceOrientation=='undefined')  //if PC
  {
  fill(255);
  textFont("Courier New",15);
  text("[SPACE] - show/hide GUI",0,0)
  text("[Arrows] - use menu",0,20)
  text("[Enter] - restart animation",0,40)
  text("[Coursor] - navigate in menu",0,70)
  text("[Scroll] - change values",0,90)
  }else                               //if phone
  {
    //touch-buttons for phones to change values
    textFont("Courier New",20);
    textAlign(CENTER,CENTER);
    fill(190,209,255);
    rect(0,60,40,30);
    fill(255);
    text("-",20,75);        //'minus' button
    fill(190,209,255);
    rect(60,60,40,30);
    fill(255);
    text("+",80,75);        //'plus' button
    fill(190,209,255);
    rect(20,100,60,30);
    fill(255);
    text("HIDE",50,115);    //'hide' button
  }
  resetMatrix();
}

//drawing and handling menu box
function menu_box(position,name,value,style,max,step=1)
{
  let y=position*45-40;
  noStroke();

  fill(190,209,255);  //tile
  rect(0,y,160,40);

  fill(255);          //labels
  textFont("Courier New",15);
  textAlign(RIGHT);
  text(value,155,15+y)
  textAlign(LEFT);
  text(name + ": ",5,15+y);

  switch(style)       //value bar
  {
    case 0:   //basic bar
    for(let i=0;i<max/step;i++)   //for each box...
    {
      stroke(200);
      if(i*step<value) fill(0);   //fill boxes lower then value
      else noFill();
      rect(5+((150-50/(max/step))/(max/step))*i,24+y,100/(max/step),10,2);  //draw box at position
    }
    break;
    case 1:   //bar starting at 0 (not at 1)
    for(let i=0;i<=max/step;i++)
    {
      stroke(200);
      if(i*step<value+1) fill(0);
      else noFill();
      rect(5+((140-50/(max/step+1))/(max/step+1))*i,24+y,100/(max/step+1),10,2);
    }
    break;
    case 2:   //1-box-at-time bar
    for(let i=0;i<=max/step;i++)
    {
      stroke(200);
      if(i*step==value) fill(0);  //fill box equal to value
      else noFill();
      rect(5+((140-50/(max/step+1))/(max/step+1))*i,24+y,100/(max/step+1),10,2);
    }
    break;
  }

  //handling mouse/touch pointing
  if(mouseX>width-170 && mouseX<width-10 && mouseY>y+10 && mouseY<y+50) //if mouse/touch over this menu box
  {
    m_pos=position; //change menu coursot to this box
  }
}


function keyPressed()
{
  //console.log(key);

  if(key==" ") //show/hide menu
    {
      if(m_pos==0)
        m_pos=1;
      else
        m_pos=0;
    }
  if(key=="ArrowUp")      //move up in menu
    if(m_pos>1) m_pos--;
  if(key=="ArrowDown")    //move down in menu
    if(m_pos<m_max) m_pos++;  

  if(key=="ArrowLeft")    //decrease value in menu
  {
    decrement()
  }
  if(key=="ArrowRight")   //increase value in menu
  {
    increment();
  }
  if(key=="Enter") mult=start_mult+0.001; //restart animation
}

function mouseWheel(event) //incease/decrease value using scroll
{
  if(event.delta>0) decrement();
  else increment();
}

function touchStarted() { //handling touch interactions with touch-buttons
  if(m_pos==0 && touches.length>0) m_pos=1;
  if(touches[0].x>width-255 && touches[0].x<width-205 && touches[0].y>height-100 && touches[0].y<height-70) //'-' button
    decrement();
  if(touches[0].x>width-195 && touches[0].x<width-155 && touches[0].y>height-100 && touches[0].y<height-70) //'+' button
    increment();
  if(touches[0].x>width-215 && touches[0].x<width-175 && touches[0].y>height-60 && touches[0].y<height-30)  //'hide' button
    m_pos=0;  //hiding GUI
}

function decrement()  //decrementing value associated with currently selected menu-box
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
            dif=floor(dif*1000-1);    //strange construction to fix '0.800000001' bug
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

function increment() {    //incrementing values
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