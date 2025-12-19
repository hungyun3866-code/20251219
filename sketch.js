// ===================================================================
// P5.JS 互動遊戲 - 最終完善版 (支援命名 Enter 鍵、變色泡泡、大題庫)
// ===================================================================

let standSheet, walkSheet, jumpSheet;
let character2Sheet, character2TouchSheet;
let character3Sheet, character3TouchSheet;
let character4Sheet, character4TouchSheet;
let backgroundTexture;

let gameState = 'naming'; 
let playerName = "";
let nameInput, nameButton, startBtn;

let currentQuiz, currentTKQuiz;
let quizState = 'awaiting_question'; 
let tkQuizState = 'awaiting_question'; 

const STAND_FRAMES = 2, WALK_FRAMES = 6, JUMP_FRAMES = 3;
const CHARACTER2_FRAMES = 21, CHARACTER2_TOUCH_FRAMES = 10;
const CHARACTER3_FRAMES = 4, CHARACTER3_TOUCH_FRAMES = 7;
const CHARACTER4_FRAMES = 10, CHARACTER4_TOUCH_FRAMES = 2;

const SCALE_FACTOR = 3, SCALE_FACTOR_2 = 2, SCALE_FACTOR_3 = 2, SCALE_FACTOR_4 = 1.5;

let posX, posY, groundY;
let character2PosX, character4PosX, character3PosX;

let speed = 5; 
let direction = 1; 
let state = 'stand'; 
let char2State = 'stand', char3State = 'stand', char4State = 'stand'; 
let velocityY = 0, gravity = 0.5, onGround = false;

let character1Input, tkInput; 
let char2FeedbackTimer = 0;
let char4FeedbackTimer = 0;
const FEEDBACK_DURATION = 90;

// --- 題庫資料 (完整版) ---
const QUIZ_BANK = [
  { q: '綠色加黃色是什麼顏色？', a: ['綠色', '綠'] },
  { q: '一天有幾個小時？', a: ['24', '二十四'] },
  { q: '狗的英文是什麼？', a: ['dog', 'Dog'] },
  { q: '貓的英文是什麼？', a: ['cat', 'Cat'] },
  { q: '一年有幾個月？', a: ['12', '十二'] },
  { q: '水的化學式是什麼？', a: ['H2O', 'h2o'] },
  { q: '台灣最高的山是什麼？', a: ['玉山'] },
  { q: '蜘蛛有幾隻腳？', a: ['8', '八'] },
  { q: '地球上最大的動物？', a: ['藍鯨'] },
  { q: '太陽從哪邊升起？', a: ['東', '東方'] },
  { q: '三角形內角和是多少度？', a: ['180'] },
  { q: '一年四季中，哪一個最冷？', a: ['冬', '冬天'] },
  { q: '冰變成水叫做什麼？', a: ['融化', '熔化'] },
  { q: '人的心臟通常在身體哪邊？', a: ['左', '左邊'] },
  { q: '彩虹有幾種顏色？', a: ['7', '七'] },
  { q: '電腦的腦袋簡寫是什麼？', a: ['CPU', 'cpu'] },
  { q: '蝙蝠是鳥類還是哺乳類？', a: ['哺乳類'] },
  { q: '一公斤等於幾公克？', a: ['1000'] },
  { q: '世界上最長的建築？', a: ['長城', '萬里長城'] },
  { q: '氧氣的化學符號？', a: ['O2', 'o2'] },
  { q: '人體最大的器官是？', a: ['皮膚'] },
  { q: '一打有幾個？', a: ['12'] },
  { q: '日本的首都在哪裡？', a: ['東京'] },
  { q: '雪是什麼顏色的？', a: ['白', '白色'] },
  { q: '時鐘走一圈是幾分鐘？', a: ['60', '六十'] },
  { q: '什麼動物被稱為沙漠之舟？', a: ['駱駝'] },
  { q: '籃球比賽一隊有幾人在場上？', a: ['5', '五'] },
  { q: '大象用什麼地方拿食物？', a: ['鼻子', '象鼻'] },
  { q: '農曆八月十五是什麼節？', a: ['中秋', '中秋節'] },
  { q: '電話的發明者是誰？', a: ['貝爾'] },
  { q: '一小時有幾秒？', a: ['3600'] },
  { q: '什麼形狀沒有邊角？', a: ['圓形', '圓'] },
  { q: '蝴蝶的前身是什麼？', a: ['毛毛蟲'] },
  { q: '哪顆行星被稱為紅色星球？', a: ['火星'] },
  { q: '鋼琴有幾個白鍵？(通常)', a: ['52'] },
  { q: '哪種昆蟲勤勞採蜜？', a: ['蜜蜂'] },
  { q: '足球賽每場幾分鐘？', a: ['90'] },
  { q: '月亮繞著哪顆星轉？', a: ['地球'] },
  { q: '人的正常體溫大約幾度？', a: ['37', '36'] },
  { q: '英文有幾個字母？', a: ['26'] }
];

