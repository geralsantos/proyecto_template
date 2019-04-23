var liga_historial = {
    template: '#liga-historial',
    data:()=>({

        ligas:[],
        liga:null,
        temporadas:[],
        temporada:null,
        equipos:[],
        mostrar:false,
        mensaje:null,
        ver_tabla:false

    }),
    created:function(){
    },
    mounted:function(){
        this.cargar_datos_usuario();

    },
    updated:function(){
        console.log("2222");
    },
    methods:{
        cargar_datos_usuario(){

            this.$http.post('cargar_datos_usuario?view',{}).then(function(response){
                if( response.body.resultado ){
                    this.datos_liga = response.body.data;
                    console.log(this.datos_liga);

                    this.cargar_ligas();
                }else{
                    this.cargar_ligas();

                }
            });

        },
        cargar_ligas(){

            this.ligas= [];
            this.liga=null;
            this.temporadas=[];
            this.temporada=null;
            this.equipos=[];

            this.$http.post('cargar_ligas?view',{}).then(function(response){
                if(response.body.resultado){
                    this.ligas= response.body.ligas;
                    this.mostrar= true;
                    console.log(this.ligas)
                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });
        },
        cargar_temporadas(){
            console.log(this.liga)
            let where = {liga_id:this.liga}
            this.$http.post('cargar_datos_all?view',{tabla:'temporada_liga', where:where, orderby:'numero DESC'}).then(function(response){
                if(response.body.resultado){
                    this.ver_tabla=true;
                    this.temporadas= response.body.data;
                    console.log(this.temporadas)
                }else{
                    this.ver_tabla=false;
                    this.cargar_ligas();
                    swal("", "Aún no ha iniciado la temporada", "warning");

                }
            });
        },
        cargar_tabla(){

            this.$http.post('buscar_equipos_tabla_by_temporada?view',{liga_id:this.liga, temporada_id:this.temporada.id}).then(function(response){
                console.log(response.body.data)
                if(response.body.resultado){
                    this.equipos=response.body.data;
                    let  pts_partidos_ganados = 0;
                    let   pts_total = 0;

                    for (let i = 0; i < this.equipos.length; i++) {
                        this.equipos[i].partidos_ganados= (this.equipos[i].partidos_ganados!=null)?this.equipos[i].partidos_ganados:0;
                        this.equipos[i].partidos_empatados= (this.equipos[i].partidos_empatados!=null)?this.equipos[i].partidos_empatados:0;
                        this.equipos[i].partidos_perdidos= (this.equipos[i].partidos_perdidos!=null)?this.equipos[i].partidos_perdidos:0;
                        pts_partidos_ganados=  this.equipos[i].partidos_ganados * 3;
                        pts_partidos_empatados= this.equipos[i].partidos_empatados * 1;
                        pts_total = pts_partidos_ganados + pts_partidos_empatados;
                        partidos_jugados = parseInt(this.equipos[i].partidos_empatados) + parseInt(this.equipos[i].partidos_ganados) + parseInt(this.equipos[i].partidos_perdidos);
                        this.equipos[i].puntos = pts_total;
                        this.equipos[i].partidos_jugados = partidos_jugados;
                    }
                    this.equipos.sort(compare);
                }
            });
        },
    }
  }