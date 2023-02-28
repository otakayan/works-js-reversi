    
    let Flag=false;       // 白黒手番フラグ
    let M=new Array(10);  // 盤面情報配列 10行の理由→判定のために駒がない状況を作る
    const body=document.querySelector("#reversi"); //body取得
    function computer()  // コンピュータの手関数
    {
        let y,x,n,obj,ban;
        for (let i=0;i<500;i++){ //500には特に意味なし
            y=Math.floor(Math.random()*8)+1; //縦軸のランダム
            x=Math.floor(Math.random()*8)+1; //横軸のランダム
            n=(y-1)*8+(x-1); //nは0~63のマス目　どの駒が選ばれたか
            obj=document.getElementById("img"+n); //
            ban=document.getElementById("img64"); //
            ban.src="white.jpg"; //
            if (M[y][x]==0 && ok(y,x)){ //M[y][x]==0→緑 1→白　2→黒　緑の状態で「かつ」置けるなら
                obj.src="black.jpg"; //黒の手番に
                M[y][x]=2;
                reverse(y,x); //reverse関数
                Flag=!Flag;
                return;
            }
        }
        Flag=!Flag;  // 手が見つからなければ相手に手を渡す
    }
    function reverse(y,x)  // 自動反転関数
    {
        let n,obj;
        for (let dx=-1;dx<=1;dx++){ //3回のループ　置いた位置から周囲８マスの判定のため
            for (let dy=-1;dy<=1;dy++){ //3回のループ　置いた位置から周囲８マスの判定のため
                if (!(dx==0 && dy==0) && M[y][x]!=M[y+dy][x+dx]){ //置いた場所？
                    let ry=y,rx=x; //逃がしておく
                    while (1<=rx && rx<=8 && 1<=ry && ry<=8 && M[ry][rx]!=0){
                        ry+=dy;rx+=dx;
                        if (M[y][x]==M[ry][rx]){  // 同じ色の駒
                            ry-=dy;rx-=dx;        // 1つ戻す 
                            while (!(x==rx && y==ry)){ //戻りながらひっくり返す
                                n=(ry-1)*8+(rx-1);
                                obj=document.getElementById("img"+n);
                                if (M[ry][rx]==1){  // 白なら黒に
                                    obj.src="black.jpg";
                                    M[ry][rx]=2;
                                }
                                else {              // 黒なら白に
                                    obj.src="white.jpg";
                                    M[ry][rx]=1;
                                }
                                ry-=dy;rx-=dx;      // 逆戻り
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    function ok(y,x)  // 置けるか調べる関数
    {
        if (Flag)
            M[y][x]=2;  // 黒を置く　仮置き
        else
            M[y][x]=1;  // 白を置く　仮置き
        for (let dx=-1;dx<=1;dx++){ //3回のループ　置いた位置から周囲８マスの判定のため　左上から始まって右にずれる
            for (let dy=-1;dy<=1;dy++){ //3回のループ　置いた位置から周囲８マスの判定のため　左上から始まって下にずれる
                if (!(dx==0 && dy==0) && M[y][x]!=M[y+dy][x+dx]){ //置いた場所でない　かつ　対象のマスが自分の色でない場合
                    let rx=x,ry=y;
                    while (1<=rx && rx<=8 && 1<=ry && ry<=8 && M[ry][rx]!=0 ){ //8x8のマス内　かつ　緑のマスでない場合
                        rx+=dx;
                        ry+=dy;
                        if (M[y][x]==M[ry][rx]){  // 同じ色の駒に出会ったとき
                            return true;
                        }
                    }
                }
            }
        }
        M[y][x]=0;  // 駒のない状態に戻す
        return false;
    }
    function arrayinit()  // 配列初期化関数
    {
        for (let i=0;i<10;i++){
            M[i]=new Array(10);  // ２次元配列にする{
            for (let j=0;j<10;j++){
                    M[i][j]=0;    // 駒無し
            }
        }
        M[4][4]=1;M[5][5]=1;  // 白駒
        M[4][5]=2;M[5][4]=2;  // 黒駒
    }
    function yx(event)  // クリックイベント処理関数 userの手番関数
    {
        let y,x,n,obj,ban;
        y=Math.floor((event.clientY-170)/50); //ユーザーのクリックでブレがあるためMath.floorで切り捨て headerのheightをマイナス
        x=Math.floor((event.clientX-150)/50); //ユーザーのクリックでブレがあるためMath.floorで切り捨て
        n=(y-1)*8+(x-1); //id番号を得る
        obj=document.getElementById("img"+n); //nは0~63でマス目の位置
        ban=document.getElementById("img64"); //img64は手番の画像をさす
        if (M[y][x]==0 && ok(y,x)) { //M[y][x]==0→緑
            obj.src="white.jpg";
            M[y][x]=1;
            reverse(y,x);
            Flag=!Flag;
            ban.src="black.jpg";
            setTimeout("computer()",1000);  // コンピュータの手
        }
    }
    function init()  // 盤面初期化関数
    {
        let img,n=0;
        for (let y=50;y<=50*8;y+=50){ //yはpx値
            for (let x=200;x<=150+(50*8);x+=50){ //xはpx値
                if (n==27 ||n==36){       // 白い駒　n=27→M[4][4]の位置 n=36→M[5][5]の位置
                    img="<img src='white.jpg'";
                }
                else if (n==28 || n==35){  // 黒い駒 n=28→M[4][5]の位置 n=36→M[5][4]の位置
                    img="<img src='black.jpg'";
                }
                else {                     // 駒無し
                    img="<img src='green.jpg'";
                }
                body.insertAdjacentHTML("beforeend",img+" id='img"+n+"' style='position:absolute;left:"+x+"px;top:"+y+"px' onclick='yx(event)'>"); //imgタグを生成してstyleもあてる
                n++; //nのインクリメントでループ
            }
        }
        body.insertAdjacentHTML("beforeend","<img id='img64' src='white.jpg' style='position:absolute;left:700px;top:50px'>"); //手番の駒
        body.insertAdjacentHTML("beforeend","<input type='button' id='btn' value='計測' style='position:absolute;left:700px;top:150px'>"); //計測ボタン
    }
    //ここからスタート
    init();
    arrayinit();
    document.getElementById("img64").onclick=function(){ //手番の画像をクリックすると
    	document.getElementById("img64").src="black.jpg"; //白の手番をパスして黒の手番に変わる
    	Flag=!Flag; //フラグ反転
    	setTimeout("computer()",3000); //パスしてから3秒後に黒が指す    
    }
    document.getElementById("btn").onclick=function(){ //計測の関数
        let black=0,white=0;
    	for(let i=1;i<9;i++){ //iのループ
    		for(let j=1;j<9;j++){ //ｊのループ
                switch(M[i][j]){
    				case 1: //「1」の定義はまだ未発見
    					white++; //白のカウントアップ
                        break;
    				case 2: //「2」の定義はまだ未発見
    					black++; //黒のカウントアップ
                        break;
                }
            }
        }
        alert("白"+white+"枚、黒"+black+"枚");
    }