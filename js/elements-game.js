/*jslint plusplus:true*/
/*global Audio*/
$(document).ready(function() {
    'use strict';
    var loopId,
        FPS = 40,
        DIRECTIONS = ['top', 'right', 'bottom', 'left'],
        $document = $(this),
        $game = $('#game'),
        // $clear = $('<div class="clear"></div>'),
        $blockL = $('<div class="block left"></div>'),
        $block = $('<div class="block"></div>'),
        $blockR = $('<div class="block right"></div>'),
        $blockTL = $('<div class="block top-left"></div>'),
        $blockT = $('<div class="block top"></div>'),
        $blockTR = $('<div class="block top-right"></div>'),
        $blockBR = $('<div class="block bottom-right"></div>'),
        $blockB = $('<div class="block bottom"></div>'),
        $blockBL = $('<div class="block bottom-left"></div>'),
        $blockFaceTL = $('<div class="block face top-left"></div>'),
        $blockFace = $('<div class="block face"></div>'),
        $blockFaceTR = $('<div class="block face top-right"></div>'),
        $blockFaceBL = $('<div class="block face bottom-left"></div>'),
        $blockFaceBR = $('<div class="block face bottom-right"></div>'),
        $item = $('<div class="item"></div>'),
        // $empty = $('<div class="empty"></div>'),
        $platform = $('<div class="platform"></div>'),
        $enemy = $('<div class="enemy"><div class="head"><div class="left-eye"></div><div class="right-eye"></div><div class="sheet"><div></div><div></div><div></div><div></div><div></div></div></div></div>'),
        $character = $('<div class="character"><div class="top-mouth"/><div class="bottom-mouth"/></div>'),
        $score = $('.score'),
        stepSize = 2,
        score = 0,
        // tableSize = {
        //     width: 220,
        //     height: 220
        // },
        blockSize = {
            width: 20,
            height: 20
        },
        keyCodes = {
            top: 38,
            right:39,
            bottom:40,
            left: 37
        },
        keysPressed = {
            top: false,
            right: false,
            bottom: false,
            left: false
        },
        enemyDirection = 'bottom',
        enemyMovement = {
            top: false,
            right: false,
            bottom: true,
            left: false
        },
        lastMove = 'top',
        moved = {
            top: false,
            right: false,
            bottom: false,
            left: false
        },
        lastCharacterDir,
        mapArray = [],
        sounds = {
            chomp: function() {
                var chomp = new Audio('./sounds/packman-credit.m4a');
                chomp.onend = function() {
                    chomp = null;
                };
                return chomp;
            }
        };

    function drawBox(rect) {
        $('<div/>').css({
            position: 'absolute',
            top: rect.top + 'px',
            width: (rect.right - rect.left + 1) + 'px',
            height: (rect.bottom - rect.top + 1) + 'px',
            left: rect.left + 'px'
        })
        .addClass('rule')
        .appendTo('#game');
    }

    // window.drawBox = drawBox;

    function renderMap() {
        var map = $.trim($('#map1').html()),
            mapLine = [],
            i,
            $element,
            col = 0,
            row = 0,
            size = {
                width: 20,
                height: 20
            },
            elementPos;

        for (i = 0; i < map.length; i = i + 1) {
            if (map[i].charCodeAt(0) === 10 && i > 0) {
                //$game.append($clear.clone());
                mapArray.push(mapLine);
                mapLine = [];
                row++;
                col = 0;
            } else {
                switch(map[i]) {
                    case '.':
                        $element = $item.clone();
                        size.width = 6;
                        size.height = 6;
                    break;
                    case '┌':
                        $element = $blockTL.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '┬':
                        $element = $blockT.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '─':
                    case '│':
                        $element = $block.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '┴':
                        $element = $blockB.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '┐':
                        $element = $blockTR.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '├':
                        $element = $blockL.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '┤':
                        $element = $blockR.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '┘':
                        $element = $blockBR.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '└':
                        $element = $blockBL.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '╔':
                        $element = $blockFaceTL.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '═':
                        $element = $blockFace.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '╗':
                        $element = $blockFaceTR.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '╚':
                        $element = $blockFaceBL.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    case '╝':
                        $element = $blockFaceBR.clone();
                        size.width = blockSize.width;
                        size.height = blockSize.height;
                    break;
                    // case 'B':
                    //     $element = $block.clone();
                    //     size.width = blockSize.width;
                    //     size.height = blockSize.height;
                    // break;
                    // case 'x':
                    //     // $element = $enemy.clone();
                    //     $element = $enemy;
                    //     size.width = 20;
                    //     size.height = 20;
                    // break;
                    // case '*':
                    //     $element = $item.clone();
                    // break;
                    // case '_':
                    //     $element = $platform.clone();
                    //     size.width = 20;
                    //     size.height = 20;
                    // break;
                    default:
                        $element = null;
                }

                elementPos = {};
                elementPos.top = (row + 0.5) * blockSize.height - size.height * 0.5;
                elementPos.left = (col + 0.5) * blockSize.width - size.width * 0.5;
                elementPos.bottom = elementPos.top + size.height - 1;
                elementPos.right = elementPos.left + size.width - 1;

                if ($element) {
                    $element.css({
                        top: elementPos.top,
                        left: elementPos.left
                    });

                    $game.append($element);
                }

                mapLine.push({type: map[i], $element: $element, position: elementPos});

                col++;
            }
        }

        $game.outerWidth(blockSize.width * mapArray[0].length);
        $game.outerHeight(blockSize.height * mapArray.length);


        $character.css({
            width: blockSize.width,
            height: blockSize.height,
            top: 23 * blockSize.height,
            left: 7 * blockSize.width
        });

        $enemy.css({
            top: 13 * blockSize.height,
            left: 7 * blockSize.width
        });

        $game
            .append($character)
            .append($enemy);
    }
    
    // function hitTestPoint(point, rect) {
    //     return (point.left >= rect.left && point.left <= rect.right &&
    //             point.top >= rect.top && point.top <= rect.bottom );
    // }

    // function hitTestBox(rect1, rect2) {
    //     if (rect2.right - rect1.left < 0 ||
    //         rect2.bottom - rect1.top < 0 ||
    //         rect1.right - rect2.left < 0 ||
    //         rect1.bottom - rect2.top < 0) {
    //         return false;
    //     }

    //     return true;

    // }

    function hitTestBox(rect1, rect2) {
        var horizontalNoHit = rect1.right - rect2.left < 0 || rect2.right - rect1.left < 0,
            verticalNoHit = rect1.bottom - rect2.top < 0 || rect2.bottom - rect1.top < 0,
            hits = {
                top: false,
                right: false,
                bottom: false,
                left: false
            };

        if (horizontalNoHit || verticalNoHit) {
            hits.hit = false;
        } else {
            hits.hit = true;

            hits.right = rect1.right > rect2.right;
            hits.left = rect1.left < rect2.left;

            hits.bottom = rect1.bottom > rect2.bottom;
            hits.top = rect1.top < rect2.top;
        }

        return hits;
    }

    function processHit(row, col) {
        var item = mapArray[row][col],
            $element = item.$element;

        switch(item.type.toLowerCase()) {
            case '.':
                score++;
                $score.html(score);
                // sounds.chomp().play();
                // mapArray[row].splice(col, 1);
                item.ignore = true;
                $element.remove();
                return false;
        }

        return true;
    }

    // TODO - Make this method return what sides were hit
    function hitTestMap(characterRect) {
        var hit = false,
            rowIndex, colIndex,
            hits,
            item,
            startHitTestPos = {
                col: Math.floor((characterRect.left + blockSize.width / 2) / blockSize.width) - 1,
                row: Math.floor((characterRect.top + blockSize.height / 2 ) / blockSize.height) - 1
            };

        // $('.block, .item').removeClass('hit');

        for (rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (colIndex = 0; colIndex < 3; colIndex++) {

                item = mapArray[startHitTestPos.row + rowIndex][startHitTestPos.col + colIndex];
                if (!item.ignore && item.type !== ' ') {
                    
                    // if (item.$element) {
                    //     item.$element.addClass('hit');
                    // }
                    // $('.rule').remove();
                    // drawBox(item.position);

                    hits = hitTestBox(item.position, characterRect);
                    if (hits.hit) {
                        hit = hit || processHit(startHitTestPos.row + rowIndex, startHitTestPos.col + colIndex);
                        // return hit;
                    }
                }

            }
        }

        return hit;
    }

    function cloneRect(rect) {
        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left
        };
    }

    // function compareRects(rect1, rect2) {
    //     return (rect1.top === rect2.top) && 
    //             (rect1.right === rect2.right) && 
    //             (rect1.bottom === rect2.bottom) && 
    //             (rect1.left === rect2.left);
    // }

    function handleKeys(e) {
        // Pacman movement like
        if (e.type === 'keyup') {
            return;
        }
        // Pacman movement like

        switch(e.keyCode) {
            case keyCodes.top:
                if (!keysPressed.top) {
                    keysPressed.top = e.type === 'keydown';
                    keysPressed.bottom = false; // Pacman movement like
                }
            break;
            case keyCodes.right:
                if (!keysPressed.right) {
                    keysPressed.right = e.type === 'keydown';
                    keysPressed.left = false; // Pacman movement like
                }
            break;
            case keyCodes.bottom:
                if (!keysPressed.bottom) {
                    keysPressed.bottom = e.type === 'keydown';
                    keysPressed.top = false; // Pacman movement like
                }
            break;
            case keyCodes.left:
                if (!keysPressed.left) {
                    keysPressed.left = e.type === 'keydown';
                    keysPressed.right = false; // Pacman movement like
                }
            break;
            default:
        }
    }

    function translateRect(rect, x, y) {
        rect.top += y;
        rect.right += x;
        rect.bottom += y;
        rect.left += x;
        return rect;
    }


    function changeEnemyDirection(enemyRect, characterPos) {
        var newMovement = cloneRect(enemyMovement), // should be kind of cloneMovement instead
            characterDir;

        if (enemyRect.top < characterPos.top) {
            newMovement.bottom = true;
            newMovement.top = false;
            characterDir = 'S';
        } else if (enemyRect.top > characterPos.top) {
            newMovement.top = true;
            newMovement.bottom = false;
            characterDir = 'N';
        }

        if (enemyRect.left < characterPos.left) {
            newMovement.right = true;
            newMovement.left = false;
            characterDir += 'E';
        } else if (enemyRect.left > characterPos.left) {
            newMovement.left = true;
            newMovement.right = false;
            characterDir += 'W';
        }

        if (lastCharacterDir !== characterDir) {
            lastCharacterDir = characterDir;
            // enemyMovement = newMovement;
        }

        return newMovement;
    }

    function turnRight(direction) {
        if (direction === 'top') {
            return 'right';
        }

        if (direction === 'right') {
            return 'bottom';
        } 

        if (direction === 'bottom') {
            return 'left';
        }

        return 'top';
    }

    function findWay(enemyRect) {
        var skipDirection1,
            skipDirection2,
            movements = {
                top: translateRect(cloneRect(enemyRect), 0, -stepSize),
                right: translateRect(cloneRect(enemyRect), stepSize, 0),
                bottom: translateRect(cloneRect(enemyRect), 0, stepSize),
                left: translateRect(cloneRect(enemyRect), -stepSize, 0)
            },
            movementHitTests = {
                top: hitTestMap(movements.top),
                right: hitTestMap(movements.right),
                bottom: hitTestMap(movements.bottom),
                left: hitTestMap(movements.left)
            },
            characterDirection = changeEnemyDirection(enemyRect, $character.position()),
            i,
            direction;

        for (i = 0; i < DIRECTIONS.length; i++) {
            direction = DIRECTIONS[i];

            if (enemyDirection === direction) {

                if (direction === 'top' || direction === 'bottom') {
                    skipDirection1 = 'left';
                    skipDirection2 = 'right';
                } else {
                    skipDirection1 = 'top';
                    skipDirection2 = 'bottom';
                }

                if (!movementHitTests[skipDirection1] && characterDirection[skipDirection1]) {
                    enemyDirection = skipDirection1;
                    lastMove = skipDirection1;
                    return movements[skipDirection1];
                }

                if (!movementHitTests[skipDirection2] && characterDirection[skipDirection2]) {
                    enemyDirection = skipDirection2;
                    lastMove = skipDirection2;
                    return movements[skipDirection2];
                }
                
                if (!movementHitTests[direction]) {
                    lastMove = direction;
                    return movements[direction];
                }
            }
        }

        return null;
    }

    function moveEnemy() {
        var position = $enemy.position(),
            enemyRect = { //TODO Put this into a object
                top: position.top,
                right: position.left + $enemy.outerWidth() - 1,
                bottom: position.top + $enemy.outerHeight() - 1,
                left: position.left
            },
            enemyMove = findWay(enemyRect);

        if (enemyMove) {
            $enemy.css({
                top: enemyMove.top,
                left: enemyMove.left
            });
        } else {
            enemyDirection = turnRight(enemyDirection);
        }
    }

    function checkHitEnemy() {
        var enemyPos = $enemy.position(),
            characterPos = $character.position(),
            enemyRect = {
                top: enemyPos.top,
                right: enemyPos.left + $enemy.outerWidth() - 1,
                bottom: enemyPos.top + $enemy.outerHeight() - 1,
                left: enemyPos.left
            },
            characterRect = {
                top: characterPos.top,
                right: characterPos.left + $character.outerWidth() - 1,
                bottom: characterPos.top + $character.outerHeight() - 1,
                left: characterPos.left
            };


        if (hitTestBox(enemyRect, characterRect).hit) {
            $('#gameOver').addClass('flip');
            clearInterval(loopId);
        }
    }

    function gameLoop() {
        var position = $character.position(),
            characterRect = { //TODO Put this into a object
                top: position.top,
                right: position.left + $character.outerWidth() - 1,
                bottom: position.top + $character.outerHeight() - 1,
                left: position.left
            },
            newCharacterRect;

        moveEnemy();
        checkHitEnemy();

        if (keysPressed.top) {
            newCharacterRect = cloneRect(characterRect);
            newCharacterRect.top -= stepSize;
            newCharacterRect.bottom -= stepSize;
            if (!hitTestMap(newCharacterRect)) {
                moved.top = true;
                characterRect = newCharacterRect;
                $character.removeClass('top right bottom left').addClass('top');
            } else {
                if (moved.top) {
                    moved.top = false;
                    keysPressed.top = false; // Pacman movement like
                }
            }
        }

        if (keysPressed.right) {
            newCharacterRect = cloneRect(characterRect);
            newCharacterRect.left += stepSize;
            newCharacterRect.right += stepSize;
            if (!hitTestMap(newCharacterRect)) {
                moved.right = true;
                characterRect = newCharacterRect;
                $character.removeClass('top right bottom left').addClass('right');
            } else {
                if (moved.right) {
                    moved.right = false;
                    keysPressed.right = false; // Pacman movement like
                }
            }
        }

        if (keysPressed.bottom) {
            newCharacterRect = cloneRect(characterRect);
            newCharacterRect.top += stepSize;
            newCharacterRect.bottom += stepSize;
            if (!hitTestMap(newCharacterRect)) {
                $character.removeClass('top right bottom left').addClass('bottom');
                moved.bottom = true;
                characterRect = newCharacterRect;
            } else {
                if (moved.bottom) {
                    moved.bottom = false;
                    keysPressed.bottom = false; // Pacman movement like
                }
            }
        }

        if (keysPressed.left) {
            newCharacterRect = cloneRect(characterRect);
            newCharacterRect.left -= stepSize;
            newCharacterRect.right -= stepSize;
            if (!hitTestMap(newCharacterRect)) {
                $character.removeClass('top right bottom left').addClass('left');
                moved.left = true;
                characterRect = newCharacterRect;
            } else {
                if (moved.left) {
                    moved.left = false;
                    keysPressed.left = false; // Pacman movement like
                }
            }
        }

        $character.css({
            top: characterRect.top,
            left: characterRect.left
        });

    }

    function init() {
        $document.on('keydown keyup', handleKeys);
        renderMap();
        loopId = setInterval(gameLoop, 1000 / FPS);
    }

    init();
});