const TAMKANG_QUIZ_BANK = [
  { q: '淡江大學的校訓是什麼？', a: ['樸實剛毅'] },
  { q: '淡江大學創立於哪一年？', a: ['1950'] },
  { q: '淡江最著名的階梯叫什麼？', a: ['克難坡'] },
  { q: '淡江大學所在的行政區？', a: ['淡水', '淡水區'] },
  { q: '淡江著名的建築叫什麼？', a: ['宮燈教室', '宮燈'] },
  { q: '淡江大學的吉祥物是？', a: ['海豚'] },
  { q: '書卷廣場又被學生稱為什麼？', a: ['蛋捲廣場', '蛋捲'] },
  { q: '淡江圖書館的名稱？', a: ['覺生'] },
  { q: '淡江大學的英文縮寫？', a: ['TKU', 'tku'] },
  { q: '淡江最大的體育館名稱？', a: ['紹謨'] },
  { q: '克難坡共有幾階？', a: ['132'] },
  { q: '海事博物館的外型像什麼？', a: ['船', '輪船'] },
  { q: '淡江目前的校長是？', a: ['葛煥昭'] },
  { q: '宮燈教室前的路叫什麼？', a: ['宮燈大道'] },
  { q: '淡大校慶是在幾月份？', a: ['11', '十一月'] },
  { q: '驚聲大樓是為紀念誰？', a: ['張驚聲'] },
  { q: '校歌第一句是什麼？', a: ['浩浩淡江'] },
  { q: '淡大著名的噴水池是？', a: ['海豚噴水池'] },
  { q: '淡大有幾個學院？', a: ['8', '八'] },
  { q: '淡大BBS站叫什麼？', a: ['蛋捲廣場'] },
  { q: '五虎崗是淡大的第幾個崗？', a: ['五'] },
  { q: '淡大著名的跨年地點？', a: ['蛋捲廣場'] },
  { q: '淡大創辦人是誰？', a: ['張建邦'] },
  { q: '覺生圖書館在哪棟樓？', a: ['覺生紀念圖書館'] },
  { q: '淡大有蘭陽校區嗎？', a: ['有'] },
  { q: '淡大哪裡可以看夕陽？', a: ['情人坡'] },
  { q: '淡大的校慶日是幾號？', a: ['8', '八號'] },
  { q: '淡大旁邊的捷運站是？', a: ['淡水站'] },
  { q: '淡大有幾個校區？', a: ['2', '二'] },
  { q: '淡大的校色主色是？', a: ['紅', '紅色'] }
];

let quizPool = [];   
let tkQuizPool = []; 

