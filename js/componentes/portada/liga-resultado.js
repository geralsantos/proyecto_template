var liga_resultados = {
    template: '#liga-resultados',
    data:()=>({
        equipo_casa:null,

        goles_visitante:0,
        goles_casa:0,
        ligas:null,
        liga:null,
        casas:null,
        visitantes:[],
        mostrar:false,
        partido_liga:[],
        datos_partido:[],
        mensaje:null,
        datos_liga:[],
        loader:false

    }),
    created:function(){
    },
    mounted:function(){
        this.cargar_datos_usuario();
    },
    updated:function(){

    },
    methods:{

        cargar_datos_usuario(){

            this.equipo_casa = null;
            this.goles_visitante = null;
            this.goles_casa = null;
            this.ligas = null;
            this.liga = null;
            this.casas = null;
            this.visitantes = [];
            this.partido_liga=[];
            this.datos_partido=[];

            this.$http.post('cargar_datos_usuario?view',{}).then(function(response){
                if( response.body.resultado ){

                    this.datos_liga = response.body.data;
                    console.log(this.datos_liga)
                    if(this.datos_liga.usuario_creacion_liga == response.body.id_usuario ){

                        if(this.datos_liga.temporada_estado==null){

                            this.mensaje=  'Todavía no inicia la temporada';
                        }else{

                            if(this.datos_liga.temporada_estado>=3){
                                //terminó la temporada
                                this.mensaje=  'La temporada ya terminó.';
                            }if(this.datos_liga.temporada_partidos_generados==0){
                                this.mensaje=  'TODAVÍA NO HAN GENERADO LOS PARTIDOS';
                                this.mostrar=false;
                            }else{

                                if(this.datos_liga.temporada_estado>=3 || this.datos_liga.temporada_estado==0){
                                    this.mensaje=  'Todos los resultados han sido registrados.';
                                    this.mostrar=false;
                                }else{

                                    this.cargar_equipos_casa();
                                }



                            }
                        }


                    }else{
                        this.mensaje=  'No eres administrador de la liga.';
                    }

                }
            });
        },

        guardar(){


            if(this.goles_casa ==null || this.goles_visitante ==null){
                swal("Error", "Debe ingresar la cantidad de goles", "error");
                return false;
            }

            swal({
                title: this.partido_liga.nombre_local.toUpperCase() + ": " + this.goles_casa + " - " + this.partido_liga.nombre_visitante.toUpperCase() + ": " +  this.goles_visitante,
                text: "¿Está seguro de querer registrar este resultado? Una vez registrado no se podrá cambiar. Verifique, si es necesario.",
                icon: "warning",
                buttons: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                    /***** BEGIN PREMIOS */
                    let a = this.goles_casa;
                    let b = this.goles_visitante;
                    let c = this.partido_liga.casa;
                    let d = this.partido_liga.visitante;
                    let valores_1, valores_2, pts_local, pts_visitante = null;

                    if(a>b){
                        //gana local 24
                        //pierde vsitante 22
                        pts_local = 3;
                        pts_visitante = 0;
                        valores_1 = {monto:1, equipo_id:c, temporada_liga_id:this.datos_liga.temporada_id, premios_id:24};
                        valores_2 = {monto:1.5, equipo_id:d, temporada_liga_id:this.datos_liga.temporada_id, premios_id:22};
                    }else if(b>a){
                        //pierde local 22
                        //gana visitante 24
                        pts_local = 0;
                        pts_visitante = 3;
                        valores_1 = {monto:1, equipo_id:d, temporada_liga_id:this.datos_liga.temporada_id, premios_id:24};
                        valores_2 = {monto:1.5, equipo_id:c, temporada_liga_id:this.datos_liga.temporada_id, premios_id:22};

                    }else if(b==a){
                        // empate 23
                        pts_local = 1;
                        pts_visitante = 1;
                        valores_1 = {monto:1.5, equipo_id:d, temporada_liga_id:this.datos_liga.temporada_id, premios_id:23};
                        valores_2 = {monto:1.5, equipo_id:c, temporada_liga_id:this.datos_liga.temporada_id, premios_id:23};

                    }
                    /** END PREMIOS */
                    let valores = {	goles_casa: this.goles_casa, goles_visitante: this.goles_visitante, pts_casa : pts_local, pts_visitante:pts_visitante};
                    this.loader = true;
                   this.$http.post('guardar_resultados_liga?view',{valores_1:valores_1,valores_2:valores_2, valores:valores,partido_liga:this.partido_liga.id, temporada_id:this.datos_liga.temporada_id }).then(function(response){
                        this.loader = false;

                        if( response.body.resultado ){
                            if(response.body.resultados_completos==1){
                               // swal("", "Todos los resultados han sido registrados", "success");
                                swal({
                                    title: " ",
                                    text: "Todos los resultados han sido registrados",
                                    icon: "success",
                                    buttons: false,
                                    dangerMode: false,
                                  })
                                  setTimeout(() => {
                                    window.location.reload(true);
                                }, 3000);
                            }else{
                                swal({
                                    title: " ",
                                    text: "Resultado registrado",
                                    icon: "success",
                                    buttons: false,
                                    dangerMode: false,
                                  });
                                  setTimeout(() => {
                                    window.location.reload(true);
                                }, 3000);

                            }

                        }else{
                            swal({
                                title: " ",
                                text: "Ha ocurrido un error. Intente de nuevo.",
                                icon: "error",
                                buttons: false,
                                dangerMode: true,
                              });
                              setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);

                        }
                    });


                } else {

                  return false;

                }
              });


        },




        cargar_equipos_casa(){

            this.$http.post('cargar_equipos_casa?view',{liga:this.datos_liga.liga_id, temporada_liga_id:this.datos_liga.temporada_id}).then(function(response){
                console.log(response.body)
                if( response.body.resultado ){
                    this.mostrar=true;
                   this.casas= response.body.data;

                }else{
                    this.mensaje=  'Todos los resultados han sido registrados.';
                    this.mostrar=false;
                }
            });
        },
        cargar_equipos_visitante(){

            this.$http.post('cargar_equipos_visitante?view',{temporada_liga:this.datos_liga.temporada_id, equipo_casa:this.equipo_casa}).then(function(response){
                if( response.body.resultado ){
                   this.visitantes= response.body.data;

                }
            });
        },
        /*
        cargar_goles_liga(){

            this.$http.post('cargar_goles_liga?view',{partido_liga:this.partido_liga}).then(function(response){
                if( response.body.resultado ){
                    this.datos_partido = response.body.data;
                    console.log(this.datos_partido);
                    this.goles_casa = this.datos_partido.goles_casa;
                    this.goles_visitante = this.datos_partido.goles_visitante;

                }else{
                    swal("Error", "Un error ha ocurrido", "error");
                }
            });
        },
        */

    }
  }