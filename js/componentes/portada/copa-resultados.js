var copa_resultados = {
    template: '#copa-resultados',
    data:()=>({
        partido:null,
        partidos: [],
        goles_local:null,
        goles_visitante:null,
        datos_liga:[],
        mensaje:null,
        mostrar:false,
        loader:false,


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
            this.$http.post('cargar_datos_usuario?view',{}).then(function(response){

                if( response.body.resultado ){
                    this.datos_liga = response.body.data;
                    console.log( this.datos_liga)

                    if(this.datos_liga.temporada_estado){
                        if(this.datos_liga.temporada_estado==2){
                            this.mensaje = "Todavía no inicia la temporada";
                            this.mostrar= false;

                        }else{
                            if(this.datos_liga.temporada_partidos_generados==1 ){
                                this.cargar_partidos_copa();
                            }else{
                                this.mensaje = "Todavía no han generado los partidos";
                                this.mostrar= false;
                            }
                        }

                    }else{
                        this.mensaje = "Todavía no inicia la temporada";
                        this.mostrar= false;
                    }
                }else{
                    this.mensaje = "No perteneces a ninguna liga";
                    this.mostrar= false;
                }
            });
        },
        cargar_partidos_copa(){
            this.$http.post('cargar_partidos_copa?view',{temporada_liga:this.datos_liga.temporada_id}).then(function(response){
                if( response.body.resultado ){
                    this.partidos = response.body.data;
                    console.log(this.partidos)
                    this.mostrar = true;
                }else{
                   // swal("", "Ha ocurrido un error", "error");
                   this.mensaje = "Todos los partidos han sido registrados";
                   this.mostrar= false;

                }
            });
        },
        /*
        cargar_partido_copa(){
            let where = {id:this.partido.id};
            this.goles_local = null;
            this.goles_visitante = null;
            this.$http.post('cargar_datos?view',{tabla:'partidos_copa', campos: '*', where:where }).then(function(response){
                if( response.body.resultado ){
                    this.goles_local = response.body.data.goles_local;
                    this.goles_visitante = response.body.data.goles_visitante;
                }else{
                    swal("", "Ha ocurrido un error", "error");
                }
            });
        },
        */
        guardar(){



            if(this.goles_local == null || this.goles_visitante == null){
                swal("", "Debe introducir la cantidad de goles", "warning");
                return false;
            }
            if(this.goles_local == this.goles_visitante ){
                swal("", "Debe existir un ganador", "warning");
                return false;
            }
            if(this.partido.eliminado_local==1 && this.partido.eliminado_visitante==1){
                //no pasa nada
            }else{
                if(this.partido.eliminado_local==1){
                    if(this.goles_local > this.goles_visitante ){
                        swal("", "EL equipo "+this.partido.nombre_local+" ha sido eliminado. Debes regitrarlo como perdedor", "warning");
                        return false;
                    }
                }
                if(this.partido.eliminado_visitante==1){
                    if(this.goles_visitante > this.goles_local ){
                        swal("", "El equipo "+this.partido.nombre_visitante+" ha sido eliminado. Debes regitrarlo como perdedor", "warning");
                        return false;
                    }
                }
            }


            swal({
                title: this.partido.nombre_local.toUpperCase() + ": " + this.goles_local + " - " + this.partido.nombre_visitante.toUpperCase() + ": " +  this.goles_visitante,
                text: "¿Está seguro de querer registrar este resultado? Una vez registrado no se podrá cambiar. Verifique, si es necesario.",
                icon: "warning",
                buttons: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                    let equipo_ganador = null;
                    let equipo_perdedor = null;

                    if( this.goles_local >= this.goles_visitante ){
                        equipo_ganador = this.partido.equipo_local;
                        equipo_perdedor = this.partido.equipo_visitante;
                    }

                    if( this.goles_visitante > this.goles_local ){
                        equipo_ganador = this.partido.equipo_visitante;
                        equipo_perdedor = this.partido.equipo_local;
                    }


                    let where = {id:this.partido.id};
                    let campos = {  goles_local: this.goles_local,
                                    goles_visitante:this.goles_visitante,
                                    registrado:1,
                                    equipo_ganador : equipo_ganador,
                                    equipo_perdedor : equipo_perdedor
                                }
                                this.loader = true;


                    this.$http.post('guardar_resultados_copa?view',{valores: campos, where:where, temporada_liga_id:this.datos_liga.temporada_id,liga_id:this.datos_liga.liga_id, liga_participantes_id:this.datos_liga.liga_participantes_id, partido:this.partido}).then(function(response){
                        this.loader = false;
                        if( response.body.resultado ){
                            swal({
                                title: "",
                                text: response.body.mensaje,
                                icon: "success",
                                buttons: false,
                                dangerMode: false,
                              });
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);
                        }else{
                            swal({
                                title: "",
                                text: "Ha ocurrido un error. Intente de nuevo",
                                icon: "error",
                                buttons: false,
                                dangerMode: true,
                              });
                         /*   setTimeout(() => {
                                window.location.reload(true);
                            }, 3000); */
                        }
                    });

                } else {

                  return false;

                }
              });


        }

    }
}