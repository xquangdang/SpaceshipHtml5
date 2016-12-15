// Main type of the game
function Game() {
    var stage;
    var contentManager;
    var game;
    var keyboardHandler;
    var mouseHelper;
    var event;

    var ship;

    var world;
    var gameStage;

    if(game === undefined || game === null)
    {
        game = this;
    }

    Game.prototype.resizeToFullWidthCanvas_ = function () {
        var browserW = $(window).width();//window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth);// $(window).innerWidth();
        var browserH = $(window).height();//window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight);//$(window).innerHeight();

        console.log('Width: ' + browserW + '  Height: ' + browserH);

        stage.canvas.width = browserW;
        stage.canvas.height = browserH;

        //vi tri canh center top.
        gameStage.x = browserW/2;
        gameStage.y = browserH/2;

        var zoom = browserH/900;
        gameStage.scaleX = zoom;
        gameStage.scaleY = zoom;

        gameStage.calcLocalPosition = function (stageX, stageY){
            x = (stageX - this.x) / this.scaleX;
            y = (stageY - this.y) / this.scaleY;
            return {"x":x, "y":y};
        };
    };

    var resizeTimeout = null;
    Game.prototype.resizeToFullWidthCanvas = function () {
        if (resizeTimeout)
            clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout("game.resizeToFullWidthCanvas_()", 100);
    };

    Game.prototype.init = function () {
        var canvas = document.getElementById('gameCanvas');
        stage = new createjs.Stage(canvas);
        keyboardHandler = new KeyboardHandler();
        mouseHelper = new MouseHelper(canvas);

        Global.getInstance().stage = stage;
        Global.getInstance().mouseHelper = mouseHelper;

        //init gamestage
        gameStage = new createjs.Container();
        stage.addChild(gameStage);


        //init world
        world = new World();
        gameStage.addChild(world);

        world.initWorld();

        game.resizeToFullWidthCanvas_();
        game.resizeToFullWidthCanvas();
        window.addEventListener('resize', game.resizeToFullWidthCanvas, false);

        document.onkeydown = function () {
            event = window.event;
        }

        document.onkeyup = function () {
            event = null;
        }

        contentManager = new ContentManager(stage, 800, 480);
        contentManager.SetDownloadCompleted(game.StartGame);
        contentManager.StartDownload();
    };


    // function initWorld(){
    //     world.MakeCameraAroundShip = function (x,y) {
    //         var browserW = $(window).innerWidth();
    //         var browserH = $(window).innerHeight();
    //         if (ship.x > -2000 && ship.x < 2000) {
    //             world.x = -ship.x;
    //         }
    //         if (ship.y > -2000 && ship.y < 2000) {
    //             world.y = -ship.y;
    //         }
    //     };
    //     world.screenPos2WorldPos =function(x,y){
    //
    //     }
    //     world.worldPos2ScreenPos =function(x,y){
    //
    //     }
    //
    //     addWorldGrid();
    // }


    function addWorldGrid(){
        var worldLine = new createjs.Shape();

        var g = worldLine.graphics;
        g.clear();
        g.setStrokeStyle(1);
        g.beginStroke("#007300");

        for (var i = -WORLD_SIZE_PIXEL / 2; i <= WORLD_SIZE_PIXEL / 2; i+=500){
            g.moveTo(-WORLD_SIZE_PIXEL / 2, i);	//nose
            g.lineTo(WORLD_SIZE_PIXEL / 2, i);	//rfin

            g.moveTo(i, -WORLD_SIZE_PIXEL / 2);	//nose
            g.lineTo(i, WORLD_SIZE_PIXEL / 2);	//rfin
        }

        g.closePath(); // nose
        world.addChild(worldLine);
        //world.cache(-2000,-2000, 4000, 4000);
    }

    //Equivalent of Update() methods of XNA
    Game.prototype.update = function (event){
        //console.log(event.delta/1000);
        //console.log(mouseHelper.getMousePos());
        //inputHandler.handleKeyUp(event);
        ship.update(event);
        world.update(event);
        stage.update();
    };

    //Starting of the game
    Game.prototype.StartGame = function () {
        console.log('game start');

        var pieceData = initShipData();
        ship = new Ship(pieceData);
        world.addShip(ship);
        //ship.initialize(pieceData);
        //ship.x = 0;
        //ship.y = 0;

        // we want to do some work before we update the canvas,
        // otherwise we could use Ticker.addListener(stage);
        createjs.Ticker.addEventListener('tick', game.update);
        // Targeting 60 FPS
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(60);
    };

    function initShipData() {
        var piecesData = [];
        var typePiece;
        var arr;
        for (var i = -3; i < 3; i++) {
            for (var j = -2; j < 2; j++) {
                if (i != 0 || j != 0) {
                    if ((i + j) % 2 == 0) {
                        typePiece = Math.floor(Math.random() * 5) + 1;
                        arr = {'x' : i * 2, 'y' : j, 'type' : typePiece};
                        piecesData.push(arr);
                    }

                }else {
                    arr = {'x' : i * 2, 'y' : j, 'type' : 6};
                    piecesData.push(arr);
                }

            }
        }
        console.log(piecesData);
        return piecesData;
    }
}