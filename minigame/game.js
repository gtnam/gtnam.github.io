
let W=240,H=360,LANES=3,LW=W/LANES;
let pl=1, py, pw, ph;
let L=[], Y=[], S=[];
let sp=3, cd=0;   
let score=0, over=false;

function setup(){
  createCanvas(W,H);
  textAlign(CENTER,CENTER);
  py=H-40; ph=18; pw=LW*0.65;
  resetGame();
}

function resetGame(){
  L.length=Y.length=S.length=0;
  sp=3; cd=0; score=0; over=false;
}

function draw(){
  background(250);

  stroke(220); for(let i=1;i<LANES;i++) line(i*LW,0,i*LW,H); noStroke();
  
  fill(0); text("Dodged: "+score, W/2, 14);

  if(over){

    fill(0);
    for(let i=0;i<L.length;i++){
      rect(L[i]*LW+(LW-S[i])/2, Y[i], S[i], S[i]);
    }
    fill(0); textSize(16); text("Game Over",W/2,H/2-10);
    textSize(12); text("Click or press any key",W/2,H/2+10);
    return;
  }

  if(cd--<=0){
    L.push(floor(random(LANES)));
    S.push(LW*0.58);
    Y.push(-S[S.length-1]);
    cd=int(random(22,40));
  }

  sp+=0.001;

  fill(0);
  for(let i=Y.length-1;i>=0;i--){
    Y[i]+=sp;
    rect(L[i]*LW+(LW-S[i])/2, Y[i], S[i], S[i]);

    if(L[i]===pl){
      let px=pl*LW+(LW-pw)/2, py2=py;
      if(!(px+pw < L[i]*LW+(LW-S[i])/2 || (L[i]*LW+(LW-S[i])/2)+S[i] < px || py2+ph < Y[i] || Y[i]+S[i] < py2)){
        over=true;
      }
    }

    if(Y[i]>H){ L.splice(i,1); Y.splice(i,1); S.splice(i,1); score++; }
  }

  fill(30,120,255);
  rect(pl*LW+(LW-pw)/2, py, pw, ph, 4);
}

function keyPressed(){
  if(over){ resetGame(); return; }
  if(key==='1') pl=0; else if(key==='2') pl=1; else if(key==='3') pl=2;
}

function mousePressed(){
  if(over){ resetGame(); return; }
  pl = constrain(floor(mouseX/LW),0,LANES-1);
}
