var liga_tabla_clasificacion = {
    template: '#liga-tabla-clasificacion',
    data:()=>({
        equipos:[],
        liga:[]

    }),
    created:function(){
    },
    mounted:function(){
        this.ver_tabla();

    },
    updated:function(){

    },
    methods:{

        ver_tabla(){

            let id_liga = document.getElementById("mensaje_entre_componentes").value;
            this.datos_liga(id_liga);
            this.$http.post('buscar_equipos_tabla?view',{id_liga:id_liga}).then(function(response){
                if(response.body.resultado){
                    this.equipos=response.body.data;
                    let = pts_partidos_ganados = 0;
                    let =  pts_partidos_perdidos = 0;
                    let =  pts_total = 0;

                    for (let i = 0; i < this.equipos.length; i++) {

                        pts_partidos_ganados=  this.equipos[i].partidos_ganados * 3;
                        pts_partidos_empatados=  this.equipos[i].partidos_empatados * 1;
                        pts_total = pts_partidos_ganados + pts_partidos_empatados;
                        partidos_jugados = parseInt(this.equipos[i].partidos_empatados) + parseInt(this.equipos[i].partidos_ganados) + parseInt(this.equipos[i].partidos_perdidos);
                        this.equipos[i].puntos = pts_total;
                        this.equipos[i].partidos_jugados = partidos_jugados;
                    }
                    this.equipos.sort(compare);
                }
                this.remover_mensaje_entre_componentes();
            });
        },
        remover_mensaje_entre_componentes(){
            var input = document.getElementById("mensaje_entre_componentes");
            input.parentNode.removeChild(input)
        },
        datos_liga(id){
            let where = {id:id}
            this.$http.post('cargar_datos?view',{tabla:'liga', where:where, campos:'*' }).then(function(response){
                if(response.body.resultado){
                    this.liga= response.body.data;
                    console.log(this.liga)
                }
            });
        }

    }
  }