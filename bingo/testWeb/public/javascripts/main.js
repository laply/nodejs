var bingo = {
    is_my_turn: Boolean,
    socket: null,
    bingoNum: 0,
    bingoBoard: [],

    init: function(socket) {
        var self = this;
        var user_cnt = 0;
        var notEnoughUserMessage = " <알림> 최소 2명부터 게임이 가능합니다.";
        var gameIsEnd = false;
        this.is_my_turn = false;
        this.bingoNum = 0;
        this.bingoBoard = self.make_init_bingoBoard();

        $("#reset_button").hide();

        socket = io();

        socket.on("update_users", function(data, user_count) {
            console.log(data);
            user_cnt = user_count;
            self.update_userlist(data, socket);
        });

        socket.on("game_started", function(data) {
            console.log("enter the game started");
            self.print_msg(data.username + " 님이 게임을 시작했습니다.");
            $("#start_button").hide();
        });

        socket.on("check_number", function(data) {
            self.where_is_it(data.num);
            self.print_msg(data.username + "님이 '" + data.num + "'을 선택했습니다.");
        });

        socket.on("winner", function(name) {
            self.print_msg("<끝> winner is " + name);
            $("#reset_button").show();
            gameIsEnd = true;
        });

        socket.on("game_reset", function() {
            self.init();
        });

        var numbers = [];

        for (var i = 1; i <= 25; i++) {
            numbers.push(i);
        }

        numbers.sort(function(a, b) {
            var temp = parseInt(Math.random() * 10);
            var isOddOrEven = temp % 2;
            var isPosOrNeg = temp > 5 ? 1 : -1;
            return (isOddOrEven * isPosOrNeg);

        });

        $("table.bingo-board td").each(function() {
            $(this).html(numbers[i]);

            $(this).click(function() {
                if (gameIsEnd) {
                    self.print_msg("게임이 끝났습니다.");
                } else if (user_cnt == 1) {
                    self.print_msg(notEnoughUserMessage);
                } else {
                    self.select_num(this, socket);
                }
            });
        });

        $("#start_button").click(function() {
            if (user_cnt == 1) {
                self.print_msg(notEnoughUserMessage);
            } else {
                socket.emit('game_start', { username: $('#username').val() });
                Self.print_msg("<알림> 게임을 시작했습니다.");
                $("#start_button").hide();
            }
        });

        $("#reset_button").click(function() {
            socket.emit('game_reset');
        });

    },

    make_init_bingoBoard: function() {
        var bingoBoard = []
        for (var i = 0; i < 5; i++) {
            var row = [];
            for (var j = 0; j < 5; j++) {
                row.push(0);
            }
            bingoBoard.push(row);
        }
        return bingoBoard;
    },

    select_num: function(obj, socket) {
        if (this.is_my_turn && !$(obj).attr("checked")) {
            socket.emit("select", { username: $('#username').val(), num: $(obj).text() });
            this.check_num(obj);
            this.is_my_turn = false;
        } else {
            this.print_msg("<알림> 차례가 아닙니다!");
        }
    },

    where_is_it: function(num) {
        var self = this;
        var obj = null;

        $("table.bingo-board td").each(function(i) {
            if ($(this).text() == num) {
                self.check_num(this);
            }
        });
    },

    check_bingo: function(obj) {
        var pos = $(obj).attr("id").split(".");
        this.bingoBoard[pos[0]][pos[1]] = 1;
        var checkPoint = {
            column: 0,
            row: 0,
            diagonal1: 0,
            diagonal2: 0,
        }

        for (var i = 0; i < 5; i++) {
            if (this.bingoBoard[pos[0]][i] == 1) {
                checkPoint.column += 1;
            }

            if (this.bingoBoard[i][pos[1]] == 1) {
                checkPoint.row += 1;
            }

            if (pos[0] == pos[1]) {
                if (this.bingoBoard[i][i] == 1) {
                    checkPoint.diagonal1 += 1
                }
            }

            if (pos[0] + pos[1] == 4) {
                if (this.bingoBoard[i][4 - i] == 1) {
                    checkPoint.diagonal2 += 1
                }
            }
        }

        for (var data in checkPoint) {
            if (checkPoint[data] == 5) {
                this.bingoNum += 1;
            }
        }

        if (this.bingoNum == 3) {
            this.game_end();
        }
    },
    game_end: function() {
        socket.emit('game_end', { username: $('#username').val() });
    },

    check_num: function(obj) {
        $(obj).css("text-decoration", "line-through");
        $(obj).css("color", "lightgray");
        $(obj).attr("checked", true);
        this.check_bingo(obj);
    },

    update_userlist: function(data, this_socket) {
        var self = this;
        $("#list").empty();
        console.log(data);

        $.each(data, function(key, value) {
            var turn = "(-) ";
            if (value.turn === true) {
                turn = "(*) ";
                if (value.id == this_socket.id) {
                    self.is_my_turn = true;
                }
            }
            if (value.id == this_socket.id) {
                $("#list").append("<font color='DodgerBlue'>" + turn + value.name + "<br></font>");
            } else {
                $("#list").append("<font color='black'>" + turn + value.name + "<br></font>");
            }
        });
    },

    print_msg: function(msg) {
        $("#logs").append(msg + "<br />");
        $('#logs').scrollTop($('#logs')[0].scrollHeight);
    }
};

$(document).ready(function() {
    bingo.init();
});