import MapInfo from "./MapInfo.js";

class Board {
    constructor($target) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.interval = 30;
        this.mapInfo = new MapInfo();

        document.body.appendChild(this.canvas);

        this.canvasResize();
        this.timeout = undefined;

        window.addEventListener("resize", () => {
            this.timeout && clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.canvasResize();
            }, 500);
        });

        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        }, false);

        window.addEventListener('mousedown', (e) => {
            console.log(e.button);
            if (e.button === 2) {
                this.isBuildObstacle = !this.mapInfo.isThisObstacle(this.convertCoordinates(e.x, e.y))
                this.isRightButtonDown = true;
                const coordinates = this.convertCoordinates(e.x, e.y);

                if (this.isBuildObstacle) {
                    if (this.mapInfo.isThisObstacle(coordinates) ||
                        !this.setPos(coordinates, "obstacles") ||
                        this.mapInfo.isThisTargetPos(coordinates) ||
                        this.mapInfo.isThisStartPos(coordinates)) {
                        return;
                    }
                    this.drawBox(coordinates, "gray");
                }
                else {
                    if (!this.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, "none"))
                        return;
                    this.drawBox(coordinates, "none");
                }
            }
        })

        window.addEventListener("mousemove", (e) => {
            if (this.isRightButtonDown) {
                const coordinates = this.convertCoordinates(e.x, e.y);

                if (this.isBuildObstacle) {
                    if (this.mapInfo.isThisObstacle(coordinates) || 
                        !this.setPos(coordinates, "obstacles") || 
                        this.mapInfo.isThisTargetPos(coordinates) ||
                        this.mapInfo.isThisStartPos(coordinates)) {
                        return;
                    }
                    this.drawBox(coordinates, "gray");
                }
                else {
                    if (!this.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, "none"))
                        return;
                    this.drawBox(coordinates, "none");

                }

            }
        })

        window.addEventListener('mouseup', (e) => {
            if (e.button === 2)
                this.isRightButtonDown = false;

            if (e.button !== 0)
                return;

            const coordinates = this.convertCoordinates(e.x, e.y);
            if (!this.setPos(coordinates, this.nextType ? "startPos" : "targetPos"))
                return;
            this.nextType = !this.nextType;
            this.clearBoard();
        })
    }

    clearBoard() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        this.context.clearRect(0, 0, width, height);
        this.drawBoard();
    }

    drawBox(coordinates, color) {
        let ctx = this.context;
        let interval = this.interval;
        ctx.beginPath();
        if (color !== 'none') {
            ctx.fillStyle = color;
            ctx.lineWidth = "1";

            ctx.fillRect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval);
            ctx.rect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval)
            ctx.stroke();
        }
        else {
            ctx.lineWidth = "1";
            ctx.clearRect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval);
            ctx.rect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval)
            ctx.stroke();
        }
    }

    setPos(coordinates, setType) {
        switch (setType) {
            case "startPos":
                this.mapInfo.setStartPos(coordinates);
                return true;
            case "targetPos":
                this.mapInfo.setTargetPos(coordinates);
                return true;
            case "obstacles":
                this.mapInfo.setObstacle(coordinates);
                return true;
            case "none":
                this.mapInfo.removeObstacle(coordinates);
                return true;
            default :
                return
        }
    }

    convertCoordinates = (x, y) => {
        return [Math.floor(x / this.interval), Math.floor(y / this.interval)];
    }

    canvasResize() {
        let width = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth;
        let height = document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight;

        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.drawBoard();
    };


    drawBoard() {

        let ctx = this.canvas.getContext('2d');
        let width = this.canvas.width;
        let height = this.canvas.height;
        let interval = this.interval;

        // Y
        for (let i = 0; i < width; i += interval) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        // X
        for (let i = 0; i < height; i += interval) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        this.mapInfo.startPos && this.drawBox(this.mapInfo.startPos, "red");
        this.mapInfo.targetPos && this.drawBox(this.mapInfo.targetPos, "blue");
        this.mapInfo.obstacles.length > 0 &&
            this.mapInfo.obstacles.map((e) => this.drawBox(e, "gray"))

        if (false) {
            let node = this.props.searched.findedNode;
            this.props.searched.closedList.map((e) => this.drawBox([e.x, e.y], "rgba(0,0,255,0.3)"));
            this.props.searched.openList.map((e) => this.drawBox([e.x, e.y], "rgba(255,0,255,0.3)"));


            // Text -------------------------
            ctx.beginPath();
            this.props.searched.closedList.map((e) => {
                ctx.fillText("G : " + e.g,
                    e.x * this.interval,
                    e.y * this.interval + this.interval * 0.5 + 10)
                ctx.fillText("H : " + e.h,
                    e.x * this.interval,
                    e.y * this.interval + this.interval * 0.5 + 20)
                ctx.fillText("F : " + e.f,
                    e.x * this.interval,
                    e.y * this.interval + this.interval * 0.5)
            })
            ctx.stroke();
            // -----------------------------------------

            // Line -------------------------------------
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "yellow"
            ctx.moveTo(
                node.x * this.interval + this.interval * 0.5,
                node.y * this.interval + this.interval * 0.5)
            while (node.parent) {
                ctx.lineTo(
                    node.x * this.interval + this.interval * 0.5,
                    node.y * this.interval + this.interval * 0.5);
                node = node.parent;
            }
            ctx.lineTo(
                node.x * this.interval + this.interval * 0.5,
                node.y * this.interval + this.interval * 0.5)
            ctx.stroke();
            // Line -------------------------------------
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1;
        }
    }
}

