var compras_otro_equipo ={
    template: '#compras-otro-equipo',
    data:()=>({

        liga:null,
        jugadores:[],
        datos_liga:[],
        contador_compras: 0,
        mostrar:false,
        mensaje:null,
        jugadores_comprados:[],
        equipo:null,
        equipos:[],
        jugadores:[],
        plantilla:[],
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
                    this.mostrar=true;
                    console.log(this.datos_liga);
                    if(this.datos_liga.eliminado==0){
                        if(this.datos_liga.temporada_estado == 3){
                            this.cargar_contador_compras();
                        }else{
                            this.mostrar = false;
                            this.mensaje = "No estas en período de negociaciones."
                        }
                    }else{
                        this.mensaje = "Tu equipo ha sido eliminado."
                        this.mostrar= false;
                    }

                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });

        },
        cargar_contador_compras(){
            let where = {"temporada_liga_id": this.datos_liga.temporada_id,
                        "liga_participantes_id":this.datos_liga.liga_participantes_id, "estado":1};

            this.$http.post('cargar_datos?view',{tabla:"jugadores_subastas", where:where, campos:"count(*) contador_compras"}).then(function(response){
                if( response.body.resultado ){

                    this.contador_compras = response.body.data.contador_compras;
                    if(  this.contador_compras >= 5){
                        this.mensaje = "Haz completado todas tus compras."
                        this.mostrar= false;
                    }else{
                        this.cargar_equipos();
                        this.mostrar = true;
                    }
                    console.log(this.contador_compras)

                }
            });
        },

        cargar_equipos(){

            let where = {liga_id:this.datos_liga.liga_id }
            this.$http.post('cargar_datos_all?view',{tabla:'equipos',where:where, orderby:'nombre'}).then(function(response){
                if( response.body.resultado ){
                    this.equipos= response.body.data;
                    for (let index = 0; index < this.equipos.length; index++) {

                        if(this.equipos[index]["eliminado"]==1){
                            this.equipos.splice(index,1);
                        }
                        if(this.equipos[index]["id"]==this.datos_liga.equipo_id){
                            this.equipos.splice(index,1);
                        }
                    }
                    console.log(this.equipos)
                }

            });

        },


        cargar_plantilla_otro_equipo(){
            let datos_liga = this.datos_liga;

            this.$http.post('cargar_plantilla?view',{jugadores:this.equipo.jugadores, datos_liga:datos_liga, equipo_id:this.equipo.id}).then(function(response){
                if( response.body.resultado ){
                    this.plantilla = response.body.plantilla;
                }
            });
        },

        comprar(jugador){

            if(this.contador_compras>=5){
                swal("Compra no permitida","No puedes realizar mas de 5 compras" , "warning");
                return false;
            }

            if(parseFloat(this.datos_liga.saldo_disponible) < parseFloat(jugador.valor_compra)){
                swal("Compra no permitida","Saldo No Disponible" , "warning");
                return false;
            }
            swal({
                title: "",
                text: "¿Estas seguro de querer comprar al jugador: "+ jugador.nombre+ "?",
                icon: "warning",
                buttons: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                    this.loader = true;
                    this.$http.post('comprar_otro_equipo_jugador?view',{ jugador:jugador,datos_liga:this.datos_liga, equipo_id:this.equipo.id}).then(function(response){
                        this.loader = false;
                        if( response.body.resultado ){

                            swal({
                                title: "",
                                text: "Solicitud de compra realizada.",
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
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);

                        }
                    });
                }
            });


        },


    }
  }