import { WebSocketGateway, SubscribeMessage, WebSocketServer } from "@nestjs/websockets"
import { Socket } from "socket.io"

process.setMaxListeners(0);

@WebSocketGateway({ cors: true })
export class PonggameGateway {


    public canvas = {
        width: 800 as any,
        height: 400 as any
    }

    public rooms = [] as any;
    public alldata = [] as any;


    @WebSocketServer()
    server;

    edges(ball: any, idDuel: any) {
        if (ball.y > this.canvas.height - ball.radius) {
            ball.y = this.canvas.height - ball.radius;
            ball.vy *= -1;
        }
        if (ball.y < 0 + ball.radius) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }
        if (ball.x > this.canvas.width - ball.radius) {
            ball.x = this.canvas.width / 2;
            ball.y = this.canvas.height / 2;
            ball.vx *= -1;
            if (this.alldata[this.rooms.indexOf(idDuel)] && this.alldata[this.rooms.indexOf(idDuel)].players[0] && this.alldata[this.rooms.indexOf(idDuel)].players[1])
            {
                this.alldata[this.rooms.indexOf(idDuel)].points.left++;
                this.alldata[this.rooms.indexOf(idDuel)].players[0].emit("update_point", { idDuel: idDuel, points: this.alldata[this.rooms.indexOf(idDuel)].points, id: "left" });
                this.alldata[this.rooms.indexOf(idDuel)].players[1].emit("update_point", { idDuel: idDuel, points: this.alldata[this.rooms.indexOf(idDuel)].points, id: "left" });
            }
            //this.server.to(idDuel).emit("update_point", {points:this.alldata[this.rooms.indexOf(idDuel)].points, id:"left"});
        }
        if (ball.x < 0 + ball.radius) {
            ball.x = this.canvas.width / 2;
            ball.y = this.canvas.height / 2;
            ball.vx *= -1;
            if (this.alldata[this.rooms.indexOf(idDuel)] && this.alldata[this.rooms.indexOf(idDuel)].players[0] && this.alldata[this.rooms.indexOf(idDuel)].players[1])
            {
                this.alldata[this.rooms.indexOf(idDuel)].points.right++;
                this.alldata[this.rooms.indexOf(idDuel)].players[0].emit("update_point", { idDuel: idDuel, points: this.alldata[this.rooms.indexOf(idDuel)].points, id: "right" });
                this.alldata[this.rooms.indexOf(idDuel)].players[1].emit("update_point", { idDuel: idDuel, points: this.alldata[this.rooms.indexOf(idDuel)].points, id: "right" });
            }
            // this.server.to(idDuel).emit("update_point", {points:this.alldata[this.rooms.indexOf(idDuel)].points, id:"right"});
        }
        let left = ball.x - ball.radius,
            right = ball.x + ball.radius,
            top = ball.y - ball.radius,
            bottom = ball.y + ball.radius;

        let PLleft = this.alldata[this.rooms.indexOf(idDuel)].player_left.x,
            PLright = this.alldata[this.rooms.indexOf(idDuel)].player_left.x + this.alldata[this.rooms.indexOf(idDuel)].RECT_WIDTH,
            PLtop = this.alldata[this.rooms.indexOf(idDuel)].player_left.y,
            PLbottom = this.alldata[this.rooms.indexOf(idDuel)].player_left.y + this.alldata[this.rooms.indexOf(idDuel)].RECT_HEIGHT;

        let PRleft = this.alldata[this.rooms.indexOf(idDuel)].player_right.x,
            PRright = this.alldata[this.rooms.indexOf(idDuel)].player_right.x + this.alldata[this.rooms.indexOf(idDuel)].RECT_WIDTH,
            PRtop = this.alldata[this.rooms.indexOf(idDuel)].player_right.y,
            PRbottom = this.alldata[this.rooms.indexOf(idDuel)].player_right.y + this.alldata[this.rooms.indexOf(idDuel)].RECT_HEIGHT;

        if (left < PLright && right > PLleft && top < PLbottom && bottom > PLtop) {
            ball.vx *= -1;
        }

