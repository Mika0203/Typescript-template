class MapInfo {
    startPos = undefined;
    targetPos = undefined;
    obstacles = [];

    isThisObstacle = function (coordinates) {
        return this.obstacles.findIndex(e => e[0] === coordinates[0] && e[1] === coordinates[1]) === -1 ? false : true;
    }

    isThisStartPos = function (coordinates) {
        if(!this.startPos)
            return false;
        return this.startPos[0] === coordinates[0] && this.startPos[1] === coordinates[1];
    }

    isThisTargetPos = function (coordinates) {
        if(!this.targetPos)
            return false;
        return this.targetPos[0] === coordinates[0] && this.targetPos[1] === coordinates[1];
    }

    setStartPos(coordinates){
        this.startPos = coordinates; 
    }

    setTargetPos(coordinates){
        this.targetPos = coordinates;
    }

    setObstacle(coordinates){
        this.obstacles.push(coordinates)
    }

    removeObstacle(coordinates){
        this.obstacles = this.obstacles.filter(e => !(e[0] === coordinates[0] && e[1] === coordinates[1]));
    }

    removeAllObstacles(){
        this.obstacles = [];
    }
}

export default MapInfo