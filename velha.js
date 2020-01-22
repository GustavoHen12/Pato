class jg{
    constructor()
    {
        this._tab = [[0,0,0],[0,0,0],[0,0,0]];
    }

    get tab()
    {
        return this._tab;
    }

    set tab(tab)
    {
        this._tab = tab;
    }
}


class controle
{
    fimDeJogo(ganhador)
    {
        if(ganhador == 1){
            alert("Parabéns, você é digno");
            window.location.href = "principal.html";
        }
        else{
            alert("Lamento, você é indigno de continuar");
            location.reload();
        }

    }
    //verifica se ja tem alguma peca
    disponivel(lin, col)
    {
        let tabu = { new: jogo.tab };
        if(tabu.new[lin][col] == 0)
        {
            return true;
        } 
        else
        {
            return false;
        }
    }

    veri_lincol(tabu, ind, lc)
    {
        let res = false;
        let diag;
        if(lc == 0)
        {
            if((tabu[0][ind] == tabu[1][ind]) && (tabu[2][ind] == tabu[1][ind])){
                res = true;
            }
        }
        else
        {
            if(lc == 2)
            {
                if(tabu[1][1] != 0)
                {
                    if((tabu[0][0] == tabu[1][1]) && (tabu[2][2] == tabu[1][1])){
                        diag = 1;//diagonal principal
                        res = true;
                    }
                    else{
                        if((tabu[0][2] == tabu[1][1]) && (tabu[2][0] == tabu[1][1])){
                            diag = 2;//diagonal secundaria
                            res = true;
                        }
                    }
                }
            }
            else{
                if((tabu[ind][0] == tabu[ind][1]) && (tabu[ind][2] == tabu[ind][1])){
                    res = true;
                }
            }
        }
        
        let pos = {
            int: 0,
            str:""
        }
        if (res == true)
        {
            for(let i = 0; i < 3; i++)
            {
                if(lc == 0){
                    pos.int = (i*10)+ind;
                    pos.str = pos.int.toString();
                }
                else{
                    if(lc == 2)
                    {
                        //diagonal primaria ou secundaria
                        if(diag == 2){
                            ind = i + ((i*-1*2)+2);
                        }
                        else{
                            ind = i;
                        }
                        pos.int = (i*10)+ind;
                        pos.str = pos.int.toString();
                    }
                    else{
                        pos.int = (ind*10)+i;
                        pos.str = pos.int.toString();
                    }
                }
                if(pos.str.length == 1){
                    let zero = '0';
                    document.getElementById(zero.concat(pos.str)).classList.add("ganha"); 
                }
                else{
                    document.getElementById(pos.str).classList.add("ganha");
                }
            }
        }
        return res;
    }

    //verifica apenas se o usuario ganhou ou perdeu e seta classe
    verifica_fim()
    {
        let tabu = jogo.tab;
        let res = {
            qual : 0,
            ganhador: false
        };
        let i = 0;
        //verifica linhas e colunas
        while((res.ganhador == false) && (i <= 2))
        {
            if(tabu[i][i] !== 0)
            {
                //0- linha  1- coluna
                res.ganhador = ctrl.veri_lincol(tabu, i, 0) ||
                                ctrl.veri_lincol(tabu, i, 1);
                res.qual = tabu[i][i];
            }
            i++;
        }
        
        if(res.ganhador)
        {
            return res.qual;
        }
        //verifica diagonal se ninguem ganhou
        else
        {
            if(ctrl.veri_lincol(tabu, 1, 2))
            {
                return tabu[1][1];
            }
            else{
                return 0;
            }
        }

    }

    //verifica se deu velha
    //retorna true se deu velha e false se nao
    verifica_velha()
    {
        let tabu = jogo.tab; 
        let veri = 0;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(tabu[i][j] !== 0){
                    veri++;
                }
            }
        }
        if(veri == 9){
            return true;
        }
        else{
            return false;
        }
    }
}

class usuario
{
    joga(pos)
    {
        //coloca no botao
        document.getElementById(pos).innerHTML = "X";
        document.getElementById(pos).disable = true; 

        //converte e pega a posicao
        let z = parseInt(pos, 10);
        let lin = Math.trunc(z/10);
        let col = z % 10;

        let tabu = { new: jogo.tab } 
        tabu.new[lin][col] = 1;
        jogo.tab = tabu.new;
    }
}

class pc
{ 
    joga()
    {
        let tabu = { new: jogo.tab };
        let pos = {
            lin : 0,
            col : 0
        }; 
        //"inteligencia"
        //acha um lugar livre aleatoriamente
        while(tabu.new[pos.lin][pos.col] !== 0)
        {
            pos.lin = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            pos.col = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        }
        //joga
        tabu.new[pos.lin][pos.col] = 2;
        jogo.tab = tabu.new; 

        //configura no tabuleiro
        pos.lin = pos.lin * 10;
        pos.lin = pos.lin + pos.col;
        let pos_str = pos.lin.toString();
        if(pos_str.length == 1){
            let zero = '0';
            document.getElementById(zero.concat(pos_str)).innerHTML = "O";
            document.getElementById(zero.concat(pos_str)).disable = true; 
        }
        else{
            document.getElementById(pos_str).innerHTML = "O";
            document.getElementById(pos_str).disable = true;
        } 
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let u = new usuario;
let p = new pc;
let ctrl = new controle;
let jogo = new jg();

let res = {
    fim : false,
    ganhador: 0
}

async function u_joga (pos)
{
    if (res.fim == false)
    {
        //chama o metodo do usuario
        u.joga(pos);
        //verifica fim do jogo
        res.ganhador = ctrl.verifica_fim();
        res.fim = ctrl.verifica_velha() || (res.ganhador != 0);
        if(res.fim == false)
        {
            //pc joga
            p.joga();
            //verifica fim do jogo
            res.ganhador = ctrl.verifica_fim();
        }   
    }
    else
    {
        alert("fim do jogo");
    }
    //mensagens se alguem ganhou
    if((res.ganhador != 0) || res.fim)
    {
        await sleep(2000);
        ctrl.fimDeJogo(res.ganhador);
    }
    
}