function preload() {
    standSheet = loadImage('stand/1all.png');
    walkSheet = loadImage('walk/2all.png');
    jumpSheet = loadImage('jump/3all.png');
    character2Sheet = loadImage('2/stop/all.png');
    character2TouchSheet = loadImage('2/touch/3all.png');
    character3Sheet = loadImage('3/stand/2all.png');
    character3TouchSheet = loadImage('3/touch/3all.png');
    character4Sheet = loadImage('4/stand/2all.png');
    character4TouchSheet = loadImage('4/touch/3all.png');
    backgroundTexture = loadImage('jump/Backgrounds.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    resetPositions();
    shufflePool(2); shufflePool(4);

    // --- 命名輸入框 ---
    nameInput = createInput(''); 
    nameButton = createButton('確定'); 
    nameButton.mousePressed(handleNaming);
    // 增加監聽 Enter 鍵的功能
    nameInput.elt.addEventListener('keydown', (e) => { if(e.key==='Enter') handleNaming(); });
    
    updateUI_Position();

    // 回答輸入框美化
    character1Input = createInput(''); 
    character1Input.size(90); character1Input.style('border', 'none');
    character1Input.style('outline', 'none'); character1Input.style('background', 'transparent');
    character1Input.hide();
    character1Input.elt.addEventListener('keydown', (e) => { if(e.key==='Enter') submitQuiz2(); });

    tkInput = createInput(''); 
    tkInput.size(90); tkInput.style('border', 'none');
    tkInput.style('outline', 'none'); tkInput.style('background', 'transparent');
    tkInput.hide();
    tkInput.elt.addEventListener('keydown', (e) => { if(e.key==='Enter') submitQuiz4(); });
}

function draw() {
    backgroundTexture ? image(backgroundTexture, 0, 0, width, height) : background(220);
    if (gameState === 'naming') drawNamingOverlay();
    else if (gameState === 'welcome') drawWelcomeOverlay();
    else if (gameState === 'playing') runGameLogic();
}

function handleNaming() {
    let val = nameInput.value().trim();
    if (val !== "") {
        playerName = val;
        gameState = 'welcome';
        nameInput.hide();
        nameButton.hide();
        startBtn = createButton('進入遊戲');
        startBtn.position(width/2-40, height/2+30);
        startBtn.mousePressed(() => { gameState = 'playing'; startBtn.hide(); });
    }
}

function runGameLogic() {
    handleMovement();
    checkCollision2(); checkCollision3(); checkCollision4();
    if (quizState === 'feedback' && frameCount > char2FeedbackTimer + FEEDBACK_DURATION) resetQuiz(2);
    if (tkQuizState === 'feedback' && frameCount > char4FeedbackTimer + FEEDBACK_DURATION) resetQuiz(4);
    drawCharacter4(); drawCharacter3(); drawCharacter2();
    drawCharacter(); 
    drawAllBubbles();
}

function drawAllBubbles() {
    if (char2State === 'touch' && currentQuiz) {
        drawBubble(character2PosX, groundY - 260, currentQuiz.q, color(255)); 
        if (quizState === 'awaiting_answer') drawInputBox(posX, posY - 180, character1Input, color(255, 192, 203, 240)); 
        else character1Input.hide();
    } else { character1Input.hide(); }

    if (char4State === 'touch' && currentTKQuiz) {
        drawBubble(character4PosX, groundY - 260, currentTKQuiz.q, color(255)); 
        if (tkQuizState === 'awaiting_answer') drawInputBox(posX, posY - 180, tkInput, color(173, 216, 230, 240)); 
        else tkInput.hide();
    } else { tkInput.hide(); }
}

function drawBubble(x, y, txt, col) {
    push(); textAlign(CENTER, CENTER); textSize(18);
    let bw = max(220, textWidth(txt) + 40);
    fill(col); stroke(50); strokeWeight(2); rectMode(CENTER);
    rect(x, y, bw, 60, 15);
    triangle(x-10, y+30, x+10, y+30, x, y+45);
    fill(0); noStroke(); text(txt, x, y);
    pop();
}

function drawInputBox(x, y, inputElem, boxColor) {
    push(); rectMode(CENTER);
    fill(boxColor); stroke(50); strokeWeight(2);
    rect(x, y, 220, 50, 20); 
    triangle(x - 10, y + 25, x + 10, y + 25, x, y + 40); 
    fill(0); textSize(16); textAlign(LEFT, CENTER); noStroke();
    text("作答：", x - 90, y); 
    fill(255); rect(x + 45, y, 100, 30, 8); 
    pop();
    let canvasRect = canvas.getBoundingClientRect();
    inputElem.position(canvasRect.left + x - 5, canvasRect.top + y - 12);
    inputElem.show();
}

function submitQuiz2() {
    let val = character1Input.value().trim().toLowerCase();
    character1Input.value('');
    let correct = currentQuiz.a.some(ans => ans.toLowerCase() === val);
    currentQuiz.q = correct ? "答對囉！下一題來了..." : "答錯！答案是：" + currentQuiz.a[0];
    quizState = 'feedback'; char2FeedbackTimer = frameCount;
}

function submitQuiz4() {
    let val = tkInput.value().trim();
    tkInput.value('');
    let correct = currentTKQuiz.a.includes(val);
    currentTKQuiz.q = correct ? "答對了！淡江達人！" : "可惜！正確是：" + currentTKQuiz.a[0];
    tkQuizState = 'feedback'; char4FeedbackTimer = frameCount;
}

function resetQuiz(num) {
    if (num === 2) {
        if (quizPool.length === 0) shufflePool(2);
        currentQuiz = quizPool.pop();
        quizState = 'awaiting_answer';
    } else if (num === 4) {
        if (tkQuizPool.length === 0) shufflePool(4);
        currentTKQuiz = tkQuizPool.pop();
        tkQuizState = 'awaiting_answer';
    }
}

function shufflePool(num) {
    if (num === 2) {
        quizPool = [...QUIZ_BANK];
        for (let i = quizPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [quizPool[i], quizPool[j]] = [quizPool[j], quizPool[i]];
        }
    } else if (num === 4) {
        tkQuizPool = [...TAMKANG_QUIZ_BANK];
        for (let i = tkQuizPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tkQuizPool[i], tkQuizPool[j]] = [tkQuizPool[j], tkQuizPool[i]];
        }
    }
}

