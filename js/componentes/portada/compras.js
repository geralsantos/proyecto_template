var compras =  {
    template: '#compras',
    data:()=>({
        team:null,
        teams:null,
        liga:null,
        jugadores:[],
        datos_liga:[],

        contador_compras: 0,
        mensaje:'',
        premio:null,
        gasto:null,
        saldo_disponible:null,

        mostrar:false,
        mensaje:null,
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
                    console.log(this.datos_liga);
                    if(this.datos_liga.eliminado==0){
                        if(this.datos_liga.temporada_estado == 3 ){
                            this.cargar_contador_compras();

                        }else if(this.datos_liga.temporada_estado ==  5 ){
                            this.cargar_contador_compras_extemporaneas();

                        }else{
                            this.mostrar = false;
                            this.mensaje = "No estas en período de compras."
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
                        this.cargar_teams_compra();
                        this.mostrar = true;
                    }
                    console.log(this.contador_compras)

                }
            });
        },
        cargar_contador_compras_extemporaneas(){
            let where = {"temporada_liga_id": this.datos_liga.temporada_id,
                        "liga_participantes_id":this.datos_liga.liga_participantes_id, "estado":1};

            this.$http.post('cargar_datos?view',{tabla:"compras", where:where, campos:"count(*) contador_compras"}).then(function(response){
                if( response.body.resultado ){

                    this.contador_compras = response.body.data.contador_compras;
                    if(  this.contador_compras >= 5){
                        this.mensaje = "Haz completado todas tus compras."
                        this.mostrar= false;
                    }else{
                        this.cargar_teams_compra();
                        this.mostrar = true;
                    }
                    console.log(this.contador_compras)

                }
            });
        },

        cargar_teams_compra(){

            let where = {estado:1};
            this.$http.post('cargar_datos_all?view',{tabla:"teams", where:where, orderby:"nombre"}).then(function(response){
                if( response.body.resultado ){
                    this.teams = response.body.data;
                    console.log(this.teams)

                }
            });
        },
        cargar_jugadores_compra(){
            this.loader=true;
            this.$http.post('cargar_jugadores_compra?view',{datos_liga:this.datos_liga, team:this.team}).then(function(response){
                this.loader=false;
                if( response.body.resultado ){
                    this.jugadores = response.body.data;
                }
            });
        },

        comprar(jugador){

            if(this.contador_compras>=5){
                swal("Compra no permitida","No puedes realizar mas de 5 compras" , "warning");
                return false;
            }

            if(parseFloat(this.datos_liga.saldo_disponible) < parseFloat(jugador.valor_jugador)){
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
                    this.$http.post('comprar_jugador?view',{jugador:jugador, liga_participantes:this.datos_liga.liga_participantes_id, temporada_liga_id: this.datos_liga.temporada_id, datos_liga:this.datos_liga}).then(function(response){
                        this.loader = false;
                        if( response.body.resultado ){

                            swal({
                                title: "",
                                text: "Solicitud de compra realizada.",
                                icon: "success",
                                buttons: false,
                                dangerMode: false,
                              })
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);

                        }else{
                            swal({
                                title: "",
                                text: response.body.mensaje,
                                icon: "error",
                                buttons: false,
                                dangerMode: true,
                              })
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);

                        }
                    });
                }
            });


        },
        comprar_extemporaneo(jugador){

            if(this.contador_compras>=5){
                swal("Compra no permitida","No puedes realizar mas de 5 compras" , "warning");
                return false;
            }

            if(parseFloat(this.datos_liga.saldo_disponible) < parseFloat(jugador.valor_jugador)){
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
                    this.$http.post('comprar_jugador_periodo_extemporaneo?view',{jugador:jugador, datos_liga:this.datos_liga}).then(function(response){
                        this.loader = false;
                        if( response.body.resultado ){

                            swal({
                                title: "",
                                text: "Compra realizada.",
                                icon: "success",
                                buttons: false,
                                dangerMode: false,
                              })
                              setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);

                        }else{
                            swal({
                                title: "",
                                text: response.body.mensaje,
                                icon: "error",
                                buttons: false,
                                dangerMode: false,
                              })
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