export default Board


// class Board extends React.Component {
//     constructor(props) {
//         super(props);
//         this.isRightButtonDown = false;
//         this.isBuildObstacle = true;

//         this.nextType = true;
//         this.canvas = createRef();
//         this.canvasResize = this.canvasResize.bind(this);
//         this.drawBoard = this.drawBoard.bind(this);
//         this.drawBox = this.drawBox.bind(this);
//     }

//     componentDidMount() {
//         this.canvasResize();
//         this.drawBoard();
//         let timeout = undefined;


//         this.canvas.current.addEventListener('contextmenu', function (e) {
//             e.preventDefault();
//         }, false);

//         this.canvas.current.addEventListener("mousedown", (e) => {
//             if (e.button === 2) {
//                 this.isBuildObstacle = !this.mapInfo.isThisObstacle(this.convertCoordinates(e.x, e.y))
//                 this.isRightButtonDown = true;
//                 const coordinates = this.convertCoordinates(e.x, e.y);

//                 if (this.isBuildObstacle) {
//                     if (this.mapInfo.isThisObstacle(coordinates) || 
//                         !this.setPos(coordinates, "obstacles") || 
//                         this.mapInfo.isThisTargetPos(coordinates) ||
//                         this.mapInfo.isThisStartPos(coordinates)) {
//                         return;
//                     }
//                     this.drawBox(coordinates, "gray");
//                 }
//                 else {
//                     if (!this.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, "none"))
//                         return;
//                     this.drawBox(coordinates, "none");

//                 }
//             }
//         })

//         this.canvas.current.addEventListener("mousemove", (e) => {
//             if (this.isRightButtonDown) {
//                 const coordinates = this.convertCoordinates(e.x, e.y);

//                 if (this.isBuildObstacle) {
//                     if (this.mapInfo.isThisObstacle(coordinates) || 
//                         !this.setPos(coordinates, "obstacles") || 
//                         this.mapInfo.isThisTargetPos(coordinates) ||
//                         this.mapInfo.isThisStartPos(coordinates)) {
//                         return;
//                     }
//                     this.drawBox(coordinates, "gray");
//                 }
//                 else {
//                     if (!this.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, "none"))
//                         return;
//                     this.drawBox(coordinates, "none");

//                 }

//             }
//         })


//     }



  

//     }





//     



//     render() {
//         this.canvasResize();
//         this.drawBoard();
//         return <canvas ref={this.canvas} />
//     }
// }