function resetPositions() { groundY = height * 0.85; let spacing = width / 5; posX = width / 2; character2PosX = posX - spacing - 150; character4PosX = posX + spacing; character3PosX = posX + spacing * 2; posY = groundY; }
function handleMovement() { velocityY += gravity; posY += velocityY; if (posY >= groundY) { posY = groundY; velocityY = 0; onGround = true; } if (keyIsDown(UP_ARROW) && onGround) { velocityY = -12; state = 'jump'; onGround = false; } else if (keyIsDown(RIGHT_ARROW)) { posX += speed; direction = 1; state = 'walk'; } else if (keyIsDown(LEFT_ARROW)) { posX -= speed; direction = -1; state = 'walk'; } else if (onGround) state = 'stand'; posX = constrain(posX, 50, width-50); }
function checkCollision2() { if (abs(posX - character2PosX) < 100) { if (char2State !== 'touch') { char2State = 'touch'; resetQuiz(2); } } else { char2State = 'stand'; } }
function checkCollision4() { if (abs(posX - character4PosX) < 100) { if (char4State !== 'touch') { char4State = 'touch'; resetQuiz(4); } } else { char4State = 'stand'; } }
function checkCollision3() { char3State = (abs(posX - character3PosX) < 100) ? 'touch' : 'stand'; }
function drawCharacter() { let sheet = (state==='walk')?walkSheet:(state==='jump')?jumpSheet:standSheet; let fc = (state==='walk')?WALK_FRAMES:(state==='jump')?JUMP_FRAMES:STAND_FRAMES; drawSprite(sheet, sheet.width/fc, floor(frameCount/8)%fc, posX, posY, SCALE_FACTOR, direction); }
function drawCharacter2() { let fc = (char2State==='touch')?CHARACTER2_TOUCH_FRAMES:CHARACTER2_FRAMES; let sheet = (char2State==='touch')?character2TouchSheet:character2Sheet; drawSprite(sheet, sheet.width/fc, floor(frameCount/8)%fc, character2PosX, groundY, SCALE_FACTOR_2, (posX < character2PosX)?-1:1); }
function drawCharacter3() { let fc = (char3State==='touch')?CHARACTER3_TOUCH_FRAMES:CHARACTER3_FRAMES; let sheet = (char3State==='touch')?character3TouchSheet:character3Sheet; drawSprite(sheet, sheet.width/fc, floor(frameCount/8)%fc, character3PosX, groundY, SCALE_FACTOR_3, (posX < character3PosX)?-1:1); }
function drawCharacter4() { let fc = (char4State==='touch')?CHARACTER4_TOUCH_FRAMES:CHARACTER4_FRAMES; let sheet = (char4State==='touch')?character4TouchSheet:character4Sheet; drawSprite(sheet, sheet.width/fc, floor(frameCount/8)%fc, character4PosX, groundY, SCALE_FACTOR_4, (posX < character4PosX)?-1:1); }
function drawSprite(sheet, fw, idx, x, y, sc, dir) { if (!sheet || sheet.width === 0) return; push(); translate(x, y); scale(dir, 1); image(sheet, -fw*sc/2, -sheet.height*sc, fw*sc, sheet.height*sc, idx*fw, 0, fw, sheet.height); pop(); }
function updateUI_Position() { nameInput.position(width/2-110, height/2); nameButton.position(width/2+80, height/2); }
function drawNamingOverlay() { push(); fill(255, 230); rect(0,0,width,height); textAlign(CENTER); fill(0); textSize(24); text("請問您叫什麼名字？", width/2, height/2-40); pop(); }
function drawWelcomeOverlay() { push(); fill(255, 230); rect(0,0,width,height); textAlign(CENTER); fill(0); textSize(28); text(playerName + "，歡迎您！", width/2, height/2-20); pop(); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); resetPositions(); updateUI_Position(); }