        if (left < PRright && right > PRleft && top < PRbottom && bottom > PRtop) {
            ball.vx *= -1;
        }
    }

    update(ball: any, idDuel: any) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        this.edges(ball, idDuel);
    }

    @SubscribeMessage('connection')
    connection(client: Socket, data: { idDuel: string, validate: boolean }) {

        client.join(data.idDuel);

        if (this.rooms.includes(data.idDuel) == false) {
            this.rooms.push(data.idDuel);
            this.alldata.push({
                players: [],
                loop: 0 as any,
                RECT_WIDTH: 20,
                RECT_HEIGHT: 60,
                player_left: {
                    x: 30 as any,
                    y: 200 as any
                },
                player_right: {
                    x: this.canvas.width - 30 as any,
                    y: 300 as any
                },
                points: {
                    left: 0,
                    right: 0
                },
                ball: {
                    x: 200,
                    y: 200,
                    radius: 50,
                    vx: 0.7,
                    vy: 0.7
                },
                NB_PLAYERS: 2,
                indexInTab: -1
            });
        }

        if (data.validate && this.alldata[this.rooms.indexOf(data.idDuel)].players.includes(client) == false) {
            this.alldata[this.rooms.indexOf(data.idDuel)].players.push(client);
            if (this.alldata[this.rooms.indexOf(data.idDuel)].indexInTab == 0) {
                let tmp = this.alldata[this.rooms.indexOf(data.idDuel)].players[1];
                this.alldata[this.rooms.indexOf(data.idDuel)].players[1] = this.alldata[this.rooms.indexOf(data.idDuel)].players[0];
                this.alldata[this.rooms.indexOf(data.idDuel)].players[0] = tmp;
                this.alldata[this.rooms.indexOf(data.idDuel)].indexInTab = -1;
            }
        }
        //

        client.on("game_won", (idDuel: any) => {
            client.leave(data.idDuel);
            if (this.alldata[this.rooms.indexOf(data.idDuel)] != undefined) {
                clearInterval(this.alldata[this.rooms.indexOf(data.idDuel)].loop);
                const index = this.rooms.indexOf(data.idDuel);
                this.alldata.splice(index, 1);
                this.rooms.splice(index, 1);
            }
        });

        client.emit("data", {
            canvas: this.canvas,
            rect_width: this.alldata[this.rooms.indexOf(data.idDuel)].RECT_WIDTH,
            rect_height: this.alldata[this.rooms.indexOf(data.idDuel)].RECT_HEIGHT
        });

        if (this.alldata[this.rooms.indexOf(data.idDuel)].players.length <= this.alldata[this.rooms.indexOf(data.idDuel)].NB_PLAYERS) {
            client.emit("position", [this.alldata[this.rooms.indexOf(data.idDuel)].player_left, this.alldata[this.rooms.indexOf(data.idDuel)].player_right]);
        }

        if (this.alldata[this.rooms.indexOf(data.idDuel)].players.length == this.alldata[this.rooms.indexOf(data.idDuel)].NB_PLAYERS) {
            if (this.alldata[this.rooms.indexOf(data.idDuel)].players[0] && this.alldata[this.rooms.indexOf(data.idDuel)].players[1])
            {
                this.alldata[this.rooms.indexOf(data.idDuel)].players[0].emit('youAre', "left");
                this.alldata[this.rooms.indexOf(data.idDuel)].players[1].emit('youAre', "right");
            }
            this.alldata[this.rooms.indexOf(data.idDuel)].loop = setInterval(() => {
                this.animate(data.idDuel);
            }, 1);
        }

        client.on("disconnect", () => {
            let index_player;
            if (this.alldata[this.rooms.indexOf(data.idDuel)])
                index_player = this.alldata[this.rooms.indexOf(data.idDuel)].players.indexOf(client);
            client.leave(data.idDuel);


            if (index_player != -1) {
                let isplaying = 0;

                if (index_player <= 1)
                    isplaying = 1;
                if (this.alldata[this.rooms.indexOf(data.idDuel)])
                {
                    this.alldata[this.rooms.indexOf(data.idDuel)].indexInTab = index_player;
                    this.alldata[this.rooms.indexOf(data.idDuel)].players.splice(index_player, 1);
                }
            }
            if (this.alldata[this.rooms.indexOf(data.idDuel)])
            {
                if (this.alldata[this.rooms.indexOf(data.idDuel)].players.length < this.alldata[this.rooms.indexOf(data.idDuel)].NB_PLAYERS && this.alldata[this.rooms.indexOf(data.idDuel)].loop != 0)
                    clearInterval(this.alldata[this.rooms.indexOf(data.idDuel)].loop);
            }
        });
    }

    @SubscribeMessage('move')
    move(client: Socket, data: { key: any, idDuel: any }) {
        if (this.alldata[this.rooms.indexOf(data.idDuel)] != undefined) {
            const index_player = this.alldata[this.rooms.indexOf(data.idDuel)].players.indexOf(client);
            const obj = [this.alldata[this.rooms.indexOf(data.idDuel)].player_left, this.alldata[this.rooms.indexOf(data.idDuel)].player_right];

            if (index_player != -1) {
                switch (data.key) {
                    case "ArrowUp":
                        obj[index_player].y -= 0.02 * this.canvas.height;
                        if (obj[index_player].y < 0)
                            obj[index_player].y = 0;
                        this.server.to(data.idDuel).emit("position", obj);
                        break;
                    case "ArrowDown":
                        obj[index_player].y += 0.02 * this.canvas.height;
                        if (obj[index_player].y > this.canvas.height - this.alldata[this.rooms.indexOf(data.idDuel)].RECT_HEIGHT)
                            obj[index_player].y = this.canvas.height - this.alldata[this.rooms.indexOf(data.idDuel)].RECT_HEIGHT;
                        this.server.to(data.idDuel).emit("position", obj);
                        break;
                }
            }
        }
    }

    animate(idDuel: any) {
        if (this.alldata[this.rooms.indexOf(idDuel)])
        {
            this.server.to(idDuel).emit("ball_position", this.alldata[this.rooms.indexOf(idDuel)].ball);
            this.update(this.alldata[this.rooms.indexOf(idDuel)].ball, idDuel);
        }
    }

}