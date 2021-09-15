import { WebSocketGateway, SubscribeMessage, WebSocketServer } from "@nestjs/websockets"
import { Socket } from "socket.io"

@WebSocketGateway({cors: true})
export class PonggameGateway {
    public players = [];
    public loop = 0 as any;
    public NB_PLAYERS = 2 as any;

    public RECT_WIDTH = 20;
    public RECT_HEIGHT = 60;
    
    public canvas = {
        width: 1280 as any,
        height: 720 as any
    } as any;
    
    public player_left: any = {
        x: 30 as any,
        y: 200 as any
    };
    
    public player_right: any = {
        x: this.canvas.width - 30 as any,
        y: 300 as any
    };
    
    public points = {
        left: 0,
        right: 0
    };
    
    public ball = {
        x: 200,
        y: 200,
        radius: 50,
        vx: 0.7,
        vy: 0.7
    };

    @WebSocketServer()
    server;

    edges(ball) {
        if (ball.y > this.canvas.height - ball.radius) {
            ball.y = this.canvas.height - ball.radius;
            ball.vy *= -1;
        }
        if (ball.y < 0 + ball.radius) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }
        if (ball.x > this.canvas.width -    ball.radius) {
            ball.x = this.canvas.width / 2;
            ball.y = this.canvas.height / 2;
            ball.vx *= -1;
            this.points.left++;
            this.server.emit("update_point", this.points);
        }
        if (ball.x < 0 + ball.radius) {
            ball.x = this.canvas.width / 2;
            ball.y = this.canvas.height / 2;
            ball.vx *= -1;
            this.points.right++;
            this.server.emit("update_point", this.points);
        }
        let left = ball.x - ball.radius,
            right = ball.x + ball.radius,
            top = ball.y - ball.radius,
            bottom = ball.y + ball.radius;
    
        let PLleft = this.player_left.x,
            PLright = this.player_left.x + this.RECT_WIDTH,
            PLtop = this.player_left.y,
            PLbottom = this.player_left.y + this.RECT_HEIGHT;
    
        let PRleft = this.player_right.x,
            PRright = this.player_right.x + this.RECT_WIDTH,
            PRtop = this.player_right.y,
            PRbottom = this.player_right.y + this.RECT_HEIGHT;
    
        if (left < PLright && right > PLleft && top < PLbottom && bottom > PLtop) {
            ball.vx *= -1;
        }
    
        if (left < PRright && right > PRleft && top < PRbottom && bottom > PRtop) {
            ball.vx *= -1;
        }
    }

    update(ball) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        this.edges(ball);
    }

    @SubscribeMessage('connection')
    connection(client:Socket, data: {idDuel: string}) {
        this.players.push(client);

        client.on("game_won", () => {
            clearInterval(this.loop);
        });

        client.emit("data", {
            canvas: this.canvas,
            rect_width: this.RECT_WIDTH,
            rect_height: this.RECT_HEIGHT
        });


        if (this.players.length <= this.NB_PLAYERS) {
            client.emit("position", [this.player_left, this.player_right]);
        }

        if (this.players.length == this.NB_PLAYERS) {
            this.loop = setInterval(() => {
                this.animate();
            }, 3);
        }
    }

    handleDisconnect(client: Socket) {
        console.log("* DISCONNECT * (game.ts)");
        const index_player = this.players.indexOf(client);

        if (index_player != -1) {
            let isplaying = 0;

            if (index_player <= 1)
                isplaying = 1;
            this.players.splice(index_player, 1);
            console.log("Nombre de joueurs = " + this.players.length);
            if (this.players.length < this.NB_PLAYERS && this.loop != 0)
                clearInterval(this.loop);
        }
    }

    @SubscribeMessage('move')
    move(client:Socket, key: any) {
        const index_player = this.players.indexOf(client);
        const obj = [this.player_left, this.player_right];

        if (index_player != -1) {
            switch (key) {
                case "ArrowUp":
                    obj[index_player].y -= 0.02 * this.canvas.height;
                    if (obj[index_player].y < 0)
                        obj[index_player].y = 0;
                    this.server.emit("position", obj);
                    break;
                case "ArrowDown":
                    obj[index_player].y += 0.02 * this.canvas.height;
                    if (obj[index_player].y > this.canvas.height - this.RECT_HEIGHT)
                        obj[index_player].y = this.canvas.height - this.RECT_HEIGHT;
                        this.server.emit("position", obj);
                    break;
            }
        }
    }

    animate() {
        this.server.emit("ball_position", this.ball);
        this.update(this.ball);
    }

}